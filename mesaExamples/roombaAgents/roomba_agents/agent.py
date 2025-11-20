from mesa.discrete_space import CellAgent, FixedAgent
from collections import deque

class RoombaAgent(CellAgent):
    """
    Agent that moves randomly.
    Attributes:
        unique_id: Agent's ID
    """
    def __init__(self, model, cell, energy=100):
        """
        Creates a new random agent.
        Args:
            model: Model reference for the agent
            cell: Reference to its position within the grid
        """
        super().__init__(model)
        self.condition = "Roombas"
        self.state = "Exploring" # Initial state
        self.cell = cell
        self.energy = energy
        self.home_station = cell  # Original position of the charging station of each agent
        self.known_stations = [cell] # List of possible charging stations
        self.moves = 0
        self.path_to_station = None  # Para almacenar el camino hacia la estación
        self.consecutive_charging_steps = 0  # Contador de pasos cargando

    def clean(self):
        """
        If possible, clean dirt at current location.
        """
        dirt = [obj for obj in self.cell.agents if isinstance(obj, DirtAgent)]
        if dirt:  # If there are any dirt present, clean it
            dirt_to_eat = self.random.choice(dirt)
            dirt_to_eat.remove()
            return True  # Successfully cleaned
        return False  # No dirt to clean

    def explore(self):
        """
        Move around the place avoiding obstacles
        """
        # Find possible cells without obstacles
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )

        # Among all possible cells, prefer those with dirt
        cells_with_dirt = cells_without_obstacles.select(
            lambda cell: any(isinstance(obj, DirtAgent) for obj in cell.agents)
        )

        # Move to cells with dirt if available
        if cells_with_dirt: 
            self.cell = cells_with_dirt.select_random_cell()
            self.moves += 1
            return True
        
        # Move to any available cell without obstacles
        if cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            self.moves += 1
            return True
            
        return False  # Couldn't move

    def communicate(self):
        """
        Communicate with other agents if possible
        """
        other_roombas = [obj for obj in self.cell.agents if isinstance(obj, RoombaAgent) and obj != self]
        
        if other_roombas:
            for roomba in other_roombas:
                # Share the knowledge of charging stations with others
                for station in self.known_stations:
                    if station not in roomba.known_stations:
                        roomba.known_stations.append(station)
                # Obtain the knowledge of charging stations from others
                for station in roomba.known_stations:
                    if station not in self.known_stations:
                        self.known_stations.append(station)
            return True  # Communication happened
        return False  # No other roombas to communicate with

    def find_nearest_station_bfs(self):
        """
        Encuentra la estación más cercana usando BFS
        Retorna el camino hacia la estación más cercana
        """
        if not self.known_stations:
            return None
            
        # Verificar si ya estamos en una estación
        if any(isinstance(obj, ChargingStation) for obj in self.cell.agents):
            return []
        
        # BFS para encontrar el camino más corto a cualquier estación conocida
        visited = set()
        queue = deque()
        queue.append((self.cell, []))  # (celda_actual, camino_hasta_ahora)
        visited.add(self.cell)
        
        while queue:
            current_cell, path = queue.popleft()
            
            # Verificar si esta celda tiene una estación de carga
            if any(isinstance(obj, ChargingStation) for obj in current_cell.agents):
                return path  # Retornar el camino para llegar aquí
            
            # Explorar vecinos
            for neighbor in current_cell.neighborhood:
                if neighbor not in visited:
                    # Verificar que la celda no tenga obstáculos
                    if not any(isinstance(obj, ObstacleAgent) for obj in neighbor.agents):
                        visited.add(neighbor)
                        new_path = path + [neighbor]
                        queue.append((neighbor, new_path))
        
        return None  # No se encontró camino

    def move_along_path(self, path):
        """
        Mueve el agente a lo largo del camino
        """
        if path and len(path) > 0:
            next_cell = path[0]
            self.cell = next_cell
            self.moves += 1
            return True
        return False

    def go_back(self):
        """
        Return to the nearer charging station using BFS
        """
        # Check if current cell is a charging station
        is_charging_station = any(isinstance(obj, ChargingStation) for obj in self.cell.agents)
        
        # If already in a station, change the state
        if is_charging_station:
            self.state = "Charging"
            self.path_to_station = None  # Limpiar el camino
            return True
        
        # Si no tenemos un camino o el camino está vacío, calcular uno nuevo
        if self.path_to_station is None or len(self.path_to_station) == 0:
            self.path_to_station = self.find_nearest_station_bfs()
            
            # Si no se encontró camino, intentar movimiento aleatorio
            if self.path_to_station is None:
                cells_without_obstacles = self.cell.neighborhood.select(
                    lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
                )
                if cells_without_obstacles:
                    self.cell = cells_without_obstacles.select_random_cell()
                    self.moves += 1
                    return True
                return False
        
        # Mover a lo largo del camino
        if self.path_to_station and len(self.path_to_station) > 0:
            moved = self.move_along_path(self.path_to_station)
            if moved:
                # Actualizar el camino (remover la celda a la que nos movimos)
                self.path_to_station = self.path_to_station[1:]
                
                # Verificar si llegamos a una estación
                if any(isinstance(obj, ChargingStation) for obj in self.cell.agents):
                    self.state = "Charging"
                    self.path_to_station = None
                return True
        
        # Fallback: movimiento aleatorio si BFS falla
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )
        if cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            self.moves += 1
            # Recalcular camino en el siguiente paso
            self.path_to_station = None
            return True
            
        return False

    def charging(self):
        """
        Wait until the energy is equal or higher than 50
        """
        # Look for a charging station
        charging_station = [obj for obj in self.cell.agents if isinstance(obj, ChargingStation)]
        
        if charging_station: 
            # Recharge
            self.energy = min(100, self.energy + 5)
            self.consecutive_charging_steps += 1

            # Add if not already in known stations
            if self.cell not in self.known_stations:
                self.known_stations.append(self.cell)
            
            if self.energy >= 70 or self.consecutive_charging_steps >= 8:
                self.state = "Exploring" # If enough charge
                self.path_to_station = None  # Limpiar cualquier camino pendiente
            # else remains in Charging state
            return True
        else:
            # Find station if not found
            self.state = "Returning"
            self.path_to_station = None  # Forzar recalcular camino
            return False

    def step(self):
        """
        State machine
        1. Charging (highest priority)
        2. Returning
        3. Cleaning
        4. Communicating
        5. Exploring (default state, lower priority)
        """
        
        if self.state != "Charging":
            self.energy -= 1 # Each step uses 1% of energy

        # Check for critical conditions first
        if self.energy <= 20 and self.state != "Charging":
            self.state = "Returning"
            self.path_to_station = None  # Forzar recalcular camino cuando cambia a Returning
        
        # Check for dirt in current cell (opportunistic cleaning)
        dirt_present = any(isinstance(obj, DirtAgent) for obj in self.cell.agents)
        if dirt_present and self.state not in ["Returning", "Charging"]:
            self.state = "Cleaning"
        
        # Check for other roombas (opportunistic communication)
        other_roombas_present = any(isinstance(obj, RoombaAgent) and obj != self 
                                  for obj in self.cell.agents)
        if other_roombas_present and self.state not in ["Returning", "Charging", "Cleaning"]:
            self.state = "Communicating"

        # State machine execution
        if self.state == "Charging":
            self.charging()
            
        elif self.state == "Returning":
            success = self.go_back()
            # Si no pudo moverse (atrapado), intentar explorar para escapar
            if not success:
                self.state = "Exploring"
                self.path_to_station = None
            
        elif self.state == "Cleaning":
            cleaned = self.clean()
            if not cleaned:  # If no dirt was cleaned, go back to exploring
                self.state = "Exploring"
            
        elif self.state == "Communicating":
            communicated = self.communicate()
            self.state = "Exploring"  # Return to exploring after communication
            
        elif self.state == "Exploring":
            self.explore()

        # Handle death
        if self.energy <= 0:
            self.remove()


class ObstacleAgent(FixedAgent):
    """
    Obstacle agent. Just to add obstacles to the grid.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.condition = "Obstacle"
        self.cell=cell

    def step(self):
        pass

class ChargingStation(FixedAgent):
    """
    Changing station agent. Just to add charging station to the grid.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.condition = "Stations"
        self.cell=cell

    def step(self):
        pass

class DirtAgent(FixedAgent):
    """
    Dirt agent. Appears randomly and can be "eaten" by the Roombas.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.condition = "Dirt"
        self.cell=cell

    def step(self):
        pass

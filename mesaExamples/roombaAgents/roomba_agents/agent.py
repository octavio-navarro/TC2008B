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
            energy: Amount of battery used to initialize the roombas
        """
        super().__init__(model)
        self.cell = cell
        self.condition = "Roombas" # Condición del agente (tipo)
        self.state = "Exploring" # Estado inicial
        self.energy = energy
        self.home_station = cell  # Posición original de la estación de carga de cada agente
        self.known_stations = [cell] # Lista de posibles estaciones de carga
        self.moves = 0 # Contador de movimientos
        self.path_to_station = None  # Para almacenar el camino hacia la estación
        self.consecutive_charging_steps = 0  # Contador de pasos cargando

    def clean(self):
        """
        If possible, clean dirt at current location.
        """
        dirt = [obj for obj in self.cell.agents if isinstance(obj, DirtAgent)]
        if dirt:  # Si hay celdas con suciedad, elegir para limpiar
            dirt_to_eat = self.random.choice(dirt)
            dirt_to_eat.remove()
            return True  # Se completó la tarea de limpieza
        return False  # No se completó la tarea de limpieza

    def explore(self):
        """
        Move around the place avoiding obstacles
        """
        # Encontrar celdas potenciales sin obstáculos
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )

        # Encontrar celdas potenciales con suciedad
        cells_with_dirt = cells_without_obstacles.select(
            lambda cell: any(isinstance(obj, DirtAgent) for obj in cell.agents)
        )

        # Moverse a celdas con suciedad si se encuentran
        if cells_with_dirt: 
            self.cell = cells_with_dirt.select_random_cell()
            self.moves += 1
            return True
        
        # Moverse a celdas sin obstáculos si se encuentran
        if cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            self.moves += 1
            return True
            
        return False  # Misión fallida :(

    def communicate(self):
        """
        Communicate with other agents if possible
        """
        other_roombas = [obj for obj in self.cell.agents if isinstance(obj, RoombaAgent) and obj != self]
        
        if other_roombas:
            for roomba in other_roombas:
                # Compartir su conocimiento con otras Roombas (posición de las estaciones de carga conocidas)
                for station in self.known_stations:
                    if station not in roomba.known_stations:
                        roomba.known_stations.append(station)
                # Obtener el conocimiento de otras Roombas (posición de las estaciones de carga conocidas por otros)
                for station in roomba.known_stations:
                    if station not in self.known_stations:
                        self.known_stations.append(station)
            return True  # Misión exitosa
        return False  # Misión fallida

    def find_nearest_station_bfs(self):
        """
        Find the nearest station using BFS, and return the corresponding path to arrive to it 
        """
        if not self.known_stations:
            return None
            
        # Verificar si el roomba ya está en una estación
        if any(isinstance(obj, ChargingStation) for obj in self.cell.agents):
            return []
        
        # BFS para encontrar el camino más corto a cualquier estación conocida
        visited = set()
        queue = deque()
        queue.append((self.cell, []))
        visited.add(self.cell)
        
        while queue:
            current_cell, path = queue.popleft()
            
            # Verificar si la celda tiene una estación de carga
            if any(isinstance(obj, ChargingStation) for obj in current_cell.agents):
                return path 
            
            # Explorar vecinos
            for neighbor in current_cell.neighborhood:
                if neighbor not in visited:
                    # Verificar que la celda no tenga obstáculos
                    if not any(isinstance(obj, ObstacleAgent) for obj in neighbor.agents):
                        visited.add(neighbor)
                        new_path = path + [neighbor]
                        queue.append((neighbor, new_path))
        
        return None 

    def move_along_path(self, path):
        """
        Move the agent through the path
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
        # # Verificar si la celda actual es una estación de carga
        is_charging_station = any(isinstance(obj, ChargingStation) for obj in self.cell.agents)
        
        # Cambiar el estado SI ya está en una estación de carga
        if is_charging_station:
            self.state = "Charging"
            self.path_to_station = None  
            return True
        
        # Si no hay camino, calcular uno nuevo
        if self.path_to_station is None or len(self.path_to_station) == 0:
            self.path_to_station = self.find_nearest_station_bfs()
            
            # Si no hay camino, intentar movimiento aleatorio
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
                # Actualizar el camino (quitar celda recorrida)
                self.path_to_station = self.path_to_station[1:]
                
                # Verificar si ya está em una estación
                if any(isinstance(obj, ChargingStation) for obj in self.cell.agents):
                    self.state = "Charging"
                    self.path_to_station = None
                return True
        
        # Movimiento aleatorio como backup plan
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )
        if cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            self.moves += 1
            self.path_to_station = None
            return True
            
        return False

    def charging(self):
            """
            Wait until the energy is equal or higher than 50
            """
            # Buscar estación de carga
            charging_station = [obj for obj in self.cell.agents if isinstance(obj, ChargingStation)]
            
            # Cargar si está en una estación de carga
            if charging_station: 
                self.energy = min(100, self.energy + 5)
                self.consecutive_charging_steps += 1

                # Añadir si no forma parte de las estaciones previamente conocidas
                if self.cell not in self.known_stations:
                    self.known_stations.append(self.cell)
                
                # Verificar si ya se recargó lo suficiente o si cumplió con el máximo de ciclos de carga
                if self.energy >= 70 or self.consecutive_charging_steps >= 8:
                    self.state = "Exploring" # If enough charge
                    self.consecutive_charging_steps = 0  # Reiniciar contador
                    self.path_to_station = None  # Limpiar cualquier camino pendiente
                return True
            else:
                # Encontrar la estación si algo falla
                self.state = "Returning"
                self.path_to_station = None 
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

        # Verificar si necesita cargar batería
        if self.energy <= 20 and self.state != "Charging":
            self.state = "Returning"
            self.path_to_station = None

        # Toma de deciones basada en una máquina de estados
        if self.state == "Returning":
            success = self.go_back()
            if not success: # Si no pudo moverse (atrapado), intentar explorar para escapar
                self.state = "Exploring"
                self.path_to_station = None

        elif self.state == "Charging":
            self.charging()

        elif self.state == "Exploring":
            # Intentar comunicar si hay otros roombas
            other_roombas = [obj for obj in self.cell.agents if isinstance(obj, RoombaAgent) and obj != self]
            if other_roombas:
                self.communicate()
            
            # Intentar limpiar si hay suciedad
            dirt_present = any(isinstance(obj, DirtAgent) for obj in self.cell.agents)
            if dirt_present:
                cleaned = self.clean()
                if not cleaned:  # Si no se pudo limpiar, explorar
                    self.explore()
            else:
                # Si no hay suciedad, explorar
                self.explore()
                    
        # Cada step usa 1% de energía (excepto el de carga)
        if self.state != "Charging":
            self.energy -= 1

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

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

        self.energy = energy # Batería inicial
        self.home_station = cell  # Posición original de la estación de carga de cada agente
        self.moves = 0 # Contador de movimientos
        self.consecutive_charging_steps = 0  # Contador de pasos cargando
        self.cells_cleaned = 0 # Contador de celdas limpiadas
        
        self.known_stations = [cell] # Lista de posibles estaciones de carga
        self.path_to_station = None  # Para almacenar el camino hacia la estación
        self.visited_locations = set() # Lista de celdas visitadas
        self.shared_visited_locations = set() # Lista compartida (con otros roombas) de las celdas visitadas
        
        
    def clean(self):
        """
        If possible, clean dirt at current location.
        """
        dirt = [obj for obj in self.cell.agents if isinstance(obj, DirtAgent)]
        if dirt:  # Si hay celdas con suciedad, elegir para limpiar
            dirt_to_eat = self.random.choice(dirt)
            dirt_to_eat.remove()
            self.cells_cleaned += 1 
            return True  # Se completó la tarea de limpieza
        return False  # No se completó la tarea de limpieza

    def explore(self):
        """
        Move around the place avoiding obstacles
        """
        # Agregar ubicación actual
        self.visited_locations.add(self.cell)
        self.shared_visited_locations.add(self.cell)

        # Encontrar celdas potenciales sin obstáculos
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )

        if not cells_without_obstacles:
            return False

        # Priorizar por tipo de celda
        prioritized_cells = self.prioritize_cells(cells_without_obstacles)
        
        if prioritized_cells:
            target_cell = self.random.choice(prioritized_cells)
            self.cell = target_cell
            self.moves += 1
            return True
            
        return False

    def prioritize_cells(self, available_cells):
        """
        Strategy to priorize cells according to the type of cells found nearby
        
        Prioridad: 
        1. No exploradas con basura
        2. No exploradas
        3. Exploradas con basura
        4. Exploradas
        """
        categories = {
            'unexplored_with_dirt': [],
            'unexplored_no_dirt': [], 
            'explored_with_dirt': [],
            'explored_no_dirt': []
        }
        
        for cell in available_cells:
            has_dirt = any(isinstance(obj, DirtAgent) for obj in cell.agents)
            is_unexplored = (cell not in self.visited_locations and 
                           cell not in self.shared_visited_locations)
            
            if is_unexplored and has_dirt:
                categories['unexplored_with_dirt'].append(cell)
            elif is_unexplored and not has_dirt:
                categories['unexplored_no_dirt'].append(cell)
            elif not is_unexplored and has_dirt:
                categories['explored_with_dirt'].append(cell)
            else:
                categories['explored_no_dirt'].append(cell)
        
        for category in ['unexplored_with_dirt', 'unexplored_no_dirt', 'explored_with_dirt', 'explored_no_dirt']:
            if categories[category]:
                return categories[category]
        
        return available_cells

    def communicate(self):
        """
        Communicate with other agents if possible
        """
        other_roombas = [obj for obj in self.cell.agents if isinstance(obj, RoombaAgent) and obj != self]
        
        if other_roombas:
            for roomba in other_roombas:
                # Compartir su conocimiento con otras Roombas 
                for station in self.known_stations: # Posición de las estaciones de carga conocidas
                    if station not in roomba.known_stations:
                        roomba.known_stations.append(station)
                for visited_locations in self.visited_locations:
                    roomba.shared_visited_locations.add(visited_locations
                    )
                # Obtener el conocimiento de otras Roombas 
                for station in roomba.known_stations:
                    if station not in self.known_stations:
                        self.known_stations.append(station)

                for visited_location in roomba.visited_locations:
                    self.shared_visited_locations.add(visited_location)

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
        # Verificar si la celda actual es una estación de carga
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

    def print_final_stats(self):
        """
        Print stats if an agent dies
        """
        print(f"******** Agente {self.unique_id} se quedó sin batería - Estadísticas ********")
        print(f"• Steps totales del modelo: {self.model.steps}")
        print(f"• Celdas limpiadas: {self.cells_cleaned}")
        print(f"• Movimientos realizados: {self.moves}")

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

        ### Toma de deciones basada en una máquina de estados
        if self.state == "Returning":
            success = self.go_back()
            if not success: # Si no pudo moverse, intentar explorar para escapar
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
            self.print_final_stats()
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

# Función para imprimir estadísticas cuando termine la simulación
def print_simulation_stats(model, total_dirt_agents):
    """
    Print global stats if the simulation ends
    """
    roombas = [agent for agent in model.agents if isinstance(agent, RoombaAgent)]

    print("\n" + "="*50)
    print("ESTADÍSTICAS FINALES DE LA SIMULACIÓN")
    
    if not roombas:
        print("No hay roombas sobrevivientes")
        print(f"• Steps totales: {model.steps}")
        return
    
    total_cleaned = sum(roomba.cells_cleaned for roomba in roombas)
    total_moves = sum(roomba.moves for roomba in roombas)
    alive_roombas = len(roombas)
    
    print(f"• Steps totales: {model.steps}")
    print(f"• Roombas vivas: {alive_roombas}")
    print(f"• Celdas limpiadas totales: {total_cleaned}/{total_dirt_agents}")
    print(f"• Movimientos totales: {total_moves}")

    print("="*50)
    
    print(f"• Estadísticas por agente:")
    for roomba in roombas:
        efficiency = roomba.cells_cleaned / max(1, roomba.moves)
        print(f"     Agente {roomba.unique_id}: {roomba.cells_cleaned} celda(s) limpiada(s), {roomba.moves} movimientos, {roomba.energy}% de batería restante")
    
    print("="*50)
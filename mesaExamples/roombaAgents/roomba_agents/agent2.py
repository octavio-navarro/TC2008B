from mesa.discrete_space import CellAgent, FixedAgent

class RoombaAgent(CellAgent):
    def __init__(self, model, cell, energy=100):
        super().__init__(model)
        self.condition = "Roombas"
        self.state = "Exploring"  # Initial state
        self.cell = cell
        self.energy = energy
        self.home_station = cell
        self.known_stations = [cell]
        self.communication_cooldown = 0

    def clean(self):
        """Solo limpia"""
        dirt = [obj for obj in self.cell.agents if isinstance(obj, DirtAgent)]
        if dirt:
            dirt_to_eat = self.random.choice(dirt)
            dirt_to_eat.remove()
            print(f"Roomba cleaned dirt")

    def explore(self):
        """Solo explora"""
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )
        cells_with_dirt = self.cell.neighborhood.select(
            lambda cell: any(isinstance(obj, DirtAgent) for obj in cell.agents)
        )

        if cells_with_dirt: 
            self.cell = cells_with_dirt.select_random_cell()
            print(f"Roomba moved to dirt")
        elif cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            print(f"Roomba explored")

    def communicate(self):
        """Solo comunica"""
        other_roombas = [obj for obj in self.cell.agents if isinstance(obj, RoombaAgent) and obj != self]
        
        if other_roombas:
            for roomba in other_roombas:
                for station in self.known_stations:
                    if station not in roomba.known_stations:
                        roomba.known_stations.append(station)
                for station in roomba.known_stations:
                    if station not in self.known_stations:
                        self.known_stations.append(station)
            self.communication_cooldown = 3
            print(f"Roomba communicated, now knows {len(self.known_stations)} stations")

    def go_back(self):
        """Solo se mueve hacia estación"""
        cells_with_station = self.cell.neighborhood.select(
            lambda cell: any(isinstance(obj, ChargingStation) for obj in cell.agents)
        )
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )
        
        if cells_with_station:
            self.cell = cells_with_station.select_random_cell()
            print(f"Roomba moving to station")
        elif cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            print(f"Roomba searching for station")

    def charging(self):
        """Solo carga"""
        charging_station = [obj for obj in self.cell.agents if isinstance(obj, ChargingStation)]
        
        if charging_station: 
            self.energy = min(100, self.energy + 5)
            if self.cell not in self.known_stations:
                self.known_stations.append(self.cell)
            print(f"Roomba charging, energy: {self.energy}%")

    def step(self):
        """
        Máquina de estados simplificada
        """
        print(f"Step - State: {self.state}, Energy: {self.energy}%")
        
        self.energy -= 1  # Each step uses 1% of energy
        
        # Reducir cooldown
        if self.communication_cooldown > 0:
            self.communication_cooldown -= 1

        # Obtener condiciones del entorno
        charging_station_present = any(isinstance(obj, ChargingStation) for obj in self.cell.agents)
        dirt_present = any(isinstance(obj, DirtAgent) for obj in self.cell.agents)
        other_roombas = [obj for obj in self.cell.agents if isinstance(obj, RoombaAgent) and obj != self]

        # PRIMERO: Ejecutar la acción del estado ACTUAL
        if self.state == "Charging":
            self.charging()
        elif self.state == "Returning":
            self.go_back()
        elif self.state == "Cleaning":
            self.clean()
        elif self.state == "Communicating":
            self.communicate()
        elif self.state == "Exploring":
            self.explore()

        # LUEGO: Determinar el próximo estado (lógica más simple)
        next_state = self.state  # Por defecto mantener estado actual

        # Regla 1: Si la energía es baja, ir a cargar
        if self.energy <= 30:
            if charging_station_present:
                next_state = "Charging"
            else:
                next_state = "Returning"
        
        # Regla 2: Si está cargando y tiene suficiente energía, explorar
        elif self.state == "Charging" and self.energy >= 50:
            next_state = "Exploring"
        
        # Regla 3: Si no está en modo emergencia (batería baja) y encuentra suciedad, limpiar
        elif self.energy > 30 and dirt_present and self.state != "Returning" and self.state != "Charging":
            next_state = "Cleaning"
        
        # Regla 4: Si no está en modo emergencia y encuentra otras Roombas, comunicar
        elif (self.energy > 30 and other_roombas and self.communication_cooldown == 0 and 
              self.state not in ["Returning", "Charging", "Cleaning"]):
            next_state = "Communicating"
        
        # Regla 5: Si no hay nada específico que hacer, explorar
        elif self.state in ["Cleaning", "Communicating"] and self.energy > 30:
            # Si ya terminó de limpiar o comunicar, volver a explorar
            next_state = "Exploring"

        print(f"Next state: {next_state}")
        self.state = next_state

        # Manejar muerte
        if self.energy <= 0:
            print("Roomba died!")
            self.remove()


class ObstacleAgent(FixedAgent):
    def __init__(self, model, cell):
        super().__init__(model)
        self.condition = "Obstacle"
        self.cell = cell

    def step(self):
        pass

class ChargingStation(FixedAgent):
    def __init__(self, model, cell):
        super().__init__(model)
        self.condition = "Stations"
        self.cell = cell

    def step(self):
        pass

class DirtAgent(FixedAgent):
    def __init__(self, model, cell):
        super().__init__(model)
        self.condition = "Dirt"
        self.cell = cell

    def step(self):
        pass
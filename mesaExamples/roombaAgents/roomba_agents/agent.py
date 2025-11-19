from mesa.discrete_space import CellAgent, FixedAgent

class RoombaAgent(CellAgent):
    """
    Agent that moves randomly.
    Attributes:
        unique_id: Agent's ID
    """
    def __init__(
        self, model, cell, energy=100,
        ):
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
        print(cell)

    def clean(self):
        """
        If possible, clean dirt at current location.
        """
        dirt = [obj for obj in self.cell.agents if isinstance(obj, DirtAgent)]
        if dirt:  # If there are any dirt present, clean it
            self.state = "Cleaning"
            dirt_to_eat = self.random.choice(dirt)
            dirt_to_eat.remove()

    def explore(self):
        """
        Move around the place avoiding obstacles
        """
        self.state = "Exploring"

        # Find possible cells 
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )

        # Among all possible cells, prefer those with dirt
        cells_with_dirt = self.cell.neighborhood.select(
            lambda cell: any(isinstance(obj, DirtAgent) for obj in cell.agents)
        )

        # Move to cells with dirt
        if cells_with_dirt: 
            self.cell = cells_with_dirt.select_random_cell()
            return True
        
        # Move to cells with obstacles
        if cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
            

    def communicate(self, other_roomba):
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

    def go_back(self):
        """
        Return to the nearer charging station, if needed (low energy)
        """
        is_charging_station = any(isinstance(obj, ChargingStation) for obj in self.cell.agents)
        
        # If already in a station, change the state
        if is_charging_station:
            self.state = "Charging"
            return
            
        # Look for a station and move towards it
        cells_with_station = self.cell.neighborhood.select(
            lambda cell: any(isinstance(obj, ChargingStation) for obj in cell.agents)
        )
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )
        
        if cells_with_station:
            self.cell = cells_with_chargers.select_random_cell()
        elif cells_without_obstacles:
            self.cell = cells_without_obstacles.select_random_cell()
        

        # Calcular con branch and bound cual es la estación más cercana con base en las estaciones de carga conocidas
    
    def charging(self):
        """
        Wait until the energy is equal or higher than 50
        """
        self.state = "Charging"

        # Look for a charging station
        charging_station = [obj for obj in self.cell.agents if isinstance(obj, ChargingStation)]
        
        if charging_station: 
            # Recharge
            self.energy = min(100, self.energy + 5)

            # Add if not already in known stations
            if self.cell not in self.known_stations:
                self.known_stations.append(self.cell)
            
            if self.energy >= 50:
                self.state = "Exploring" # If enough charge
            else:
                self.state = "Charging" # If not enough charge
        else:
            # Find station if not found
            self.state = "Returning"

   
    def step(self):
        """
        Determines the new state of the agent.

        The possible states of an agent are (in order minor to greater)
            5. Exploring
            4. Communicating
            3. Cleaning
            2. Returning
            1. Charging
        """

        self.energy -= 1 # Each step uses 1% of energy

        # Máquina de estados
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

        # Manejar muerte
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

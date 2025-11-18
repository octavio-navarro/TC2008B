from mesa.discrete_space import CellAgent, FixedAgent

class RoombaAgent(CellAgent):
    """
    Agent that moves randomly.
    Attributes:
        unique_id: Agent's ID
    """
    def __init__(self, model, cell):
        """
        Creates a new random agent.
        Args:
            model: Model reference for the agent
            cell: Reference to its position within the grid
        """
        super().__init__(model)
        self.cell = cell
        self.energy = energy

    def feed(self):
        """If possible, eat dirt at current location."""
        dirt = [obj for obj in self.cell.agents if isinstance(obj, DirtAgent)]
        if dirt:  # If there are any dirt present
            dirt_to_eat = self.random.choice(dirt)
            dirt_to_eat.remove()

    def charge(self):
        """If needed, recharge in the charging station."""
        charging_station = [obj for obj in self.cell.agents if isinstance(obj, ChargingStation)]
        if charging_station: 
            charging_station_to_use = self.random.choice(charging_station)
            #self.energy += 5

    def move(self):
        """
        Move to a neighboring cell, preferably one with dirt.
        """
        # Find possible cells 
        cells_without_obstacles = self.cell.neighborhood.select(
            lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        )

        # Find cells with charging stations and move to them if necessary
        ### Calcular el tamaño del camino a la estación de carga con base en sus coordenadas y las coordenadas del agente
        if (self.energy < path_to_charging_station){
            ## Si la enegía es suficiente para regresar, volver a la estación a recargar
            return
        }

        # Among all possible cells, prefer those with dirt
        cells_with_dirt = self.cell.neighborhood.select(
            lambda cell: any(isinstance(obj, DirtAgent) for obj in cell.agents)
        )

         # Move to a cell with dirt if available, otherwise move to any other cell
        target_cells = (
            cells_with_dirt if len(cells_with_dirt) > 0 else cells_without_obstacles
        )
        self.cell = target_cells.select_random_cell()
   


    def step(self):
        """
        Determines the new direction it will take, and then moves
        """
        self.move() # Move to a neighboring cell

        #self.energy -= 1 # Each move reduce it energy

        self.feed() # Try to feed
        

        # Handle death
        #if self.energy < 0:
        #    self.remove()


class ObstacleAgent(FixedAgent):
    """
    Obstacle agent. Just to add obstacles to the grid.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.cell=cell

    def step(self):
        pass

class ChargingStation(FixedAgent):
    """
    Changing station agent. Just to add charging station to the grid.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.cell=cell

    def step(self):
        pass

class DirtAgent(FixedAgent):
    """
    Dirt agent. Appears randomly and can be "eaten" by the Roombas.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.cell=cell

    def step(self):
        pass

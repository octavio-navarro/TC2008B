import mesa
from mesa import Model
from mesa.discrete_space import OrthogonalMooreGrid

from .agent import RoombaAgent, ObstacleAgent, DirtAgent, ChargingStation

class RandomModel(Model):
    """
    Creates a new model with random agents.
    Args:
        num_agents: Number of roombas in the simulation
        height, width: The size of the grid to model
    """
    def __init__(self, num_agents=4, num_dirt = 40, width=8, height=8, seed=42):

        super().__init__(seed=seed)
        self.num_agents = num_agents
        self.seed = seed
        self.width = width
        self.num_dirt = num_dirt
        self.height = height
        self.num_obstacles = 8

        self.grid = OrthogonalMooreGrid([width, height], torus=False)

        # Se usa un diccionario para guardar los estados de la simulación (métricas de desempeño)
        self.datacollector = mesa.DataCollector(
            {
                "Cleanliness": lambda m: self.count_type(m, "Dirt"),
                "Roombas": lambda m: self.count_type(m, "Roombas"),
                "Moves": lambda m: self.moves(m),
                "Battery": lambda m: self.average_battery(m),

            }
        )

        ObstacleAgent.create_agents(
            self, # Referencia al modelo
            self.num_obstacles, # Cantidad random de agentes a crear en ese modelo
            cell=self.random.choices(self.grid.empties.cells, k=self.num_obstacles) # Elige aleatoriamente un agente en una celda vacía
        )

        # Elegir aleatoriamente donde se colocaran las roombas
        roomba_cells = self.random.choices(self.grid.empties.cells, k=self.num_agents)

        ChargingStation.create_agents(
            self, # Referencia al modelo
            self.num_agents, # Cantidad random de agentes a crear en ese modelo
            cell=roomba_cells
        )

        RoombaAgent.create_agents(
            self, # Referencia al modelo
            self.num_agents, # Cantidad random de agentes a crear en ese modelo
            cell=roomba_cells
        )

        DirtAgent.create_agents(
            self, # Referencia al modelo
            self.num_dirt, # Cantidad random de agentes a crear en ese modelo
            cell=self.random.choices(self.grid.empties.cells, k=self.num_dirt) # Elige aleatoriamente un agente en una celda vacía
        )

        self.running = True

    def step(self):
        '''Advance the model by one step.'''
        self.datacollector.collect(self) # Collect data
        self.agents.shuffle_do("step") # Hace de manera aleatoria el step de cada agente (más a doc a una simulación real)
        

    @staticmethod
    def count_type(model, roomba_condition):
        """Helper method to count trees in a given condition in a given model."""
        return len(model.agents.select(lambda x: x.condition == roomba_condition))

    @staticmethod
    def moves(model):
        """Get average moves from all roombas"""
        roombas = model.agents.select(lambda x: isinstance(x, RoombaAgent))
        if roombas:
            return sum(roomba.moves for roomba in roombas) / len(roombas)
        return 0

    @staticmethod
    def average_battery(model):
        """Get average battery level of roombas"""
        roombas = model.agents.select(lambda x: isinstance(x, RoombaAgent))
        if roombas:
            return sum(roomba.energy for roomba in roombas) / len(roombas)
        return 0

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
    def __init__(self, num_agents=14, num_dirt = 40, width=40, height=40, seed=42):
    # def __init__(self, num_agents=4, num_dirt = 40, width=8, height=8, seed=42):

        # Definir parámetros del modelo
        super().__init__(seed=seed)
        self.num_agents = num_agents
        self.seed = seed
        self.width = width
        self.num_dirt = num_dirt
        self.height = height
        self.num_obstacles = 8

        # Inicializar el grid
        self.grid = OrthogonalMooreGrid([width, height], torus=False)

        # Se usa un diccionario para guardar los estados de la simulación (métricas de desempeño)
        self.datacollector = mesa.DataCollector(
            {
                "Cleanliness": lambda m: self.count_type(m, "Dirt"),
                "Roombas": lambda m: self.count_type(m, "Roombas"),
                "Moves": lambda m: self.moves(m),
                "Battery": lambda m: self.average_battery(m),
                "Steps": lambda m: self.steps,

            }
        )
        ## Crear todos los objetos necesarios para la simulación

        # Obstáculos
        ObstacleAgent.create_agents(
            self, # Referencia al modelo
            self.num_obstacles, # Cantidad random de agentes a crear en ese modelo
            cell=self.random.choices(self.grid.empties.cells, k=self.num_obstacles) # Elige aleatoriamente un agente en una celda vacía
        )

        roomba_cells = self.random.choices(self.grid.empties.cells, k=self.num_agents) # Elegir aleatoriamente donde se colocaran las roombas

        # Estaciones de carga
        ChargingStation.create_agents(
            self, # Referencia al modelo
            self.num_agents, # Cantidad random de agentes a crear en ese modelo
            cell=roomba_cells
        )

        # Roombas
        RoombaAgent.create_agents(
            self, # Referencia al modelo
            self.num_agents, # Cantidad random de agentes a crear en ese modelo
            cell=roomba_cells
        )

        # Suciedad
        DirtAgent.create_agents(
            self, # Referencia al modelo
            self.num_dirt, # Cantidad random de agentes a crear en ese modelo
            cell=self.random.choices(self.grid.empties.cells, k=self.num_dirt) # Elige aleatoriamente un agente en una celda vacía
        )

        self.running = True

    def step(self):
        '''Advance the model by one step.'''
        self.datacollector.collect(self) # Recolectar información
        self.agents.shuffle_do("step") # Hace de manera aleatoria el step de cada agente (más a doc a una simulación real)

        # Detener la simulación si se recogió toda la basura o se llegó al límite de tiempo (steps)
        dirt_agents = self.agents.select(lambda x: isinstance(x, DirtAgent))
        # print(len(dirt_agents))
        if ((len(dirt_agents) == 0) or (self.steps >= 1000)):
            self.running = False        

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

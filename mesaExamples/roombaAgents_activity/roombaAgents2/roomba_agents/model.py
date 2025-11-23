import mesa
from mesa import Model
from mesa.discrete_space import OrthogonalMooreGrid

from .agent import RoombaAgent, ObstacleAgent, DirtAgent, ChargingStation, print_simulation_stats

class RandomModel(Model):
    """
    Creates a new model with random agents.
    Args:
        num_agents: Number of roombas in the simulation
        height, width: The size of the grid to model
    """
    def __init__(self, num_agents=14, width=30, height=30, seed=42):

        # Definir ratio de dirt y obstáculos para que sean proporcionales al grid
        DIRT_PERCENT = 0.15
        OBSTACLE_PERCENT = 0.02
        total_cells = width * height

        # Definir parámetros del modelo
        super().__init__(seed=seed)
        self.num_agents = num_agents
        self.seed = seed
        self.width = width
        self.num_dirt_inicial = int(total_cells * DIRT_PERCENT)
        self.num_dirt = int(total_cells * DIRT_PERCENT)
        self.height = height
        self.num_obstacles = int(total_cells * OBSTACLE_PERCENT)

        # Inicializar el grid
        self.grid = OrthogonalMooreGrid([width, height], torus=False)

        # Se usa un diccionario para guardar los estados de la simulación (métricas de desempeño)
        self.datacollector = mesa.DataCollector(
            {
                "Cleanliness": lambda m: self.count_type(m, "Dirt"),
                "Roombas": lambda m: self.count_type(m, "Roombas"),
                "Moves": lambda m: self.average_moves(m),
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

        # Elegir aleatoriamente donde se colocaran las roombas y por ende las estaciones de carga
        roomba_cells = self.random.choices(self.grid.empties.cells, k=self.num_agents) 

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
        
        # Detener la simulación si se cumplen ciertas condiciones
        dirt_agents = self.agents.select(lambda x: isinstance(x, DirtAgent))
        total_dirt_agents = self.num_dirt_inicial
        roombas = [agent for agent in self.agents if isinstance(agent, RoombaAgent)]

        if ((len(dirt_agents) == 0) or (self.steps >= 1000) or not roombas):
            self.running = False
            print_simulation_stats(self, total_dirt_agents)

        self.agents.shuffle_do("step") # Hace de manera aleatoria el step de cada agente (más a doc a una simulación real)

    @staticmethod
    def count_type(model, roomba_condition):
        """Helper method to count the quantity of dirt cells."""
        return len(model.agents.select(lambda x: x.condition == roomba_condition))

    @staticmethod
    def average_moves(model):
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

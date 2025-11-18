from mesa import Model
from mesa.discrete_space import OrthogonalMooreGrid

from .agent import RandomAgent, ObstacleAgent

class RandomModel(Model):
    """
    Creates a new model with random agents.
    Args:
        num_agents: Number of agents in the simulation
        height, width: The size of the grid to model
    """
    def __init__(self, num_agents=10, width=8, height=8, seed=42):

        super().__init__(seed=seed)
        self.num_agents = num_agents
        self.seed = seed
        self.width = width
        self.height = height

        self.grid = OrthogonalMooreGrid([width, height], torus=False)

        # Identify the coordinates of the border of the grid
        # Identificar coordenadas en (x,y) que coinciden con las características del borde
        border = [(x,y)
                  for y in range(height)
                  for x in range(width)
                  if y in [0, height-1] or x in [0, width - 1]]

        # Create the border cells
        for _, cell in enumerate(self.grid):
            if cell.coordinate in border:
                ObstacleAgent(self, cell=cell)

        RandomAgent.create_agents(
            self, # Referencia al modelo
            self.num_agents, # Cantidad random de agentes a crear en ese modelo
            cell=self.random.choices(self.grid.empties.cells, k=self.num_agents) # Elige aleatoriamente un agente en una celda vacía
        )

        self.running = True

    def step(self):
        '''Advance the model by one step.'''
        self.agents.shuffle_do("step") # Hace de manera aleatoria el step de cada agente (más a doc a una simulación real)

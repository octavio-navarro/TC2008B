from random import shuffle
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
        # Multigrid is a special type of grid where each cell can contain multiple agents.
        self.grid = OrthogonalMooreGrid([width, height], torus=False)

        # Identify the coordinates of the border of the grid
        border = [(x,y) for y in range(height)
                    for x in range(width)
                    if y in [0, height-1] or x in [0, width - 1]]

        # Create the border cells
        for i, cell in enumerate(self.grid):
            if cell.coordinate in border:
                ObstacleAgent(self, cell=cell, unique_id=f"{5000+i}")

        # Identify cells that do not have an obstacle in them
        # empty_cells = self.grid.all_cells.select(
        #     lambda cell: not any(isinstance(obj, ObstacleAgent) for obj in cell.agents)
        # )

        # Create a list of the empty cells, and shuffle it
        empty_cells = self.grid.empties.cells
        shuffle(empty_cells)

        # Create all the moving agents
        for i in range(self.num_agents):
            RandomAgent(self, cell=empty_cells[i], unique_id=f"{1000+i}")

        # This did not work
        # RandomAgent.create_agents(
        #     self,
        #     self.num_agents,
        #     # cell=self.random.choices(self.grid.all_cells.cells, k=self.num_agents)
        #     cell=self.random.choices(empty_cells)
        # )

        self.running = True

    def step(self):
        '''Advance the model by one step.'''
        self.agents.shuffle_do("step")

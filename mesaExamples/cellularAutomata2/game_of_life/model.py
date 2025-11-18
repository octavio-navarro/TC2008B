from mesa import Model
from mesa.discrete_space import OrthogonalMooreGrid
from .agent import Cell


class ConwaysGameOfLife(Model):
    """Represents the 2-dimensional array of cells in Conway's Game of Life."""

    def __init__(self, width=50, height=50, initial_fraction_alive=0.2, seed=None):
        """Create a new playing area of (width, height) cells."""
        super().__init__(seed=seed)

        """Grid where cells are connected to their 8 neighbors.

        Example for two dimensions:
        directions = [
            (-1, -1), (-1, 0), (-1, 1),
            ( 0, -1),          ( 0, 1),
            ( 1, -1), ( 1, 0), ( 1, 1),
        ]
        """

        self.grid = OrthogonalMooreGrid((width, height), capacity=1, torus=True)

        # Place a cell at each location, with some initialized to
        # ALIVE and some to DEAD.

        ## Se inician alteatoriamente los estados de todos los agentes a uno de dos estados: Alive o Dead
        for cell in self.grid.all_cells:
            Cell(
                self,
                cell,
                init_state=(
                    Cell.ALIVE
                    if self.random.random() < initial_fraction_alive
                    else Cell.DEAD
                ),
            )

        self.running = True

    def step(self):
        """Perform the model step in two stages:

        - First, all cells assume their next state (whether they will be dead or alive)
        - Then, all cells change state to their next state.
        """
        self.agents.do("determine_state")
        self.agents.do("assume_state")

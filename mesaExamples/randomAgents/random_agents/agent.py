from mesa.discrete_space import CellAgent, FixedAgent

class RandomAgent(CellAgent):
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

    def move(self):
        """
        Determines the next empty cell in its neighborhood, and moves to it
        """
        if self.random.random() < 0.5:
            # Checks which grid cells are empty
            next_moves = self.cell.neighborhood.select(lambda cell: cell.is_empty)
            self.cell = next_moves.select_random_cell()

    def step(self):
        """
        Determines the new direction it will take, and then moves
        """
        self.move()


class ObstacleAgent(FixedAgent):
    """
    Obstacle agent. Just to add obstacles to the grid.
    """
    def __init__(self, model, cell):
        super().__init__(model)
        self.cell=cell

    def step(self):
        pass

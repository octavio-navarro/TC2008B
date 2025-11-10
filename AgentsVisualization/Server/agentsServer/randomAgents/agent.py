from mesa.discrete_space import CellAgent, FixedAgent

class RandomAgent(CellAgent):
    """
    Agent that moves randomly.
    Attributes:
        unique_id: Agent's ID
    """
    def __init__(self, model, cell, unique_id):
        """
        Creates a new random agent.
        Args:
            model: Model reference for the agent
            cell: Reference to its position within the grid
            unique_id: The agent's ID
        """
        super().__init__(model)
        self.cell = cell
        self.unique_id = unique_id
        self.steps_taken = 0

    def move(self):
        """
        Determines if the agent can move in the direction that was chosen
        """
        if self.random.random() < 0.5:
            # Checks which grid cells are empty
            next_moves = self.cell.neighborhood.select(
                lambda cell: cell.is_empty)
            self.cell = next_moves.select_random_cell()
            self.steps_taken+=1

    def step(self):
        """
        Determines the new direction it will take, and then moves
        """
        self.move()


class ObstacleAgent(FixedAgent):
    """
    Obstacle agent. Just to add obstacles to the grid.
    """
    def __init__(self, model, cell, unique_id):
        super().__init__(model)
        self.cell=cell
        self.unique_id = unique_id

    def step(self):
        pass

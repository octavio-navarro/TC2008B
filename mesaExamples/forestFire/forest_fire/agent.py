from mesa.discrete_space import FixedAgent

class TreeCell(FixedAgent):
    """A tree cell.

    Attributes:
        condition: Can be "Fine", "On Fire", or "Burned Out"

    """
    @property
    def neighbors(self):
        return self.cell.neighborhood.agents

    def __init__(self, model, cell):
        """Create a new tree.

        Args:
            model: standard model reference for agent.
        """
        super().__init__(model)
        self.condition = "Fine"
        self.cell = cell
        self.pos = cell.coordinate

    def step(self):
        """If the tree is on fire, spread it to fine trees nearby."""
        if self.condition == "On Fire":
            for neighbor in self.neighbors:
                if neighbor.condition == "Fine":
                    neighbor.condition = "On Fire"
            self.condition = "Burned Out"

from mesa import Model
from mesa.time import SimultaneousActivation
from mesa.space import MultiGrid

from agent import Environment, Ant, Food, Home

class AntWorld(Model):
    """
    Represents the ants foraging for food.
    """

    def __init__(self, height=50, width=50, evaporate=0.5, diffusion=1, initdrop=100, lowerbound=0.01, prob_random=0.1, drop_rate=0.9):
        """
        Create a new playing area of (height, width) cells.
        """
        print("Making World")
        super().__init__()
        self.evaporate = evaporate
        self.diffusion = diffusion
        self.initdrop = initdrop
        self.lowerbound = lowerbound
        self.prob_random = prob_random
        self.drop_rate = drop_rate

        # Set up the grid and schedule.

        # Use SimultaneousActivation which simulates all the cells
        # computing their next state simultaneously.  This needs to
        # be done because each cell's next state depends on the current
        # state of all its neighbors -- before they've changed.
        self.schedule = SimultaneousActivation(self)

        # Use a simple grid, where edges wrap around.
        self.grid = MultiGrid(height, width, torus=True)

        # Define pos for the initial home and food locations
        homeloc = (25, 25)
        food_locs = ((22, 11), (35, 8), (18, 33))

        self.home = Home(self.next_id(), homeloc, self)
        self.grid.place_agent(self.home, homeloc)
        self.schedule.add(self.home)

        # Add in the ants
        # Need to do this first, or it won't affect the cells, consequence of SimultaneousActivation
        for i in range(100):
            ant = Ant(self.next_id(), self.home, self)
            self.grid.place_agent(ant, self.home.pos)
            self.schedule.add(ant)

        # Add the food locations
        for loc in food_locs:
            food = Food(self.next_id(), self)
            food.add(100)
            self.grid.place_agent(food, loc)
            self.schedule.add(food)

        # Place an environment cell at each location
        for contents, (x, y) in self.grid.coord_iter():
            cell = Environment(self.next_id(), (x, y), self)
            self.grid.place_agent(cell, (x, y))
            self.schedule.add(cell)

        self.running = True

    def step(self):
        """
        Have the scheduler advance each cell by one step
        """
        self.schedule.step()

        # stop when all the food is collected
        if self.home.amount == 300:
            self.running = False

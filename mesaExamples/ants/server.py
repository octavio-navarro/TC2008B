from mesa.visualization.modules import CanvasGrid
from mesa.visualization.ModularVisualization import ModularServer
from mesa.visualization import Slider

from model import AntWorld
from agent import Environment, Ant, Food, Home
import math


def log_norm(value, lower, upper):
    """
    Finds the log normalized value between the lower and upper bounds,
    useful for plotting on a log scale. Out-of-bounds values are set to
    the lower or upper bound, whichever is closer. Similar in spirit to
    https://matplotlib.org/3.1.1/api/_as_gen/matplotlib.colors.LogNorm.html

    Args:
        value: The value to be calibrated.
        lower: The lower bound of the range
        upper: The upper bound of the range

    """
    value = min(value, upper)
    value = max(value, lower)
    lower_log = math.log(lower)
    upper_log = math.log(upper)
    value_log = math.log(value)
    return (value_log - lower_log) / (upper_log - lower_log)

def diffusion_portrayal(agent):
    if agent is None:
        return

    portrayal = {}
    if type(agent) is Ant:
        portrayal["Shape"] = "resources/ant.png"
        portrayal["scale"] = 0.9
        portrayal["Layer"] = 1
    elif type(agent) is Food:
        portrayal["Shape"] = "circle"
        portrayal["r"] = math.log(1 + agent.amount)
        portrayal["Filled"] = "true"
        portrayal["Layer"] = 2
        portrayal["Color"] = "#00FF00BB"
        portrayal["text"] = agent.amount
        portrayal["text_color"] = "black"
    elif type(agent) is Home:
        portrayal["Shape"] = "circle"
        portrayal["r"] = 2
        portrayal["Filled"] = "true"
        portrayal["Layer"] = 3
        portrayal["Color"] = "#964B00BB"
        portrayal["text"] = agent.amount
        portrayal["text_color"] = "white"
    elif type(agent) is Environment:
        portrayal["Shape"] = "rect"
        portrayal["Filled"] = "true"
        portrayal["Layer"] = 0
        portrayal["w"] = 1
        portrayal["h"] = 1

        # Calculate the amount of red we want
        red = int(log_norm(agent.amount, agent.model.lowerbound, agent.model.initdrop) * 255)

        # Scale this between red and white
        # cite https://stackoverflow.com/questions/3380726/converting-a-rgb-color-tuple-to-a-six-digit-code-in-python
        portrayal["Color"] = '#FF%02x%02x' % (255 - red, 255 - red)

    return portrayal

# Make a world that is 50x50, on a 500x500 display.
canvas_element = CanvasGrid(diffusion_portrayal, 50, 50, 500, 500)

model_params = {
    "height": 50,
    "width": 50,
    "evaporate": Slider("Evaporation Rate", 0.50, 0.01, 0.50, 0.01),
    "diffusion": Slider("Diffusion Rate", 1.0, 0.0, 1.0, 0.1),
    "initdrop": Slider("Initial Drop", 100, 100, 1000, 50),
    "prob_random": Slider("Random Move Probability", 0.1, 0.0, 1.0, 0.1),
    "drop_rate": Slider("Drop Decay Rate", 0.9, 0, 1, 0.01),
}

server = ModularServer(
    AntWorld, [canvas_element], "Ants", model_params
)

server.launch()

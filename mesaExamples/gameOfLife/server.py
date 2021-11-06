from mesa.visualization.modules import CanvasGrid
from mesa.visualization.ModularVisualization import ModularServer
from mesa.visualization.UserParam import UserSettableParameter

from model import ConwaysGameOfLife

def portrayCell(cell):
    """
    This function is registered with the visualization server to be called
    each tick to indicate how to draw the cell in its current state.
    :param cell:  the cell in the simulation
    :return: the portrayal dictionary.
    """
    assert cell is not None
    return {
        "Shape": "rect",
        "w": 0.8,
        "h": 0.8,
        "Filled": "true",
        "Layer": 0,
        "x": cell.x,
        "y": cell.y,
        "Color": "black" if cell.isAlive() else "white",
    }

# Make a world that is 50x50, on a 250x250 display.
canvas_element = CanvasGrid(portrayCell, 50, 50, 500, 500)

server = ModularServer(ConwaysGameOfLife, [canvas_element], "Game of Life", {"height": 50, "width": 50, "density": UserSettableParameter("slider", "Cell density", 0.1, 0.01, 0.5, 0.01)})

server.launch()
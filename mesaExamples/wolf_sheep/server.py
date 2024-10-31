import mesa

from agents import GrassPatch, Sheep, Wolf
from model import WolfSheep

def wolf_sheep_portrayal(agent):
    if agent is None:
        return

    portrayal = {}

    if type(agent) is Sheep:
        portrayal["Shape"] = "resources/sheep.png"
        portrayal["scale"] = 1.0
        portrayal["Layer"] = 1

    elif type(agent) is Wolf:
        portrayal["Shape"] = "resources/wolf.png"
        portrayal["scale"] = 1.0
        portrayal["Layer"] = 2
        portrayal["text"] = round(agent.energy, 1)
        portrayal["text_color"] = "White"

    elif type(agent) is GrassPatch:
        if agent.fully_grown:
            portrayal["Color"] = ["#00FF00", "#00CC00", "#009900"]

        else:
            portrayal["Color"] = ["#84e184", "#adebad", "#d6f5d6"]
        portrayal["Shape"] = "rect"
        portrayal["Filled"] = "true"
        portrayal["Layer"] = 0
        portrayal["w"] = 1
        portrayal["h"] = 1

    return portrayal

canvas_element = mesa.visualization.CanvasGrid(wolf_sheep_portrayal, 20, 20, 500, 500)
chart_element = mesa.visualization.ChartModule(
    [
        {"Label": "Wolves", "Color": "#AA0000"},
        {"Label": "Sheep", "Color": "#666666"},
        {"Label": "Grass", "Color": "#00AA00"},
    ]
)

model_params = {
    # The following line is an example to showcase StaticText.
    "title": mesa.visualization.StaticText("Parameters:"),
    "grass": True,
    "grass_regrowth_time": mesa.visualization.Slider("Grass regrowth time", 20, 1, 50),
    "initial_sheep": mesa.visualization.Slider("Initial sheep population", 100, 10, 300),
    "sheep_reproduce": mesa.visualization.Slider("Sheep reproduction rate", 0.04, 0.01, 1.0, 0.01),
    "initial_wolves": mesa.visualization.Slider("Initial wolf population", 50, 10, 300),
    "wolf_reproduce": mesa.visualization.Slider(
        "Wolf reproduction rate", 0.05, 0.01, 1.0, 0.01,
        description="Rate at which wolf agents reproduce."
    ),
    "wolf_gain_from_food": mesa.visualization.Slider("Wolf gain from food", 20, 1, 50),
    "sheep_gain_from_food": mesa.visualization.Slider("Sheep gain from food", 4, 1, 10),
}

server = mesa.visualization.ModularServer(
    WolfSheep, [canvas_element, chart_element], "Sheep and Wolf Predation", model_params
)
server.port = 8521

server.launch(open_browser=True)


from roomba_agents.agent import RoombaAgent, ObstacleAgent, DirtAgent, ChargingStation
from roomba_agents.model import RandomModel

from mesa.visualization import (
    Slider,
    SolaraViz,
    make_space_component,
)

from mesa.visualization.components import AgentPortrayalStyle

# Indica cómo se mostrarán los agentes
def random_portrayal(agent):
    if agent is None:
        return

    # Valores default
    portrayal = AgentPortrayalStyle(
        size=50,
        marker="o",
    )

    # Condiciones especiales (para cada agente)
    if isinstance(agent, RoombaAgent):
        portrayal.color = "blue"
    elif isinstance(agent, ChargingStation):
        portrayal.color = "green"
    elif isinstance(agent, ObstacleAgent):
        portrayal.color = "red"
        portrayal.marker = "s"
    elif isinstance(agent, DirtAgent):
        portrayal.color = "gray"
        portrayal.marker = "x"
        size = 20
    return portrayal

def post_process(ax):
    ax.set_aspect("equal")

model_params = {
    "seed": {
        "type": "InputText",
        "value": 42,
        "label": "Random Seed",
    },
    "num_agents": Slider("Number of Roombas", 10, 1, 50),
    "width": Slider("Grid width", 28, 1, 50),
    "height": Slider("Grid height", 28, 1, 50),
}

# Create the model using the initial parameters from the settings
model = RandomModel(
    num_agents=model_params["num_agents"].value,
    width=model_params["width"].value,
    height=model_params["height"].value,
    seed=model_params["seed"]["value"]
)

space_component = make_space_component(
        random_portrayal,
        draw_grid = False,
        post_process=post_process
)

page = SolaraViz(
    model,
    components=[space_component],
    model_params=model_params,
    name="Roomba Model",
)

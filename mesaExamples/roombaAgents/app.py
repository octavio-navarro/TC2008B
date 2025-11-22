from roomba_agents.agent import RoombaAgent, ObstacleAgent, DirtAgent, ChargingStation
from roomba_agents.model import RandomModel

from mesa.visualization import (
    SolaraViz,
    make_plot_component,
    make_space_component,
)

from mesa.visualization.user_param import (
    Slider,
)

from mesa.visualization.components import AgentPortrayalStyle

# Variable para colorear los agentes de acuerdo a su estado
COLORS = {"Cleanliness": "gray", "Roombas": "blue", "Moves": "purple","Battery": "green"}

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
        portrayal.size = 20
    return portrayal

def post_process_space(ax):
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])

def post_process_lines(ax):
    ax.legend(loc="center left", bbox_to_anchor=(1, 0.9))

space_component = make_space_component(
    random_portrayal,
    draw_grid=False,
    post_process=post_process_space,
)

# Se vinculan los mismos colores de los agentes en la visualización del plot
lineplot_component = make_plot_component(
    COLORS,
    post_process=post_process_lines,
)

# Definir el modelo
model = RandomModel()
model_params = {
    "seed": {
        "type": "InputText",
        "value": "42",
        "label": "Random Seed",
    },
    "num_agents": Slider("Number of Roombas", 4, 1, 50),
    "width": Slider("Grid width", 28, 1, 50),
    "height": Slider("Grid height", 28, 1, 50),
}

page = SolaraViz(
    model,
    components=[space_component, lineplot_component],
    model_params=model_params,
    name="Roomba Model",
)

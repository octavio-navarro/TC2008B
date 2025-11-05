from game_of_life.model import ConwaysGameOfLife
from mesa.visualization import (
    SolaraViz,
    make_space_component,
)

from mesa.visualization.components import AgentPortrayalStyle

def agent_portrayal(agent):
    return AgentPortrayalStyle(
        color="white" if agent.state == 0 else "black",
        marker="s",
        size=30,
    )

def post_process(ax):
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])

model_params = {
    "seed": {
        "type": "InputText",
        "value": 42,
        "label": "Random Seed",
    },
    "width": {
        "type": "SliderInt",
        "value": 50,
        "label": "Width",
        "min": 5,
        "max": 60,
        "step": 1,
    },
    "height": {
        "type": "SliderInt",
        "value": 50,
        "label": "Height",
        "min": 5,
        "max": 60,
        "step": 1,
    },
    "initial_fraction_alive": {
        "type": "SliderFloat",
        "value": 0.2,
        "label": "Cells initially alive",
        "min": 0,
        "max": 1,
        "step": 0.01,
    },
}

# Create initial model instance
gof_model = ConwaysGameOfLife()

space_component = make_space_component(
        agent_portrayal,
        draw_grid = False,
        post_process=post_process
)

page = SolaraViz(
    gof_model,
    components=[space_component],
    model_params=model_params,
    name="Game of Life",
)

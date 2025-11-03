from forest_fire.model import ForestFire

from mesa.visualization import (
    SolaraViz,
    make_plot_component,
    make_space_component,
)

from mesa.visualization.user_param import (
    Slider,
)

from mesa.visualization.components import AgentPortrayalStyle

COLORS = {"Fine": "#00AA00", "On Fire": "#880000", "Burned Out": "#000000"}

# Since it is a matplotlib visualization, you can use the markers in https://matplotlib.org/stable/api/markers_api.html
def forest_fire_portrayal(tree):
    if tree is None:
        return

    return AgentPortrayalStyle(
            color= COLORS[tree.condition],
            marker="+",
    )

def post_process_space(ax):
    ax.set_aspect("equal")
    ax.set_xticks([])
    ax.set_yticks([])

def post_process_lines(ax):
    ax.legend(loc="center left", bbox_to_anchor=(1, 0.9))

space_component = make_space_component(
    forest_fire_portrayal,
    draw_grid=False,
    post_process=post_process_space,
)

lineplot_component = make_plot_component(
    COLORS,
    post_process=post_process_lines,
)

model = ForestFire()
model_params = {
    "height": 200,
    "width": 200,
    "density": Slider("Tree density", 0.65, 0.01, 1.0, 0.01),
}

page = SolaraViz(
    model,
    components=[space_component, lineplot_component],
    model_params=model_params,
    name="Forest Fire",
)

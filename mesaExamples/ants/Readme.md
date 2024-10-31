# Ants Model

## Summary

This is an agent-based simulation of ants exploring for food and
communicating through pheromones.

Ants will either be foraging for food or homing in on the home location.
If a foraging ant finds food, they eat it and begin returning home, otherwise they
wander either randomly or following the pheromone gradient.
If an ant returns home, they deposit their food and return to foraging behavior,
otherwise they drop pheromone and take one step closer to home.

![Ant Simulation GIF](antsimulation.gif)

## Model Parameters

There are many parameters that can be adjusted to explore different behaviors.

*  *Evaporation Rate*: the percentage of pheromone that disappears each step.
*  *Diffusion Rate*: the percentage of pheromone that is disbursed to surrounding cells each step.
*  *Initial Drop*: the amount of pheromone the ants use at the start of the homing behavior.
*  *Random Move Probability*: the chance that a foraging ant will make a random move instead
of following the pheromone gradient.
*  *Drop Decay Rate*: the exponential decay of the pheromone being
dropped by the ants, such that they leave less pheromone the further away they
are from the food source.

## Further Reading

The original NetLogo model:

[Wilensky, U. (1997). NetLogo Ants model. http://ccl.northwestern.edu/netlogo/models/Ants. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.](https://ccl.northwestern.edu/netlogo/models/Ants)

[Original source](https://github.com/mgoadric/ants-mesa)

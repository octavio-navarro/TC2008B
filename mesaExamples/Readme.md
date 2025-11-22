# Mesa examples

Sample projects using the mesa python library.

- [Forest Fire](./forestFire/): Implements a simulation of fire that is spreading through a forest. Based on the example found on the mesa github.
- [Random Agents](./randomAgents/): Simulation of agents moving in random directions.
- [Traffic Base](./trafficBase/): Base simulation for the traffic simulation. Contains city maps that are used to create a model for the agents to interact with.

To run the examples, change into the correct directory, and run the command:
```bash
solara run server.py
```

# Mesa Examples

This directory contains reference implementations of Agent-Based Models (ABM) using the **Mesa** Python library. These examples range from basic cellular automata to complex predator-prey ecosystems and traffic simulations.

## 📂 Included Projects

| Project Name | Description | Complexity |
| :--- | :--- | :--- |
| **📂 randomAgents** | A simple model where agents move randomly on a grid. Best for testing the visualization server and understanding the basic `Agent` and `Model` classes. 
| **📂 cellularAutomata** | Demonstrates grid-based state changes without independent moving agents (e.g., Conway's Game of Life). 
| **📂 forestFire** | A simulation of fire spreading through a forest based on density and probability. Demonstrates state propagation across a grid. 
| **📂 wolfSheep** | A classic predator-prey simulation. Wolves eat sheep, sheep eat grass. Demonstrates energy cycles, reproduction, and ecosystem balance. 
| **📂 trafficBase** | The foundation for the course capstone. Simulates cars (agents) navigating a city grid with obstacles and traffic rules. 

---

## 🛠️ Prerequisites

Before running these examples, ensure you have performed the setup steps in the root repository:

1.  You have Python 3.13+ installed.
2.  You have created the **`.agents`** virtual environment.
3.  You have installed the requirements (`mesa`, `flask`, etc.).

---

## 🚀 How to Run an Example

To run any of the examples, you must first activate your virtual environment and then navigate to the specific project folder.

### 1. Activate the Environment

* **Windows (PowerShell):** `..\.agents\Scripts\Activate`
* **Mac/Linux:** `source ../.agents/bin/activate`

### 2. Navigate and Run

Choose the example you want to run.

#### Example: Running the Random Agents

```bash
# Navigate into the specific example folder
cd randomAgents 
```

# Run the server
```bash
solara run server.py
```

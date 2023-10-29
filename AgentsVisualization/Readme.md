# Agent Visualization using Unity

This project is a simple demonstration of how to visualize the agents from mesa inside Unity. The project was tested on Unity 2022.3.12f1. The server was running using the environment provided in the repository.

## Instructions to run the local server and the Unity application

-  Run the flask server:

```
Server/tc2008B_flask.py
```

- Once the server is running, launch the Unity scene ```RandomAgents``` that is in the folder: ```AgentsVisualization```.
- The scene has a game objects: ```AgentController``` that is responsible of getting the data from the mesa simulation. This is done through the ```AgentController.cs``` script.
- The ````AgentController.cs```` parses JSON data that comes from the servers. The script does so by using two classes: ```AgentData``` and ```AgentsData```. The first class contains the data for each individual agent, while the latter contains a list with the data for all the agents.
- The script uses [UnityWebRequests](https://docs.unity3d.com/ScriptReference/Networking.UnityWebRequest.html) to interact with the server; from the initialization of the model, to updating and fetching the agent's positions.
- The script is listening to port 8585 (http://localhost:8585). **Double check that your server is launching on that port.**
- If everything is running, Unity should render a simple scene with cubes that are moving:

![RandomAgentSimulation](/docs/Images/Random_agent_simulation.png)

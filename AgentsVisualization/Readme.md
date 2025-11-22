# Agent Visualization using WebGL 

This project is a simple demonstration of how to visualize the agents from mesa using WebGL. The server was ran using the environment provided in the repository.

The application consists of two servers, one for the mesa model, and one for the visualization. The mesa model uses flask to serve different endpoints that are used to obtain information from the mesa simulation. The visualization with WebGL uses a Vite server to host the client application.

It is primarily used to visualize the **Random Agents** model, but the logic can be extended to visualize the **Traffic/City** simulation.

---

## Prerequisites

To run this visualization, you need two things running simultaneously:

1.  **The Python Backend:** A Mesa model wrapped in a Flask API.
2.  **The Web Frontend:** This folder served via a local web server.

---

## Instructions to run the local server and the application

### Step 1: Start the Python Backend

You need a simulation running that provides data:

1.  Open a terminal at the root of the repository.
2.  Activate your environment:
    * Windows: `.\.agents\Scripts\Activate`
    * Mac/Linux: `source .agents/bin/activate`
3.  Navigate to the `Server` folder.
4.  Run the flask server:

```bash
python agentsServer/agents_server.py
```

- The script is listening to port 8585 (http://localhost:8585). **Double check that your server is launching on that port.**

### Step 2: Running the WebGL application

1. Make sure that you installed the dependencies with `npm i`.
2. Run the vite server:

```
npx vite
```

- If everything is running, you should acces the webpage: http://localhost:5173/visualization/index.html
- It should render a simple scene with cubes that are moving:

![RandomAgentSimulation](/docs/Images/Agent_visualization.png)

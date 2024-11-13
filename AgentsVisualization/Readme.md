# Agent Visualization using WebGL 

This project is a simple demonstration of how to visualize the agents from mesa using WebGL. The server was ran using the environment provided in the repository.

The application consists of two servers, one for the mesa model, and one for the visualization. The mesa model uses flask to serve different endpoints that are used to obtain information from the mesa simulation. The visualization with WebGL uses a Vite server to host the client application.

## Dependencies

### Mesa flask server

You must have the following dependencies in your python installation, or in a virtual environment (usually with venv).

- Python
- Mesa version 2.4.0: pip install mesa==2.4.0
- Flask: pip install flask
- Flask Cors: pip install flask_cors

### Visualization server

The following are installed when you use `npm i` inside of the **visualization** folder.

- Lil-gui: lil-gui ^0.19.2
- Twgl: twgl.js ^5.5.4
- Vite: vite ^5.3.4

## Instructions to run the local server and the application

- Make sure that you have the dependencies installed.
- Move to the `Server` folder.
- Run the flask server:

```
python agentsServer/agents_server.py
```

- The script is listening to port 8585 (http://localhost:8585). **Double check that your server is launching on that port.**

## Running the WebGL application

- Move to the `visualization` folder.
- Make sure that you installed the dependencies with `npm i`.
- Run the vite server:

```
npx vite
```

- If everything is running, you should acces the webpage: http://localhost:5173
- It should render a simple scene with cubes that are moving:

![RandomAgentSimulation](/docs/Images/Agent_visualization.png)

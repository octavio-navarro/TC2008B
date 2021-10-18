# TC2008B. Sistemas Multiagentes y Gráficas Computacionales
# Python flask server to interact with Unity. Based on the code provided by Sergio Ruiz.
# Octavio Navarro. October 2021

from flask import Flask, request, jsonify
from boid import Boid
import logging, json, os, numpy as np

def updatePositions(flock):
    positions = []
    for boid in flock:
        boid.apply_behaviour(flock)
        boid.update()
        pos = boid.edges()
        positions.append(pos)
    return positions

def positionsToJSON(ps):
    posDICT = []
    for p in ps:
        pos = {
            "x" : p[0],
            "z" : p[1],
            "y" : p[2]
        }
        posDICT.append(pos)
    return jsonify({'positions':posDICT})

# Size of the board:
width = 30
height = 30

# Set the number of agents here:
flock = [Boid(*np.random.rand(2)*30, width, height) for _ in range(20)]

# On IBM Cloud Cloud Foundry, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))

app = Flask("Boids example", static_url_path='')

@app.route('/', methods=['POST', 'GET'])
def boidsPosition():
    if request.method == 'GET':
        positions = updatePositions(flock)
        # resp = "{\"data\":" + positionsToJSON(positions) + "}"
        return positionsToJSON(positions)
    elif request.method == 'POST':
        return "Post request from Boids example\n"

if __name__=='__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
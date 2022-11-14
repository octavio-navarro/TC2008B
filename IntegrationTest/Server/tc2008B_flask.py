# TC2008B. Sistemas Multiagentes y Gráficas Computacionales
# Python flask server to interact with Unity. Based on the code provided by Sergio Ruiz.
# Octavio Navarro. November 2022

from flask import Flask, request, jsonify
from boids.boid import Boid
import numpy as np

def updatePositions(flock):
    positions = []
    for boid in flock:
        boid.apply_behaviour(flock)
        boid.update()
        boid.edges()
        positions.append((boid.id, boid.position))
    return positions

def positionsToJSON(positions):
    posDICT = []
    for id, p in positions:
        pos = {
            "boidId" : str(id),
            "x" : float(p.x),
            "y" : float(p.z),
            "z" : float(p.y)
        }
        posDICT.append(pos)
    return jsonify({'positions':posDICT})

# Size of the board:
width = 30
height = 30

# Set the number of agents here:
flock = []

app = Flask("Boids example")

@app.route('/', methods=['POST', 'GET'])
def boidsPosition():
    if request.method == 'GET':
        positions = updatePositions(flock)
        return positionsToJSON(positions)
    elif request.method == 'POST':
        return "Post request from Boids example\n"

@app.route('/init', methods=['POST', 'GET'])
def boidsInit():
    global flock
    if request.method == 'GET':
        # Set the number of agents here:
        flock = [Boid(*np.random.rand(2)*30, width, height, id) for id in range(20)]
        return jsonify({"num_agents":30, "w": 30, "h": 30})
    elif request.method == 'POST':
        return "Post request from init\n"

if __name__=='__main__':
    app.run(host="localhost", port=8585, debug=True)
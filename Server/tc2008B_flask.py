# TC2008B. Sistemas Multiagentes y Gráficas Computacionales
# Python flask server to interact with Unity. Based on the code provided by Sergio Ruiz.
# Octavio Navarro. October 2021

from flask import Flask, request, jsonify
from boid import Boid
import logging, json, numpy as np

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

app = Flask("Boids example")

@app.route('/', methods=['POST', 'GET'])
def boidsPosition():
    if request.method == 'GET':
        positions = updatePositions(flock)
        return positionsToJSON(positions)
    elif request.method == 'POST':
        return "Post request from Boids example\n"

@app.route('/init', methods=['POST', 'GET'])
def boidsTest():
    if request.method == 'GET':
        return jsonify({"num_agents":30, "w": 30, "h": 30})
    elif request.method == 'POST':
        return "Post request from init\n"

if __name__=='__main__':
    app.run(host="localhost", port=8585, debug=True)
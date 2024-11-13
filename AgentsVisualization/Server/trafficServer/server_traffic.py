# TC2008B. Sistemas Multiagentes y Gráficas Computacionales
# Python flask server to interact with Unity. Based on the code provided by Sergio Ruiz.
# Octavio Navarro. October 2023 

from flask import Flask, request, jsonify
#from randomAgents.model import RandomModel
#from randomAgents.agent import RandomAgent, ObstacleAgent
from trafficBase.model import CityModel
from trafficBase.agent import Road, Traffic_Light, Obstacle, Destination

# Size of the board:
number_agents = 10
width = 28
height = 28
randomModel = None
currentStep = 0

# This application will be used to interact with Unity
app = Flask("Traffic example")

# This route will be used to send the parameters of the simulation to the server.
# The servers expects a POST request with the parameters in a form.
@app.route('/init', methods=['POST'])
def initModel():
    global currentStep, randomModel, number_agents, width, height

    if request.method == 'POST':
        number_agents = int(request.form.get('NAgents'))
        currentStep = 0

        print(request.form)

        # Create the model using the parameters sent by Unity
        randomModel = CityModel(number_agents)

        # Return a message to Unity saying that the model was created successfully
        return jsonify({"message":"Parameters recieved, model initiated."})

# This route will be used to get the positions of the agents
#@app.route('/getAgents', methods=['GET'])
#def getAgents():
    #global randomModel

    #if request.method == 'GET':
        ## Get the positions of the agents and return them to Unity in JSON format.
        ## Note that the positions are sent as a list of dictionaries, where each dictionary has the id and position of an agent.
        ## The y coordinate is set to 1, since the agents are in a 3D world. The z coordinate corresponds to the row (y coordinate) of the grid in mesa.
        #agentPositions = [{"id": str(a.unique_id), "x": x, "y":1, "z":z} for a, (x, z) in randomModel.grid.coord_iter() if isinstance(a, RandomAgent)]

        #return jsonify({'positions':agentPositions})

## This route will be used to get the positions of the obstacles
#@app.route('/getObstacles', methods=['GET'])
#def getObstacles():
    #global randomModel

    #if request.method == 'GET':
        ## Get the positions of the obstacles and return them to Unity in JSON format.
        ## Same as before, the positions are sent as a list of dictionaries, where each dictionary has the id and position of an obstacle.
        #carPositions = [{"id": str(a.unique_id), "x": x, "y":1, "z":z} for a, (x, z) in randomModel.grid.coord_iter() if isinstance(a, ObstacleAgent)]

        #return jsonify({'positions':carPositions})

## This route will be used to update the model
#@app.route('/update', methods=['GET'])
#def updateModel():
    #global currentStep, randomModel
    #if request.method == 'GET':
        ## Update the model and return a message to Unity saying that the model was updated successfully
        #randomModel.step()
        #currentStep += 1
        #return jsonify({'message':f'Model updated to step {currentStep}.', 'currentStep':currentStep})

if __name__=='__main__':
    # Run the flask server in port 8585
    app.run(host="localhost", port=8585, debug=True)
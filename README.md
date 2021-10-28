# TC2008B

Course material for the Multi-agents and computer graphics course.

# Setup instructions

- Strongly recommend using a custom conda environment.
- Install python 3.8 in the environment: ```conda install python=3.8``` Using 3.8 for compatibility reasons. Maybe 3.9 or 3.10 are compatible with all the packages, but will have to check.
- Installing mesa: ```pip install mesa```
- Installing flask to mount the service: ```pip install flask```
- By this moment, the environment will have all the packages needed for the project to run.

# Instructions to run the local server and the Unity application

-  Run either the python web server: ```Server/tc2008B_server.py```, or the flask server: ```Server/tc2008B_flask.py```. Flask is considerably easier to setup and use, and I strongly recommend its use over python's http.server module. Additionally, IBM cloud example used flask. 
- To run the python web server: 

```
python tc2008B_server.py
```
- To run a flask app:

```
export FLASK_APP=tc_2008B_flash.py
flask run
```
- You can change the name of the app you want to run by changing the environment variable ```FLASK_APP```.

- Alternatively, if you used the following code in your flask server:

```
if __name__=='__main__':
    app.run(host="localhost", port=8585, debug=True)
```
you can run it using: 

```
python tc2008B_flask.py
```

- To run a flask app on a different host or port:

```
flask run --host=0.0.0.0 --port=8585
```

- Either of these servers is what will run on the cloud.
- Once the server is running, launch the Unity scene ```TC2008B``` that is in the folder: ```IntegrationTest```.
- The scene has two game objects: ````AgentController```` and ````AgentControllerUpdate````. I left both so that different functionality can be tested: ````AgentController```` works with the response of the python web server, while ````AgentControllerUpdate```` works with the reponse from the flask server.
- I updated the ```AgentController.cs``` code, and introduced ```AgentControllerUpdate.cs```. Each script parses data differently, depending on the response from either the python web server, or from the flask server. The ````AgentController.cs```` script parses text data, while ````AgentControllerUpdate.cs```` parses JSON data. I strongly recommend that we use JSON data.
- The scripts are listening to port 8585 (http://localhost:8585). **Double check that your server is launching on that port; specially if you are using a flask server.**
- If the Unity application is not running, or has import issues, I included the Unity package that has the scene Sergio Ruiz provided.

# Instruction to run the cloud server and Unity application

## Installing dependencies, and locally running the sample 

- Following instructions from the [IBM-Cloud repo](https://github.com/IBM-Cloud/get-started-python)
- Download and install [Cloud Foundry CLI](https://github.com/cloudfoundry/cli#downloads). I am installing it on my WSL machine:

````
# ...first add the Cloud Foundry Foundation public key and package repository to your system
wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | sudo apt-key add -
echo "deb https://packages.cloudfoundry.org/debian stable main" | sudo tee /etc/apt/sources.list.d/cloudfoundry-cli.list
# ...then, update your local package index, then finally install the cf CLI
sudo apt update
sudo apt install cf8-cli
````

- To get the sample app running:

````
git clone https://github.com/IBM-Cloud/get-started-python
cd get-started-python
````

- To run locally:

````
pip install -r requirements.txt
python hello.py
````

## To deply the sample to the cloud

- All the requiered files for the sample app to run are inside the ````IBMCloud```` folder.
- We first need a ````manifest.yml```` file. The one provided in the example repository contains the following:

````
applications:
 - name: GetStartedPython
   random-route: true
   memory: 128M
````

- You can use the Cloud Foundry CLI to deploy apps. Choose your API endpoint:

````
cf api <API-endpoint>
````

Replace the *API-endpoint* in the command with an API endpoint from the following list:

|URL                             |Region          |
|:-------------------------------|:---------------|
| https://api.ng.bluemix.net     | US South       |
| https://api.eu-de.bluemix.net  | Germany        |
| https://api.eu-gb.bluemix.net  | United Kingdom |
| https://api.au-syd.bluemix.net | Sydney         |

- Login to your IBM Cloud account:

````
cf login
````

- From within the get-started-python directory push your app to IBM Cloud:

````
cf push
````

- This process can take a while. All the dependencies are downloaded and installed, and the app in started.
- After you push the application, in the cloud dashboard you can see a new cloud foundry app.
- This can take a minute. If there is an error in the deployment process you can use the command ````cf logs <Your-App-Name> --recent```` to troubleshoot.
- When deployment completes you should see a message indicating that your app is running. View your app at the URL listed in the output of the push command. You can also issue the ````cf apps````.
- With the ````cf apps```` command you can see the route for the app.

## To deploy a custom app to the cloud

- I created an app within the cloud foundry in the ibm cloud by following the document ````Manual IBM Cloud - Python.pdf````.
- Created an additional folder inside the ````IBMCloud```` folder, named ````boids````, that contains the required files.
- In the ````manifest.yml```` I renamed the name to the one I used for the app in cloud foundry. From ````GetStartedPython```` to ````Boids````.
- Then, modified the ````ProcFile```` file as follows:

````
web: python tc2008B_flask.py
````

- Modified the ````setup.py```` file, but I do not think it matters.
- Then changed to the ````boids```` folder, and used:

````
cf push
````

- Then, update the url for the service in Unity with the url for the service that cloud foundry assigns.

# Notes

- Using VSCode to develop everything. 
- Although not stated in the requirements, Git needs to be installed on the system.
- I am running windows, and using the [WSL](https://docs.microsoft.com/en-us/windows/wsl/). I ran the server code in WSL, and the Unity client in windows. My WSL machine runs Ubuntu 20.
- Using *Thunder Client* extension as a replacement for postman to test the apis.
- Pip does not allow us to search anymore.
- As of 2021-10-17, the WWWForm method to post from Unity to the web service still works with Unity 20.20.3.4. However, the support apparently is [going away soon](https://docs.unity3d.com/Manual/UnityWebRequest-SendingForm.html).
- Using flask because it is ideal for building smaller applications. Django could be used, but since it is much more robust, the additional utilities were not needed for this project.
- The demo app push process went rather smoothly, but for the boids app it did not. It took too long, and ended up failing with a timeout error. I issued the command again.
- Timeout again. Modified the manifest, and tried again.
- After that, the app failed when it tried to start. Apparently, numpy was missing from the requirements.

# TO DO

- [ x ] Add the mesa code instead of the Boids code.
- [ x ] Check synchronization, clients, maybe in the cloud, most likely in flask
- [ ] Check cloud documentation or ask for a course? Instances, connections, etc.

# Dependencies

- Python 3.8
- Mesa
    - [Documentation](https://mesa.readthedocs.io/en/stable/index.html)
- Flask
    - [User Gudie](https://flask.palletsprojects.com/en/2.0.x/)
- Unity 20.20.3.4
- [Cloud Foundry CLI](https://github.com/cloudfoundry/cli#downloads)

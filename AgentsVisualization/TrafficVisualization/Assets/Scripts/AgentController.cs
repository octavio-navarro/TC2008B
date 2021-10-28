// TC2008B. Sistemas Multiagentes y Gráficas Computacionales
// C# client to interact with Python. Based on the code provided by Sergio Ruiz.
// Octavio Navarro. October 2021

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;

public class CarData
{
    public int uniqueID;
    public Vector3 position;
}

public class agentData
{
    public List<Vector3> positions;
}

public class AgentController : MonoBehaviour
{
    // private string url = "https://boids.us-south.cf.appdomain.cloud/";
    private string getAgentsUrl = "http://localhost:8585/getAgents", getObstaclesUrl = "http://localhost:8585/getObstacles", sendConfigUrl = "http://localhost:8585/init", updateUrl = "http://localhost:8585/update";
    private agentData carsData, obstacleData;
    public GameObject carPrefab, obstaclePrefab, floor;
    public int NAgents, width, height;
    GameObject[] agents;
    public float timeToUpdate = 5.0f, timer, dt;
    List<Vector3> newPositions;

    void Start()
    {
        carsData = new agentData();
        obstacleData = new agentData();
        newPositions = new List<Vector3>();

        agents = new GameObject[NAgents];

        floor.transform.localScale = new Vector3((float)width/10, 1, (float)height/10);
        floor.transform.localPosition = new Vector3((float)width/2-0.5f, 0, (float)height/2-0.5f);
        
        timer = timeToUpdate;

        for(int i = 0; i < NAgents; i++)
            agents[i] = Instantiate(carPrefab, Vector3.zero, Quaternion.identity);
            
        StartCoroutine(sendConfiguration());
    }

    private void Update() 
    {
        float t = timer/timeToUpdate;
        dt = t * t * ( 3f - 2f*t);

        if(timer >= timeToUpdate)
        {
            timer = 0;
            StartCoroutine(updateSimulation());
        }

        if (newPositions.Count > 1)
        {
            for (int s = 0; s < agents.Length; s++)
            {
                Vector3 interpolated = Vector3.Lerp(agents[s].transform.position, newPositions[s], dt);
                agents[s].transform.localPosition = interpolated;
                
                Vector3 dir = agents[s].transform.position - newPositions[s];
                agents[s].transform.rotation = Quaternion.LookRotation(dir);
                
                timer += Time.deltaTime;
            }
        }
    }
 
    IEnumerator updateSimulation()
    {
        UnityWebRequest www = UnityWebRequest.Get(updateUrl);
        yield return www.SendWebRequest();
 
        if (www.result != UnityWebRequest.Result.Success)
            Debug.Log(www.error);
        else 
        {
            StartCoroutine(GetCarsData());
        }
    }
    IEnumerator sendConfiguration()
    {
        WWWForm form = new WWWForm();

        form.AddField("NAgents", NAgents.ToString());
        form.AddField("width", width.ToString());
        form.AddField("height", height.ToString());

        UnityWebRequest www = UnityWebRequest.Post(sendConfigUrl, form);
        www.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        yield return www.SendWebRequest();

        if (www.result != UnityWebRequest.Result.Success)
        {
            Debug.Log(www.error);
        }
        else
        {
            Debug.Log("Configuration upload complete!");
            Debug.Log("Getting Agents positions");
            StartCoroutine(GetCarsData());
            StartCoroutine(GetObstacleData());
        }
    }
    IEnumerator GetCarsData() 
    {
        UnityWebRequest www = UnityWebRequest.Get(getAgentsUrl);
        yield return www.SendWebRequest();
 
        if (www.result != UnityWebRequest.Result.Success)
            Debug.Log(www.error);
        else 
        {
            carsData = JsonUtility.FromJson<agentData>(www.downloadHandler.text);

            newPositions.Clear();

            foreach(Vector3 v in carsData.positions)
                newPositions.Add(v);
        }
    }

    IEnumerator GetObstacleData() 
    {
        UnityWebRequest www = UnityWebRequest.Get(getObstaclesUrl);
        yield return www.SendWebRequest();
 
        if (www.result != UnityWebRequest.Result.Success)
            Debug.Log(www.error);
        else 
        {
            obstacleData = JsonUtility.FromJson<agentData>(www.downloadHandler.text);

            Debug.Log(obstacleData.positions);

            foreach(Vector3 position in obstacleData.positions)
            {
                Instantiate(obstaclePrefab, position, Quaternion.identity);
            }
        }
    }
}

// TC2008B. Sistemas Multiagentes y Gráficas Computacionales
// C# client to interact with Python. Based on the code provided by Sergio Ruiz.
// Octavio Navarro. November 2022

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;

[Serializable]
public class BoidData
{
    public string boidId;
    public float x, y, z;

    public BoidData(string boidId, float x, float y, float z)
    {
        this.boidId = boidId;
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

[Serializable]
public class BoidsData
{
    public List<BoidData> positions;

    public BoidsData() => this.positions = new List<BoidData>();
}

public class AgentControllerUpdate : MonoBehaviour
{
    private string uri = "http://localhost:8585";

    BoidsData boidsData;
    Dictionary<string, Vector3> boidsPrevPositions, boidsCurrPositions;
    public GameObject agentPrefab;
    Dictionary<string, GameObject> agents;
    public float timeToUpdate = 5.0f;
    private float timer, dt;
    private bool started = false, updated = false;

    void Start()
    {
        boidsData = new BoidsData();

        agents = new Dictionary<string, GameObject>();

        boidsPrevPositions = new Dictionary<string, Vector3>();
        boidsCurrPositions = new Dictionary<string, Vector3>();

        timer = timeToUpdate;

        StartCoroutine(StartSimulation());        
    }
 
    IEnumerator StartSimulation()
    {
        using(UnityWebRequest webRequest = UnityWebRequest.Get($"{uri}/init"))
        {
            Debug.Log("Starting...");
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(webRequest.error);
            }
            else
            {
                Debug.Log($" Starting simulation with: {webRequest.downloadHandler.text}");
                
                StartCoroutine(GetBoidsData());
            }
        }    
    }

    IEnumerator GetBoidsData() 
    {
        using(UnityWebRequest webRequest = UnityWebRequest.Get(uri))
        {
            yield return webRequest.SendWebRequest();

            if (webRequest.result != UnityWebRequest.Result.Success)
                Debug.Log(webRequest.error);
            else 
            {
                Debug.Log(webRequest.downloadHandler.text);
                boidsData = JsonUtility.FromJson<BoidsData>(webRequest.downloadHandler.text);

                foreach(BoidData boid in boidsData.positions)
                {
                    Vector3 newBoidPosition = new Vector3(boid.x, boid.y, boid.z);

                    if(!started)
                    {
                        boidsPrevPositions[boid.boidId] = newBoidPosition;
                        agents[boid.boidId] = Instantiate(agentPrefab, newBoidPosition, Quaternion.identity);
                    }
                    else
                    {
                        Vector3 currentPosition = new Vector3();
                        if(boidsCurrPositions.TryGetValue(boid.boidId, out currentPosition))
                            boidsPrevPositions[boid.boidId] = currentPosition;
                        boidsCurrPositions[boid.boidId] = newBoidPosition;
                    }
                }

                updated = true;
                if(!started) started = true;
            }
        }        
    }

    void Update()
    {
        if(updated)
        {
            timer -= Time.deltaTime;
            dt = 1.0f - (timer / timeToUpdate);
        }

        if(timer < 0)
        {
            timer = timeToUpdate; 
            updated = false;
            StartCoroutine(GetBoidsData());  
        }

        foreach(var boid in boidsCurrPositions)
        {
            Vector3 currentPosition = boid.Value;
            Vector3 previousPosition = boidsPrevPositions[boid.Key];

            Vector3 interpolated = Vector3.Lerp(previousPosition, currentPosition, dt);
            Vector3 direction = currentPosition - previousPosition;

            agents[boid.Key].transform.localPosition = interpolated;
            agents[boid.Key].transform.rotation = Quaternion.LookRotation(direction);
        }
    }
}

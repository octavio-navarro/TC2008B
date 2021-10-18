// TC2008B. Sistemas Multiagentes y Gráficas Computacionales
// C# client to interact with Python. Based on the code provided by Sergio Ruiz.
// Octavio Navarro. October 2021

using System;
using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;

public class BoidsData
{
    public List<Vector3> positions;
}

public class AgentControllerUpdate : MonoBehaviour
{
    // private string url = "https://boids.us-south.cf.appdomain.cloud/";
    private string url = "http://localhost:8585";

    BoidsData boidsData;
    List<List<Vector3>> positions;
    public GameObject agent1Prefab, agent2Prefab;
    public int clonesOfAgent1, clonesOfAgent2;
    GameObject[] agents;
    public float timeToUpdate = 5.0f;
    private float timer, dt;

    void Start()
    {
        boidsData = new BoidsData();
        int numOfAgents = clonesOfAgent1 + clonesOfAgent2;
        agents = new GameObject[numOfAgents];

        for(int i = 0; i < numOfAgents; i++)
        {
            if(i < clonesOfAgent1)
                agents[i] = Instantiate(agent1Prefab, Vector3.zero, Quaternion.identity);
            else
                agents[i] = Instantiate(agent2Prefab, Vector3.zero, Quaternion.identity);
        }

        positions = new List<List<Vector3>>();

        #if UNITY_EDITOR
            StartCoroutine(GetBoidsData());
            timer = timeToUpdate;
        #endif
    }
 
    IEnumerator GetBoidsData() 
    {
        UnityWebRequest www = UnityWebRequest.Get(url);
        yield return www.SendWebRequest();
 
        if (www.result != UnityWebRequest.Result.Success)
            Debug.Log(www.error);
        else 
        {
            boidsData = JsonUtility.FromJson<BoidsData>(www.downloadHandler.text);
            positions.Add(boidsData.positions);
        }
    }

    void Update()
    {
        /*
         *    5 -------- 100
         *    timer ----  ?
         */
        timer -= Time.deltaTime;
        dt = 1.0f - (timer / timeToUpdate);

        if(timer < 0)
        {
            #if UNITY_EDITOR
                timer = timeToUpdate; // reset the timer
                StartCoroutine(GetBoidsData());
            #endif
        }

           if (positions.Count > 1)
        {
            for (int s = 0; s < agents.Length; s++)
            {
                // Get the last position for s
                List<Vector3> last = positions[positions.Count - 1];
                // Get the previous to last position for s
                List<Vector3> prevLast = positions[positions.Count - 2];
                // Interpolate using dt
                Vector3 interpolated = Vector3.Lerp(prevLast[s], last[s], dt);
                agents[s].transform.localPosition = interpolated;

                Vector3 dir = last[s] - prevLast[s];
                agents[s].transform.rotation = Quaternion.LookRotation(dir);
            }
        }
    }
}

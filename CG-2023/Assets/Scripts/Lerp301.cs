/*
Use linear interpolation to determine the position between two points

Gilberto Echeverria
2023-11-15
*/

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lerp301 : MonoBehaviour
{
    [SerializeField] Vector3 startPos;
    [SerializeField] Vector3 finalPos;
    [Range(0.0f, 1.0f)]
    [SerializeField] float t;

    [SerializeField] float moveTime;

    float elapsedTime = 0.0f;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        t = elapsedTime / moveTime;
        t = t * t * (3.0f - 2.0f * t);

        Vector3 position = startPos + (finalPos - startPos) * t; 


        // Using the Unity transforms
        transform.position = position;
        Matrix4x4 move = HW_Transforms.TranslationMat(position.x,
                                                      position.y,
                                                      position.z);

        elapsedTime += Time.deltaTime;

        if (elapsedTime >= moveTime) {
            Vector3 temp = startPos;
            startPos = finalPos;
            finalPos = temp;

            elapsedTime = 0.0f;
        }
    }
}

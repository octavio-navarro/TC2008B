/*
Implement Linear Interpolation between positions (Vector3)

Gilberto Echeverria
2023-11-15
*/

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Lerp302 : MonoBehaviour
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
        // Use a function to smooth the movement
        t = t * t * (3.0f - 2.0f * t);

        // Interpolation function
        Vector3 position = startPos + (finalPos - startPos) * t;

        // Move the object using the Unity transforms
        transform.position = position;

        // To move using matrix tansformations, put the vector 3 into a 
        //  translation matrix, and apply to the vertices
        Matrix4x4 move = HW_Transforms.TranslationMat(position.x, position.y, position.z);

        // Update time
        elapsedTime += Time.deltaTime;

        // When the time has passed, change to another destination
        if (elapsedTime > moveTime) {
            //elapsedTime = moveTime;
            elapsedTime = 0.0f;

            Vector3 temp = finalPos;
            finalPos = startPos;
            startPos = temp;
        }
    }
}

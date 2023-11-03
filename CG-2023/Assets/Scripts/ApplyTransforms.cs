/*
Use transformation matrices to modify the vertices of a mesh

Gilberto Echeverria
2023-11-02
*/

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ApplyTransforms : MonoBehaviour
{
    [SerializeField] Vector3 displacement;
    [SerializeField] float angle;
    [SerializeField] AXIS rotationAxis;

    Mesh mesh;
    Vector3[] baseVertices;
    Vector3[] newVertices;

    // Start is called before the first frame update
    void Start()
    {
        // Get the mesh from the child object
        mesh = GetComponentInChildren<MeshFilter>().mesh;
        baseVertices = mesh.vertices;

        // Create a copy of the original vertices
        newVertices = new Vector3[baseVertices.Length];
        for (int i = 0; i < baseVertices.Length; i++) {
            newVertices[i] = baseVertices[i];
        }
    }

    // Update is called once per frame
    void Update()
    {
        DoTransform();
    }

    void DoTransform()
    {
        // A matrix to move the object
        Matrix4x4 move = HW_Transforms.TranslationMat(displacement.x * Time.deltaTime,
                                                      displacement.y * Time.deltaTime,
                                                      displacement.z * Time.deltaTime);

        // A matrix to rotate the object round a specified axis
        Matrix4x4 rotate = HW_Transforms.RotateMat(angle * Time.deltaTime,
                                                   rotationAxis);

        // Matrices to set the pivot around which to rotate the object
        Matrix4x4 posOrigin = HW_Transforms.TranslationMat(-displacement.x,
                                                           -displacement.y,
                                                           -displacement.z);

        Matrix4x4 posObject = HW_Transforms.TranslationMat(displacement.x,
                                                           displacement.y,
                                                           displacement.z);

        // Combine all the matrices into a single one
        Matrix4x4 composite = posObject * rotate * posOrigin;

        // Multiply each vertex in the mesh by the composite matrix
        for (int i=0; i<newVertices.Length; i++) {
            Vector4 temp = new Vector4(newVertices[i].x,
                                       newVertices[i].y,
                                       newVertices[i].z,
                                       1);
            newVertices[i] = composite * temp;
        }

        // Replace the vertices in the mesh
        mesh.vertices = newVertices;
    }
}

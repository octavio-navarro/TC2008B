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
        Matrix4x4 move = HW_Transforms.TranslationMat(displacement.x * Time.time,
                                                      displacement.y * Time.time,
                                                      displacement.z * Time.time);

        // Matrices to apply a rotation around an arbitrary point
        // Using 'displacement' as the point of rotation
        Matrix4x4 moveOrigin = HW_Transforms.TranslationMat(-displacement.x,
                                                            -displacement.y,
                                                            -displacement.z);

        Matrix4x4 moveObject = HW_Transforms.TranslationMat(displacement.x,
                                                            displacement.y,
                                                            displacement.z);

        // Matrix to generate a rotataion
        Matrix4x4 rotate = HW_Transforms.RotateMat(angle * Time.time,
                                                   rotationAxis);

        // Combine all the matrices into a single one
        // Rotate around a pivot point
        //Matrix4x4 composite = moveObject * rotate * moveOrigin;
        // Roll and move as a wheel
        Matrix4x4 composite = move * rotate;

        // Multiply each vertex in the mesh by the composite matrix
        for (int i=0; i<newVertices.Length; i++) {
            Vector4 temp = new Vector4(baseVertices[i].x,
                                       baseVertices[i].y,
                                       baseVertices[i].z,
                                       1);
            newVertices[i] = composite * temp;
        }

        // Replace the vertices in the mesh
        mesh.vertices = newVertices;
        // Make sure the normals are adapted to the new vertex positions
        mesh.RecalculateNormals();
    }
}

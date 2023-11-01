/*
Functions to work with transformation matrices in 3D

Gilberto Echeverria
2022-11-03
*/


using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HW_Transforms : MonoBehaviour
{
    // Enumeration to define the axis
    public enum AXIS {X, Y, Z};
    // Values:        0  1  2

    [SerializeField] Vector4 point;
    [SerializeField] Vector3 pivot;
    [SerializeField] float angle;

    [SerializeField] Transform obj;

    public static Matrix4x4 TranslationMat(float tx, float ty, float tz)
    {
        Matrix4x4 matrix = Matrix4x4.identity;
        matrix[0, 3] = tx;
        matrix[1, 3] = ty;
        matrix[2, 3] = tz;
        return matrix;
    }

    public static Matrix4x4 ScaleMat(float sx, float sy, float sz)
    {
        Matrix4x4 matrix = Matrix4x4.identity;
        matrix[0, 0] = sx;
        matrix[1, 1] = sy;
        matrix[2, 2] = sz;
        return matrix;
    }

    public static Matrix4x4 RotateMat(float angle, AXIS axis)
    {
        float rads = angle * Mathf.Deg2Rad;
        Mathf.Sin(rads);

        Matrix4x4 matrix = Matrix4x4.identity;
        if (axis == AXIS.X) {

        } else if (axis == AXIS.Y) {

        } else if (axis == AXIS.Z) {

        }
        return matrix;
    }

    // Start is called before the first frame update
    void Start()
    {
        Matrix4x4 translation = TranslationMat(pivot.x, pivot.y, pivot.z);

        Vector4 newPoint = translation * point;
        Debug.Log("Matrix: " + translation);
        Debug.Log("Result: " + newPoint);

        obj.position = newPoint;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HideObject : MonoBehaviour
{
    private bool objectToggle = true;
    public GameObject objectToHide;
    // Start is called before the first frame update
    void Start()
    {
        ToggleObject();
    }

    public void ToggleObject()
    {
        objectToggle = !objectToggle;
        objectToHide.SetActive(objectToggle);
    }
}

import requests
import json

url = "http://localhost:5000/api/"
endpoint = "validate_attempt"

data = {
    "year" : 2020,
    "classroom" : 301,
    "name" : "Equipo 1",
    "num_cars": 50
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url+endpoint, data=json.dumps(data), headers=headers)

print("Request " + "successful" if response.status_code == 200 else "failed", "Status code:", response.status_code)
print("Response:", response.json())
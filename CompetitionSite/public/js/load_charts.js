"use strict";

//const url = 'http://52.1.3.19:8585/api/';
const url = 'http://localhost:5000/api/';
const endpoint = 'AllAttempts';

let chart = null;
let intervalID = null;

const colors = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 205, 86, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(54, 162, 235, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(201, 20, 20, 0.5)'
];

async function getData(url) {
    const respose = await fetch(url, {method: 'GET'});
    const data = await respose.json();
    return data;
}

async function load_charts() {

    if(chart !== null){
        chart.destroy();
    }

    const ctx = document.getElementById('myChart');

    chart = new Chart(ctx, {
    type: 'bar',
    data: {
        datasets: [
        {
          label: 'Total cars in simulation',
          borderWidth: 1
        },
        {
            label: 'Total cars that reached the end',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
    });

    update_chart();
}

async function update_chart(){
    if(chart !== null){
        const yearID = document.getElementById('yearID').value;
        const classRoomID = document.getElementById('classRoomID').value;  
        const query = url + endpoint + '/' + yearID + '/' + classRoomID;  
        const data = await getData(query);

        const teamNames = data.map((row) => row['Team_name']);
        const valuesCurrent = data.map((row) => row['attempt_current_cars']);
        const valuesArrived = data.map((row) => row['attempt_total_arrived']);
        const bgColorsCurrent = teamNames.map((name, index) => colors[index % colors.length]);
        const bgColorsArrived = teamNames.map((name, index) => colors[index + 2 % colors.length]);
        
        chart.data.labels = teamNames;
        chart.data.datasets[0].data = valuesCurrent;
        chart.data.datasets[1].data = valuesArrived;
        chart.data.datasets[0].backgroundColor = bgColorsCurrent;
        chart.data.datasets[1].backgroundColor = bgColorsArrived;

        chart.update();
    }
}

const loadButton = document.getElementById('loadButton');
const clearButton = document.getElementById('clearButton');

loadButton.addEventListener('click', ()=>{
    load_charts();
});

clearButton.addEventListener('click', ()=>{
    if(chart !== null){
        chart.destroy();
        clearInterval(intervalID);
    }
});

intervalID = setInterval(update_chart, 5000);

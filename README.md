# TC2008B

Course material for the Multi-agents and computer graphics course. By the end of the course, you will create a traffic simulation, where each car is an individual agent that has to traverse a city with other cars:

![Sample project](/docs/Images/Sample%20Simulation.png)
*Sample simulation created by Mateo Herrera, and Gerardo Gutiérrez.* 

The repository contains the following material:

- [Documents](Documents/): Has presentations, and cheat sheets.
- [Agents Visualization](AgentsVisualization/Readme.md): This is a webGL project that is used to visualize the random agents model using HTML instead of mesa.
- [Mesa examples](mesaExamples/Readme.md): The basic mesa examples. Included the random model, forest fire, and the city model.

# Setup instructions

- Environment setup. I strongly recommend using a custom venv or conda environment.
    - I recommend [miniconda](https://docs.conda.io/projects/miniconda/en/latest/) over [anaconda](https://www.anaconda.com/).
    - There is a [cheat sheet](Documents/conda-cheatsheet.pdf) in the repo with all the conda commands.
- Installation instructions:

    1. Create an environment with version 3.13 of Python:
        ```bash
        conda create --name agents python=3.13
        ```
    2. Install the requirements for **mesa**:
        ```bash
        pip install -U "mesa[all]"
        ```
    3. Install **flask**:
        ```bash
        pip install flask flask_cors
        ```
- By this moment, the environment will have all the packages needed for the projects and examples to run.

# References 

- [Mesa Documentation](https://mesa.readthedocs.io/en/stable/index.html)
- [Flask User Gudie](https://flask.palletsprojects.com/en/3.0.x/)

import numpy as np
from boid import Boid

width = 100
height = 100

flock = [Boid(*np.random.rand(2)*100, width, height) for _ in range(5)]

def updatePositions():
    global flock
    for boid in flock:
        boid.apply_behaviour(flock)
        boid.update()
        boid.edges()

print("-----FRAME 1-----")
updatePositions()
print("-----FRAME 2-----")
updatePositions()

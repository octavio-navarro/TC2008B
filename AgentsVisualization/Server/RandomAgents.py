# -*- coding: utf-8 -*-
"""
Modelos de Agente y del medio ambiente
Version 2 - Movimiento aleatorio del auto en el grid

Solución al reto de TC2008B semestre AgostoDiciembre 2021
Autor: Jorge Ramírez Uresti, Octavio Navarro
"""

from mesa import Agent, Model, model
from mesa.time import RandomActivation
from mesa.space import Grid, SingleGrid
import random

class RandomAgent(Agent):
    """ Modelo para un agente que se mueve aleatoriamente """
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        random.seed()
        self.direccion = 0 #Frente 0, Derecha 1, Izquierda 2, Atras 3
        self.sentido = 3 #Derecha 0, Izquierda 1, Arriba 2, Abajo 3
        #El sentido toma en consideracion que las columnas crecen a la derecha y los renglones
        # crecen hacia arriba

    def isFreeMyDirection(self,listFreeSpaces,list_possible_steps):
        if (self.sentido == 0): #Derecha
            if(self.direccion == 0): #Frente
                return listFreeSpaces[7],list_possible_steps[7]
            elif (self.direccion == 1): #Derecha
                return listFreeSpaces[6],list_possible_steps[6]
            elif(self.direccion == 2): #Izquierda
                return listFreeSpaces[8],list_possible_steps[8]
            elif(self.direccion == 3): #Atras
                return listFreeSpaces[1],list_possible_steps[1]
            else:
                print("Error en self.direccion")
                return False,(-1,-1)
        elif (self.sentido == 1): #Izquierda
            if(self.direccion == 0): #Frente
                return listFreeSpaces[1],list_possible_steps[1]
            elif (self.direccion == 1): #Derecha
                return listFreeSpaces[2],list_possible_steps[2]
            elif(self.direccion == 2): #Izquierda
                return listFreeSpaces[0],list_possible_steps[0]
            elif(self.direccion == 3): #Atras
                return listFreeSpaces[7],list_possible_steps[7]
            else:
                print("Error en self.direccion")
                return False,(-1,-1)
        elif (self.sentido == 2): #Arriba
            if(self.direccion == 0): #Frente
                return listFreeSpaces[5],list_possible_steps[5]
            elif (self.direccion == 1): #Derecha
                return listFreeSpaces[8],list_possible_steps[8]
            elif(self.direccion == 2): #Izquierda
                return listFreeSpaces[2],list_possible_steps[2]
            elif(self.direccion == 3): #Atras
                return listFreeSpaces[3],list_possible_steps[3]
            else:
                print("Error en self.direccion")
                return False,(-1,-1)
        elif (self.sentido == 3): #Abajo
            if(self.direccion == 0): #Frente
                return listFreeSpaces[3],list_possible_steps[3]
            elif (self.direccion == 1): #Derecha
                return listFreeSpaces[0],list_possible_steps[0]
            elif(self.direccion == 2): #Izquierda
                return listFreeSpaces[6],list_possible_steps[6]
            elif(self.direccion == 3): #Atras
                return listFreeSpaces[5],list_possible_steps[5]
            else:
                print("Error en self.direccion")
                return False,(-1,-1)
        else:
            print("Error en self.sentido")
            return False,(-1,-1)

    def move(self):
        possible_steps = self.model.grid.get_neighborhood(
            self.pos,
            moore=True, #8 conectado. Orden: arriba izquierda, centro, derecha; enmedio izquierda y derecha; abajo izquierda, centro, derecha
            include_center=True) #incluye su posición
        
        myPosition = possible_steps[4]

        #Verificar cuales espacios a mi alrededor están ocupados
        freeSpaces = []
        for pos in possible_steps:
            freeSpaces.append(self.model.grid.is_cell_empty(pos))

        #Movimiento tomando en consideración la dirección y si está libre ese espacio
        free,newPos = self.isFreeMyDirection(freeSpaces,possible_steps)
        if free:
            self.model.grid.move_agent(self,newPos)
            print(f"Se mueve de {myPosition} a {newPos} porque va hacia {self.direccion}\n")
        else:
            print(f"No se puede mover en sentido {self.sentido}, ubicación ocupada.")
            nuevoSentido = random.randint(0,3)
            while (nuevoSentido == self.sentido):
                nuevoSentido = random.randint(0,3)
            self.sentido = nuevoSentido
            print(f"Cambiando sentido a {self.sentido}\n")



    def step(self):
        """ En cada paso moverse aleatoriamente """
        self.direccion = random.randint(0,3)
        print(f"Agente: {self.unique_id} movimiento {self.direccion}")
        self.move()

class ObstacleAgent(Agent):
    """ Modelo para un Obstaculo """
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)

    def step(self):
        # The agent's step will go here.
        pass  


class RandomModel(Model):
    """ Modelo para los autos """
    def __init__(self, N,ancho,alto):
        self.num_agents = N
        self.grid = SingleGrid(ancho,alto,False) #NO Es Toroidal
        self.schedule = RandomActivation(self)
        self.running = True #Para la visualizacion

        #Crear obstaculos en los limites del grid
        numObs = (ancho * 2) + (alto * 2 - 4)
        listaPosLimite = []
        #Las dos columnas límite
        for col in [0,ancho-1]:
            for ren in range(alto):
                listaPosLimite.append((col,ren))
        #Los dos renglones limite
        for col in range(1,ancho-1):
            for ren in [0,alto-1]:
                listaPosLimite.append((col,ren))
        print(listaPosLimite)

        for i in range(numObs):
            a = ObstacleAgent(i, self)
            self.schedule.add(a)
            self.grid.place_agent(a, listaPosLimite[i])

        # Create car agents
        for i in range(self.num_agents):
            a = RandomAgent(i+1000, self) #La numeracion de los agentes empieza en el 1000
            self.schedule.add(a)
            # Add the agent to a random empty grid cell
            x = self.random.randrange(self.grid.width)
            y = self.random.randrange(self.grid.height)
            while (not self.grid.is_cell_empty((x,y))):
                x = self.random.randrange(self.grid.width)
                y = self.random.randrange(self.grid.height)
            self.grid.place_agent(a, (x, y))

    def step(self):
        '''Advance the model by one step.'''
        self.schedule.step()

# FixedAgent: Immobile agents permanently fixed to cells
from mesa.discrete_space import FixedAgent

class Cell(FixedAgent):
    """Represents a single ALIVE or DEAD cell in the simulation."""

    DEAD = 0
    ALIVE = 1

    @property
    def x(self):
        return self.cell.coordinate[0]

    @property
    def y(self):
        return self.cell.coordinate[1]

    @property
    def is_alive(self):
        return self.state == self.ALIVE

    @property
    def neighbors(self):
        return self.cell.neighborhood.agents
    
    def __init__(self, model, cell, init_state=DEAD):
        """Create a cell, in the given state, at the given x, y position."""
        super().__init__(model)
        self.cell = cell
        self.pos = cell.coordinate
        self.state = init_state
        self._next_state = None

    def determine_state(self):
        """Compute if the cell will be dead or alive at the next tick.  This is
        based on the number of alive or dead neighbors.  The state is not
        changed here, but is just computed and stored in self._nextState,
        because our current state may still be necessary for our neighbors
        to calculate their next state.
        """

        ### Simulación 1: Con base a los 3 vecinos de arriba de cada agente, 
        ### actualizar el estado del agente siguiendo reglas específicas

        # La primera línea se mantiene igual
        if self.y == 49:
            self._next_state = self.state
            return

        # Inicializar variables
        vecino1 = False
        vecino2 = False  
        vecino3 = False

        ## Encontrar a los vecinos
        for neighbor in self.neighbors:
            # Buscar solo los vecinos inmediatamente arriba (y = self.y + 1)
            if neighbor.y == self.y + 1:
                # Vecino de la derecha
                if (neighbor.x == self.x - 1):
                    vecino1 = neighbor.is_alive
                # Vecino de la izquierda
                elif (neighbor.x == self.x):
                    vecino2 = neighbor.is_alive
                # Vecino del centro
                elif (neighbor.x == self.x + 1):
                    vecino3 = neighbor.is_alive

        # Assume nextState is unchanged, unless changed below.
        self._next_state = self.state

        # Condiciones para determinar el siguiente estado
        if vecino1 and vecino2 and vecino3:
            self._next_state = self.DEAD
        elif vecino1 and vecino2 and not vecino3:
            self._next_state = self.ALIVE
        elif vecino1 and not vecino2 and vecino3:
            self._next_state = self.DEAD
        elif vecino1 and not vecino2 and not vecino3:
            self._next_state = self.ALIVE
        elif not vecino1 and vecino2 and vecino3:
            self._next_state = self.ALIVE
        elif not vecino1 and vecino2 and not vecino3:
            self._next_state = self.DEAD
        elif not vecino1 and not vecino2 and vecino3:
            self._next_state = self.ALIVE
        elif not vecino1 and not vecino2 and not vecino3:
            self._next_state = self.DEAD
        else:
            print ("Error")

    def assume_state(self):
        """Set the state to the new computed state -- computed in step()."""
        self.state = self._next_state

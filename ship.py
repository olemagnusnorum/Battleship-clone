import math

class Ship:

    ROTATION_ANGLE = 90
    offsets = None
    center_piece_index = None
    size = None
    sunk = False
    placed = False

    def __init__(self) -> None:
        pass

    def rotate_right(self, rotation) -> None:
        for i in range(len(self.offsets)):
            if i == self.center_piece_index:
                pass
            x, y = self.offsets[i]
            new_x = x * round(math.cos(math.radians(self.ROTATION_ANGLE*rotation))) - y * round(math.sin(math.radians(self.ROTATION_ANGLE*rotation)))
            new_y = x * round(math.sin(math.radians(self.ROTATION_ANGLE*rotation))) + y * round(math.cos(math.radians(self.ROTATION_ANGLE*rotation)))
            self.offsets[i] = (new_x, new_y)

    def damage_ship(self):
        self.size -= 1
        if self.size == 0:
            self.sunk = True

    def is_sunk(self):
        return self.sunk


class ThreePieceShip(Ship):
    
    offsets = [(0,-1),(0,0),(0,1)]
    center_piece_index = 1
    size = 3

    def __init__(self) -> None:
        super().__init__()


class SmallL(Ship):

    offsets = [(0,-1), (0,0), (1,0)]
    center_piece_index = 1
    size = 3

    def __init__(self) -> None:
        super().__init__()


class BigL(Ship):

    offsets = [(0,-2), (0,-1), (0,0), (1,0), (2,0)]
    center_piece_index = 2
    size = 5

    def __init__(self) -> None:
        super().__init__()
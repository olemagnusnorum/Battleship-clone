
class Ship:

    VALUE = 1
    HIT = 11
    
    def __init__(self, ship_type, ship_direction):
        self.type = ship_type
        self.direction = ship_direction

    def change_direction(self):
        """0 is vertical, 1 is horizontal"""
        self.direction = 0 if self.direction else 1
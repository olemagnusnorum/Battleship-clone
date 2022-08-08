from board import Board
from ship import SmallL, ThreePieceShip


class Player:

    def __init__(self, name) -> None:
        self.board = Board()
        self.hit_tracker = [[0 for i in range(10)] for j in range(10)]
        self.name = name
        self.ships = [SmallL(), SmallL(), SmallL(), SmallL()]
    
    def choose_coordinates(self, coordinates):
        x, y = coordinates
        self.hit_tracker[y][x]
        if self.hit_tracker[y][x] == 0:
            return coordinates
    
    def check_lost(self):
        return self.board.check_game_over()
    
    def cli_choose_coordinates(self):
        x = int(input("x: "))
        y = int(input("y: "))
        return self.choose_coordinates((x,y))

    def place_missile(self, coordinates):
        result = self.board.place_missile(coordinates)
        return result

    def update_hit_tracker(self, coordinates):
        for key, value in coordinates.items():
            x, y = key
            self.hit_tracker[y][x] = value

    def print_hit_tracker(self):
        for i in range(len(self.hit_tracker)):
            print(self.hit_tracker[i])

    def place_ships(self, ship_nr, rotation, coordinate):
        if ship_nr < len(self.ships):
            ship = self.ships[ship_nr]
            if ship.placed == False:
                if rotation > 0:
                    ship.rotate_right(rotation)
                self.board.place_ship(coordinate, ship)
            else:
                print("NOT A VALID SHIP PLACEMENT")
        else:
            print("NOT A VALID SHIP")

    def all_ships_placed(self):
        for ship in self.ships:
            if ship.placed == False:
                print("place all ships")
                return False
        return True

    def print_ships_not_placed(self):
        print("ships:", end="\t")
        for i, ship in enumerate(self.ships):
            if ship.placed == False:
                print(f"{i}", end="\t")
        print()



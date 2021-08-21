from board import BattleshipBoard 
from ship import Ship
from mine import Mine
import random as r

class Game:


    ship_types = {"small": 2, "medium": 3, "large": 4}
    ship_direction = {"vertical": 0, "horizontal": 1}
    ships = []

    def __init__(self, num_col, num_row, num_ships):
        """generates board, and ships"""
        self.board = BattleshipBoard(num_col, num_row)
        self.board.generate_board()
        for i in range(num_ships):
            self.ships.append(Ship(self.ship_types["large"], self.ship_direction["horizontal"]))

    def place_ship(self, ship, x, y):
        """places the ship by direction and cordinate at upper left"""
        if ship.direction == 1:
            if self.is_space_x(x, y, ship.type):
                for i in range(ship.type):
                    self.board.change_value(x+i, y, Ship.VALUE)
            else:
                print("the ship is too large to place at ({0}, {1})".format(x, y))
        else:
            if self.is_space_y(x, y, ship.type):
                for i in range(ship.type):
                    self.board.change_value(x, y+i, Ship.VALUE)
            else:
                print("the ship does not fit place at ({0}, {1})".format(x, y))

    def place_mine(self, x, y):
        """places a min on the grid"""
        if (self.board.grid[y][x] == 0):
            self.board.change_value(x, y, Mine.VALUE)
        else:
            print("cant place mine, somthing is already hear")

    def is_space_x(self, x, y, size):
        if (x + size - 1) <= self.board.num_col - 1:
            for i in range(size):
                if self.board.grid[y][x+i] != 0:
                    return False
        return True
    
    def is_space_y(self, x, y, size):
        if (y + size - 1) <= self.board.num_row - 1:
            for i in range(size):
                if self.board.grid[y+i][x] != 0:

                    return False
        return True

    def strike_misile(self, x, y):
        if self.board.grid[y][x] == 0:
            self.board.change_value(x, y, 10)
            print("MISS SHIP!")
        
        elif self.board.grid[y][x] == 1:
            self.board.change_value(x, y, Ship.HIT)
            print("HIT SHIP")
        
        elif self.board.grid[y][x] == 2:
            self.board.change_value(x, y, Mine.HIT)

        else:
            print("CANT HIT SAME SPOT TWICE")
    
    def check_ships_remaining(self):
        return self.board.check_ships_remaining()
    
    def fire_misile(self):
        x = int(input("give x-coordinate: "))
        y = int(input("give y-coordinate: "))
        self.strike_misile(x, y)


        


def main():
    game = Game(10, 10, 2)
    game.ships[0].change_direction()
    game.place_ship(game.ships[0], 7, 5)
    game.place_ship(game.ships[1], 2, 6)
    game.place_mine(6,5)
    game.board.to_string()
    while game.check_ships_remaining():
        game.fire_misile()
        game.board.to_string()
    print("game ended")
    game.board.to_string()


if __name__ == "__main__":
    main()

#maybe make a yaml file for config when done 
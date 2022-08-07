from ship import ThreePieceShip, SmallL, BigL

class Board:

    """
    Water: 0
    ship: 1
    Miss: 3
    Hit: 4
    """
    WATER = 0
    SHIP = 1
    MISS = 3
    HIT = 4
    HOLE_SHIP_SUNK = 5

    def __init__(self) -> None:
        self.board = [[0 for i in range(10)] for j in range(10)]
        self.ship_dict = {}
        self.ship_coordinates = {}
    
    def print_board(self) -> None:
        for i in range(len(self.board)):
            print(self.board[i])

    def place_ship(self, coordinate = (5,5), ship = None) -> bool:
        """
        placement: list of coordinates to place the ship
        Returns: true if ship could be placed
        """
        coordinate_x, coordinate_y = coordinate
        placement = []
        for x, y in ship.offsets:
            placement_x = x + coordinate_x
            placement_y = y + coordinate_y
            placement.append((placement_x, placement_y))

        if self.check_legal_ship_placement(placement):
            for x, y in placement:
                self.board[y][x] = self.SHIP
        else:
            return False

        for ship_coordinate in placement:
            self.ship_dict[ship_coordinate] = ship
        
        self.ship_coordinates[ship] = placement
        ship.placed = True
        return True

    def place_missile(self, coordinate) -> dict: # må returnere en dict med coordinat og verdi til coordinat
        affected_coordinates = {}
        x, y = coordinate
        if self.board[y][x] > 1:
            return affected_coordinates
        self.board[y][x] += 3
        if coordinate in self.ship_dict.keys():
            self.ship_dict[coordinate].damage_ship()
            if self.ship_dict[coordinate].is_sunk():
                return self.sink_ship(self.ship_dict[coordinate])
        return {coordinate : self.board[y][x]}

    def sink_ship(self, ship): # TODO
        affected_coordinates = {}
        for x, y in self.ship_coordinates[ship]:
            self.board[y][x] = self.HOLE_SHIP_SUNK
            affected_coordinates[(x,y)] = self.HOLE_SHIP_SUNK
        return affected_coordinates

    def check_legal_ship_placement(self, placement):
        for x, y in placement:
            if x < 0 or y < 0:
                print("SHIP OUT OF BOUND")
                return False
            if self.board[y][x] != self.WATER:
                print("SHIP COLLITION WITH OTHER SHIP")
                return False
        return True


    def check_game_over(self):
        for y in range(len(self.board)):
            for x in range(len(self.board[y])):
                if self.board[y][x] == self.SHIP:
                    return False
        
        return True

    
        




if __name__ == "__main__":
    b = Board()
    s = BigL()
    s.rotate_right()
    p = b.place_ship(1, (5,5), s)
    b.print_board()
    while not b.check_game_over():
        x_input = int(input("x: "))
        y_input = int(input("y: "))
        b.place_missile((x_input, y_input))
        b.print_board() 
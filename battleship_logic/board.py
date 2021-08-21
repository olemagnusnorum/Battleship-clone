
class BattleshipBoard:

    grid = []

    def __init__(self, num_col, num_row):
        self.num_col = num_col
        self.num_row = num_row

    def generate_board(self):
        self.grid = [[0 for i in range(self.num_col)] for i in range(self.num_row)]

    def change_value(self, x, y, value):
        self.grid[y][x] = value


    def to_string(self):
        for i in range(self.num_col):
            print(self.grid[i])


def main():
    game = BattleshipBoard(10,10)
    game.generate_board()
"""
if __name__ == '__main__':
    main()
"""


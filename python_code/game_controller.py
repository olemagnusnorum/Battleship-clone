
from player import Player

class GameController:

    def __init__(self) -> None:
        self.player_1 = Player("Ole")
        self.player_2 = Player("Magnus")


    def give_possition(self, player_defence, coordinates) -> int:
        result = player_defence.place_missile(coordinates)
        return result

    def give_result(self, player_attack, coordinates) -> None:
        player_attack.update_hit_tracker(coordinates)

    def get_possition(self, player_attack):
        coordinates = player_attack.cli_choose_coordinates()
        return coordinates

    def print_ships_not_placed(self, player):
        player.print_ships_not_placed()

    def play_one_round(self, player_attack, player_defence): ###### MÅ HA ERROR HANDELING ######
        coordinates = self.get_possition(player_attack)
        result = self.give_possition(player_defence, coordinates)
        self.give_result(player_attack, result)

    

    def play_game(self):
        print("player 1")
        while not self.player_1.all_ships_placed():
            self.print_ships_not_placed(self.player_1)
            ship_nr = int(input("ship nr: "))
            rotation = int(input("rotation: "))
            x = int(input("x: "))
            y = int(input("y: "))
            self.player_1.place_ships(ship_nr,rotation, (x,y))
            self.player_1.board.print_board()

        print("player 2")
        while not self.player_2.all_ships_placed():
            self.print_ships_not_placed(self.player_2)
            ship_nr = int(input("ship nr: "))
            rotation = int(input("rotation: "))
            x = int(input("x: "))
            y = int(input("y: "))
            self.player_2.place_ships(ship_nr, rotation (x,y))
            self.player_2.board.print_board()
            
        self.player_1.board.print_board()
        print()
        self.player_2.board.print_board()
        print()
        turn = 0
        player_attack = self.player_1
        player_defence = self.player_2
        while not player_defence.check_lost():
            if turn % 2 == 0:
                player_attack = self.player_1
                player_defence = self.player_2
            else:
                player_attack = self.player_2
                player_defence = self.player_1
            
            print(f"player {player_attack.name}'s turn")
            player_attack.print_hit_tracker()
            self.play_one_round(player_attack, player_defence)
            player_attack.print_hit_tracker()
            
            turn += 1
            
        print(f"Player {player_attack.name} won!")



if __name__ == "__main__":
    gc = GameController()
    gc.play_game()
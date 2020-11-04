# Snake Game movement interface
# To be used in an interval as the game is running to perpetuate movement
direction = 'n'

cur_matrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 2, 0],
    [0, 0, 0, 3, 0],
    [0, 0, 0, 4, 5],
    [0, 0, 0, 0, 0]
]

expected_matrix = [
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 2, 3, 0],
    [0, 0, 0, 4, 0],
    [0, 0, 0, 5, 0],
    [0, 0, 0, 0, 0]
]

# Validating input types being sent in the useEffect
def check_input(matrix, direction, pos, length):
    if type(length) != int:
        return False
    if type(pos[0]) != int or type(pos[1]) != int:
        return False
    if direction not in ['n', 'e', 's', 'w']:
        return False
    if type(matrix) != list or type(matrix[0]) != list:
        return False

    return True

# Movement Functions [pop_head, cw_search]
def pop_head(matrix, direction, pos):
    if direction == 'n':
        if pos[0] == 0   or   matrix[ pos[0] - 1 ][ pos[1] ] == 2:
            return 'snek_dead'
        matrix[ pos[0] - 1 ][ pos[1] ] = 1

    if direction == 'e':
        if pos[1] == len(matrix[0])-1   or   matrix[ pos[0] ][ pos[1]+1 ] == 2:
            return 'snek_dead'
        matrix[ pos[0] ][ pos[1]+1 ] = 1
    
    if direction == 's':
        if pos[0] == len(matrix)-1   or   matrix[ pos[0]+1 ][ pos[1] ] == 2:
            return 'snek_dead'
        matrix[ pos[0]+1 ][ pos[1] ] = 1

    if direction == 'w':
        if pos[1] == 0   or   matrix[ pos[0] ][ pos[1]-1 ] == 2:
            return 'snek_dead'
        matrix[ pos[0] ][ pos[1]-1 ] = 1

    return True

def search_and_update(matrix, pos, body_num):
    # check 'n' for next body part
    if pos[0] > 0 and matrix[ pos[0]-1 ][ pos[1] ] == body_num:
        matrix[pos[0]-1][pos[1]] = body_num
        return [ pos[0]-1, [pos[1]] ]

    # and 'e'
    if pos[1] < len(matrix[0])-1 and matrix[ pos[0] ][ pos[1]+1 ] == body_num:
        matrix[pos[0]][pos[1]+1] = body_num
        return [ pos[0], pos[1]+1 ]

    # 's' too
    if pos[0] < len(matrix)-1 and matrix[ pos[0]+1 ][ pos[1] ] == body_num:
        matrix[ pos[0]+1 ][ pos[1] ] = body_num
        return [ pos[0]+1, pos[1] ]

    # can't forget about 'w'
    if pos[1] > 0 and matrix[ pos[0] ][ pos[1]-1 ] == body_num:
        matrix[ pos[0] ][ pos[1]-1 ] = body_num
        return [ pos[0], pos[1]-1 ]

    return False

def destroy(matrix, pos, body_num):
    # check 'n' for next body part
    if pos[0] > 0 and matrix[ pos[0]-1 ][ pos[1] ] == body_num:
        matrix[pos[0]-1][pos[1]] = 0

    # and 'e'
    if pos[1] < len(matrix[0])-1 and matrix[ pos[0] ][ pos[1]+1 ] == body_num:
        matrix[pos[0]][pos[1]+1] = 0

    # 's' too
    if pos[0] < len(matrix)-1 and matrix[ pos[0]+1 ][ pos[1] ] == body_num:
        matrix[ pos[0]+1 ][ pos[1] ] = 0

    # can't forget about 'w'
    if pos[1] > 0 and matrix[ pos[0] ][ pos[1]-1 ] == body_num:
        matrix[ pos[0] ][ pos[1]-1 ] = 0

def move_snake(matrix, direction, pos, length):
    if not check_input(matrix, direction, pos, length):
        return 'input not recognized, check args types and structure'

    if pop_head(matrix, direction, pos) == 'snek_dead':
        return 'snek_dead'

    # Starting at the previous head, we begin updating the values of the body so matrix reflects the snake's next position
    body_num = 2
    running_pos = [ pos[0], pos[1] ]

    while not body_num > length:
        running_pos = search_and_update(matrix, running_pos, body_num)
        body_num += 1
    
    # destroy should work to not break any pieces if snake's current move also consumes a food
    destroy(matrix, running_pos, body_num)

    return matrix
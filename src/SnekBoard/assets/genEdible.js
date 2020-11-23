function genEdible(board, size) {
    let x, y

    do {
        x = Math.floor(Math.random() * size[1])
        y = Math.floor(Math.random() * size[0])
    } while (
        board[y][x] !== 'empty'
        &&
        board[y][x] !== 'snek'
        )


    let modBoard = []

    for (let i = 0; i < board.length; i++) {
        modBoard[i] = [...board[i]]
    }

    modBoard[y][x] = 'edible'

    return modBoard
}

export {genEdible}
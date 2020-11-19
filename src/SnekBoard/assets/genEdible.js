function genEdible(board) {
    let x, y

    do {
        x = Math.floor(Math.random() * 30)
        y = Math.floor(Math.random() * 30)
    } while (board[y][x] !== 'empty')


    let modBoard = []

    for (let i = 0; i < board.length; i++) {
        modBoard[i] = [...board[i]]
    }

    modBoard[y][x] = 'edible'

    return modBoard
}

export {genEdible}
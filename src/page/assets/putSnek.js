function putSnek(board, y, x) {

    console.log(y, x)

    let modBoard = []

    for (let i = 0; i < board.length; i++) {
        modBoard[i] = [...board[i]]
    }

    modBoard[y][x] = 'head'

    return modBoard
}

export {putSnek}
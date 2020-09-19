// expect direction, board
// would it help to know where the snek is currently? 
function moveSnek(head, board, dir) {
    // given head location, adjust snek one dir over in board if possible
    // if (dir === 'n' && head[0] === 0) throw
    let headR = head[0]
    let headC = head[1]

    let lastRow = board.length - 1
    let lastCol = board[0].length - 1

    let newBoard = JSON.parse(JSON.stringify(board))

    // return same board or throw an error[compare trade-offs]
    if (dir === 'n') {
        if (headR === 0) return board
        newBoard[headR][headC] = 0
        newBoard[headR - 1][headC] = 'head'

        return newBoard
    }

    if (dir === 'e') {
        if (headC === lastCol) return board
        newBoard[headR][headC] = 0
        newBoard[headR][headC + 1] = 'head'

        return newBoard
    }

    if (dir === 's') {
        if (headR === lastRow) return board
        newBoard[headR][headC] = 0
        newBoard[headR + 1][headC] = 'head'

        return newBoard
    }

    if (dir === 'w') {
        if (headC === 0) return board
        newBoard[headR][headC] = 0
        newBoard[headR][headC - 1] = 'head'

        return newBoard
    }
}

export { moveSnek }

// stretch: how do I keep track of length? 
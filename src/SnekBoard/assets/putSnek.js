function putSnek(board, y, x) {

    console.log(y, x)

// [11.18.20]
// if I'm splicing a new list, doesn't that incur a shitton of time ea movement???
// note to self: test this
    let prevBoard = board
    let nextBoard = []

    for (let i = 0; i < prevBoard.length; i++) {
        let curRow = prevBoard[i]
        nextBoard[i] = [...curRow]
    }
// what if I just use immer and modify that point to be head? 
    nextBoard[y][x] = 'snek'

    return nextBoard
}

export {putSnek}
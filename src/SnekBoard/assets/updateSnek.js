// expect direction, board
// would it help to know where the snek is currently? 
function updateSnek(snek, board, dir) {

    // snekParts : [y, x] y first because we do [row][col] in nested matrix
    const dirMods = {
        'n': [-1, 0],
        'e': [0, 1],
        's': [1, 0],
        'w': [0, -1]
    }

    let rowMod = dirMods[dir][0]
    let colMod = dirMods[dir][1]

    let moveToRow = snek[snek.length-1][0] + rowMod
    let moveToCol = snek[snek.length-1][1] + colMod

    if (
        moveToRow < 0 || moveToRow >= board.length
        ||
        moveToCol < 0 || moveToCol >= board[0].length
    )
        { throw new Error(`Attempt to move to row: ${moveToRow}, col: ${moveToCol} failed`) }

    let consume = false
    if (board[moveToRow][moveToCol] === 'edible') { consume = true }

    let nextSnek = new Array(consume ? snek.length+1 : snek.length)

    for (let i = 0; i < snek.length; i++) {
        if (i === 0 && consume) {
            nextSnek.push(snek[i])
        }
        if (i === 0) { continue }

        if (i !== 0) {
            nextSnek.push(snek[i])
        }
    }

    nextSnek.push([moveToRow, moveToCol])

    return nextSnek
}

export { updateSnek }

// stretch: how do I keep track of length? 
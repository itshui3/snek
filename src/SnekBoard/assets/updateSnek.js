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
    console.log('rowMod', rowMod)
    let colMod = dirMods[dir][1]
    console.log('colMod', colMod)

    let moveToRow = snek[snek.length-1][0] + rowMod
    let moveToCol = snek[snek.length-1][1] + colMod
    console.log('moveToRow: ' + moveToRow, 'moveToCol: ' + moveToCol)

    // boundary collision handling
    // if (
    //     moveToRow < 0 || moveToRow >= board.length
    //     ||
    //     moveToCol < 0 || moveToCol >= board[0].length
    // ) {  }

    let consume = false
    if (board[moveToRow][moveToCol] === 'edible') { consume = true }

    let nextSnekLength = consume ? snek.length+1 : snek.length
    let nextSnek = new Array(nextSnekLength)

    // the logic below doesn't account for a growing snake. 
    // the snake can grow, but the movement after growth 
    for (let i = 0; i < snek.length; i++) {
        if (i === 0 && consume) {
            nextSnek[i] = snek[i]
        }
        if (i === 0) { continue }

        if (i !== 0 && consume) {
            nextSnek[i] = snek[i]
            
        } else if (i !== 0 && !consume) {
            nextSnek[i-1] = snek[i]
        }
    }
    if (consume) {
        nextSnek[snek.length] = [moveToRow, moveToCol]
    } else {
        nextSnek[snek.length-1] = [moveToRow, moveToCol]
    }

    return nextSnek
}

export { updateSnek }

// stretch: how do I keep track of length? 
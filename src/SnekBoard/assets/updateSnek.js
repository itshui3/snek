// expect direction, board
// would it help to know where the snek is currently? 
// function updateSnek(snek, board, dir) {
function updateSnek(snek, consume, moveTo) {

    // snekParts : [y, x] y first because we do [row][col] in nested matrix

    // depends on consume, snek, moveToRow, moveToCol
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
        nextSnek[snek.length] = [moveTo[0], moveTo[1]]
    } else {
        nextSnek[snek.length-1] = [moveTo[0], moveTo[1]]
    }

    return nextSnek
}

export { updateSnek }

// stretch: how do I keep track of length? 
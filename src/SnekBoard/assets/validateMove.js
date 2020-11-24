function validateMove(snek, board, dir) {

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


    return {
        // consume: consume,
        moveTo: [moveToRow, moveToCol]
    }
}

export {validateMove}
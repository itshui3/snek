const buildBoard = (sizeConfig) => {
    const size = {
        x: sizeConfig[1],
        y: sizeConfig[0]
    }
    
    let buildBoard = []
    for (let j = 0; j < size['y']; j++) {
        buildBoard.push([])
        for (let i = 0; i < size['x']; i++) {
            buildBoard[j].push('empty')
        }
    }

    return buildBoard
}

export { buildBoard }
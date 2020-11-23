const size = {
    x: 10,
    y: 10
}

let buildBoard = []
for (let j = 0; j < size['y']; j++) {
    buildBoard.push([])
    for (let i = 0; i < size['x']; i++) {
        buildBoard[j].push('empty')
    }
}

export { buildBoard }
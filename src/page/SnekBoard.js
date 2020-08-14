import React, { useState, useEffect } from 'react'

const size = {
    x: 30,
    y: 30
}

const SnekBoard = () => {

    const [board, setBoard] = useState(() => {
        let buildBoard = []
        for (let j = 0; j < size['y']; j++) {
            buildBoard.push([])
            for (let i = 0; i < size['x']; i++) {
                buildBoard[j].append('empty')
            }
        }
    })

    useEffect(() => {
        console.log(board)
    }, [board])

    return (
        <>

        </>
    )
}

export default SnekBoard
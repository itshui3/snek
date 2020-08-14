import React, { useState, useEffect } from 'react'
// style
import './SnekBoard.css'

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
                buildBoard[j].push(0)
            }
        }
        return buildBoard
    })

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)

    return (
        <>
            <div className='grid'>
            {
                board.map( (row, i) => (
                    <div className='grid_row'>
                        {
                            row.map( (cell, i) => (
                                <div className='grid_cell'></div>
                            ))
                        }
                    </div>
                ))
            }
            </div>

            <button className='start'>Start</button>
        </>
    )
}

export default SnekBoard
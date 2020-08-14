import React, { useState, useEffect } from 'react'
// style
import './SnekBoard.css'
// assets
import {
    buildBoard as defaultBoard
} from './assets/board'

const SnekBoard = () => {

    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)

    useEffect(() => {
        if (!prep) {
            setBoard(defaultBoard)
        }

        let x = Math.floor(Math.random() * 30)
        let y = Math.floor(Math.random() * 30)

// figure out how to set the damn board
        // setBoard([
        //     ...board,
        //     board[x][]
        // ])

    }, [prep])

    const startGame = () => {
        setPrep(!prep)
    }

    return (
        <>
            <button 
            className='start'
            onClick={startGame}
            >
                { prep ? 'End' : 'Start' }
            </button>
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

            
        </>
    )
}

export default SnekBoard
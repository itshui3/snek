import React, { useState, useEffect } from 'react'
// style
import './SnekBoard.css'
// assets
import {
    buildBoard as defaultBoard
} from './assets/board'

function genEdible(board) {
    let x, y

    do {
        x = Math.floor(Math.random() * 30)
        y = Math.floor(Math.random() * 30)
    } while (board[y][x] !== 'empty')


    let modBoard = []

    for (let i = 0; i < board.length; i++) {
        modBoard[i] = [...board[i]]
    }

    modBoard[y][x] = 'edible'

    return modBoard
}

const SnekBoard = () => {

    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)

    useEffect(() => {
        if (!prep) {
            setBoard(defaultBoard)
            return
        }

        setBoard((board) => genEdible(board))

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
                board.map( (row, rowID) => (
                    <div 
                    key={rowID}
                    className='grid_row'
                    >
                        {
                            row.map( (cell, cellID) => (
                                <div 
                                key={cellID}
                                className={`grid_cell ${cell}`}
                                ></div>
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
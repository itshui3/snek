import React, { useState, useEffect } from 'react'
// style
import './SnekBoard.css'
// assets
import {
    buildBoard as defaultBoard
} from './assets/board'
// compos
import Cell from './Cell'

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

function putSnek(board, y, x) {

    console.log(y, x)

    let modBoard = []

    for (let i = 0; i < board.length; i++) {
        modBoard[i] = [...board[i]]
    }

    modBoard[y][x] = 'head'

    return modBoard
}

const SnekBoard = () => {

    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)

    useEffect(() => {
        if (!prep) {
            setBoard(defaultBoard)
            setSnek(false)
            return
        }

        setBoard((board) => genEdible(board))

    }, [prep])

    const startGame = () => {
        setPrep(!prep)
    }
    
    const placeSnek = (y, x) => {
        if (snek) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnek(true)
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
                                <Cell 
                                key={cellID}
                                rowID={rowID}
                                cellID={cellID}
                                cell={cell}
                                className={`grid_cell ${cell}`}
                                placeSnek={placeSnek}
                                ></Cell>
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
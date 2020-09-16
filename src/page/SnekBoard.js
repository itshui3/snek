import React, { useState, useEffect, useRef } from 'react'
// style
import './SnekBoard.css'
// assets
// assets[props]
import {
    buildBoard as defaultBoard
} from './assets/board'
// assets[methods]
import {genEdible} from './assets/genEdible'
import {putSnek} from './assets/putSnek'
// compos
import Cell from './Cell'

const SnekBoard = () => {

    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)

    const window = useRef(document.window)
    useEffect(() => {
        console.log(window)
    }, [])

    useEffect(() => {
        if (!prep) {
            setBoard(defaultBoard)
            setSnek(false)
            return
        }

        setBoard((board) => genEdible(board))

    }, [prep])
// I expect a snek-set state to tell users to select a direction
    useEffect(() => {

    }, [snek])

    const startGame = () => {
        setPrep(!prep)
    }
    
    const placeSnek = (y, x) => {
        if (snek) { return }
        if (!prep) { return }
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
            <div
            className='notification'
            >
                {prep && !snek && 'place snek'}
            </div>
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
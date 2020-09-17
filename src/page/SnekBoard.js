import React, { useState, useEffect, useRef } from 'react'
// utility
import KeyBoardEventHandler from 'react-keyboard-event-handler'
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
    const [direction, setDirection] = useState(false)

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

    const startGame = () => {
        setPrep(!prep)
    }
    
    const placeSnek = (y, x) => {
        if (snek) { return }
        if (!prep) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnek(true)
    }

    const setDir = (key, ev) => {
        if (!prep || !snek) { return }
        console.log('key: ', key)
        setDirection((dir) => {

            if (key === 'e') return 'e'
            if (key === 's') return 's'
            if (key === 'd') return 'd'
            if (key === 'f') return 'f'

            return dir
        })
        // grab direction from event from somewhere
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
                {/* build an element for movement keys that visibly depress when keyboard event fired */}
                { 
                !prep
                ? 'Click Start to begin'
                : prep && !snek 
                ? 'Place ur snek boyo' 
                : prep && snek && !direction
                ? 'Move ur snek boyo [e(north), s(west), d(south), f(east)]'
                : null
                }

            </div>
            {/* directions controller */}
            <KeyBoardEventHandler 
            handleKeys={['e', 's', 'd', 'f']}
            onKeyEvent={(key, ev) => setDir(key, ev)}
            />
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
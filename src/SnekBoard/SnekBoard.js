import React, { useState, useEffect, useRef } from 'react'
// utility
import KeyBoardEventHandler from 'react-keyboard-event-handler'
import produce from 'immer'
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
import {moveSnek} from './assets/moveSnek'
// compos
import Cell from './Cell/Cell'

const SnekBoard = () => {
// will immer's setState cause a refresh where the useEffect[board, dir] will notice? 
    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snekHead, setSnekHead] = useState(false)
    const [dir, setDir] = useState(false)
    const [intClearer, setIntClearer] = useState(false)

    const window = useRef(document.window)
    useEffect(() => {
        console.log(window)
    }, [])
// my prep set-up is a bit unorganized. 
// I should find some way to write it such that it's easier to read 
// while still taking care of things sequentially
    useEffect(() => {
        if (!prep) {
            setBoard(defaultBoard)
            setSnekHead(false)
            return
        }

        setBoard((board) => genEdible(board))

    }, [prep])

// movement logic
    useEffect(() => {
        if (!dir) {return}

        moveSnek(snekHead, board, dir)

    }, [dir])

    const startGame = () => {
        setPrep(!prep)
    }

    const endGame = () => {
        intClearer()
    }
    
    const placeSnek = (y, x) => {
        if (snekHead) { return }
        if (!prep) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnekHead([y, x])
    }

    const setDirection = (key, ev) => {
        if (!prep || !snekHead) { return }

        setDir((dir) => {

            if (key === 'e') return 'n'
            if (key === 's') return 'w'
            if (key === 'd') return 's'
            if (key === 'f') return 'e'

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
                : prep && !snekHead 
                ? 'Place ur snek boyo' 
                : prep && snekHead && !dir
                ? 'Move ur snek boyo [e(north), s(west), d(south), f(east)]'
                : null
                }

            </div>
            {/* directions controller */}
            <KeyBoardEventHandler 
            handleKeys={['e', 's', 'd', 'f']}
            onKeyEvent={(key, ev) => setDirection(key, ev)}
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
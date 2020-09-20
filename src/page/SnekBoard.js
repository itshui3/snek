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
import Cell from './Cell'

const SnekBoard = () => {
// will immer's setState cause a refresh where the useEffect[board, dir] will notice? 
    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)
    const [dir, setDir] = useState(false)

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

    useEffect(() => {
        if (
            dir === 'e' ||
            dir === 's' ||
            dir === 'd' ||
            dir === 'f'
        ) {
            console.log('board', board)
            setBoard((board) => {
                let newBoard = produce(
                    board, draft => {
                        let [newDraft, newPos] = moveSnek(snek, draft, dir)
                        draft = newDraft
                        setSnek(newPos)
                        console.log('draft', draft)
                    }
                )
                return newBoard
            }
)
        }
    }, [dir])

    const startGame = () => {
        setPrep(!prep)
    }
    
    const placeSnek = (y, x) => {
        if (snek) { return }
        if (!prep) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnek([y, x])
    }

    const setDirection = (key, ev) => {
        if (!prep || !snek) { return }
        console.log('key: ', key)
        setDir((dir) => {

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
                : prep && snek && !dir
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
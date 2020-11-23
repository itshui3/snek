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
import {updateSnek} from './assets/updateSnek'
// compos
import Cell from './Cell/Cell'

const SnekBoard = () => {
// will immer's setState cause a refresh where the useEffect[board, dir] will notice? 
    const [board, setBoard] = useState(defaultBoard)

    const [prep, setPrep] = useState(false)
    const [snek, setSnek] = useState(false)
    const [dir, setDir] = useState(false)
    const [intClearer, setIntClearer] = useState(false)

    const window = useRef(document.window)

// my prep set-up is a bit unorganized. 
// I should find some way to write it such that it's easier to read 
// while still taking care of things sequentially
    useEffect(() => {
        if (!prep) {
            setBoard(defaultBoard)
            setSnek(false)
            return
        }

        setBoard((board) => genEdible(board))

    }, [prep])

// movement logic
// currently whenever dir is changed, snek should move
    useEffect(() => {
        if (!dir) {return}

        let nextSnek = updateSnek(snek, board, dir)

        setSnek(nextSnek)

        let copyBoard = JSON.parse(JSON.stringify(board))
        for (let i = 0; i < snek.length; i++) {
            let curRow = snek[i][0]
            let curCol = snek[i][1]

            copyBoard[curRow][curCol] = 'empty'
        }
        setBoard(copyBoard)

    }, [dir])

    useEffect(() => {
        console.log('snek', snek)
        let copyBoard = JSON.parse(JSON.stringify(board))

        for (let i = 0; i < snek.length; i++) {
            let curRow = snek[i][0]
            let curCol = snek[i][1]

            copyBoard[curRow][curCol] = 'snek'
        }

        setBoard(copyBoard)
        console.log('snek after update', snek)

    }, [snek])

    const startGame = () => {
        setPrep(!prep)
    }
    
    const placeSnek = (y, x) => {
        if (snek) { return }
        if (!prep) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnek([[y, x]])
    }

    const setDirection = (key, ev) => {
        if (!prep || !snek) { return }

        setDir((dir) => {

            if (key === 'e') return 'n'
            if (key === 's') return 'w'
            if (key === 'd') return 's'
            if (key === 'f') return 'e'

            return dir
        })

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
                board 
                ? 
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
                :
                null
            }
            </div>
        </>
    )
}

export default SnekBoard
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
    useEffect(() => {
        console.log(window)
    }, [])
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

        // let nextSnek = updateSnek(snek, board, dir)
        console.log('snek', snek)
        // snekParts : [y, x] y first because we do [row][col] in nested matrix
        const dirMods = {
            'n': [-1, 0],
            'e': [0, 1],
            's': [1, 0],
            'w': [0, -1]
        }

        let rowMod = dirMods[dir][0]
        let colMod = dirMods[dir][1]

        let moveToRow = snek[snek.length-1][0] + rowMod
        let moveToCol = snek[snek.length-1][1] + colMod

        if (
            moveToRow < 0 || moveToRow >= board.length
            ||
            moveToCol < 0 || moveToCol >= board[0].length
        )
            { throw new Error(`Attempt to move to row: ${moveToRow}, col: ${moveToCol} failed`) }

        let consume = false
        if (board[moveToRow][moveToCol] === 'edible') { consume = true }

        let nextSnek = new Array(consume ? snek.length+1 : snek.length)

        for (let i = 0; i < snek.length; i++) {
            if (i === 0 && consume) {
                nextSnek.push(snek[i])
            }
            if (i === 0) { continue }

            if (i !== 0) {
                nextSnek.push(snek[i])
            }
        }
        
        nextSnek[consume ? snek.length : snek.length-1] = [moveToRow, moveToCol]
        // take prev snek stuff off new board
        let copyBoard = JSON.parse(JSON.stringify(board))
        for (let i = 0; i < snek.length; i++) {
            copyBoard[snek[i][0]][snek[i][1]] = 'empty'
        }
        for (let i = 0; i < nextSnek.length; i++) {
            copyBoard[nextSnek[i][0]][snek[i][1]] = 'snek'
        }

        setSnek(nextSnek)
        setBoard(copyBoard)

    }, [dir])

    const startGame = () => {
        setPrep(!prep)
    }

    const endGame = () => {
        intClearer()
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
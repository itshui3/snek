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
import {validateMove} from './assets/validateMove'
// compos
import Cell from './Cell/Cell'

const boardSize = [10, 10]

const SnekBoard = () => {
// will immer's setState cause a refresh where the useEffect[board, dir] will notice? 
    const [board, setBoard] = useState(() => defaultBoard(boardSize))

    const [gameState, setGameState] = useState(false)
    const [snek, setSnek] = useState(false)
    const [dir, setDir] = useState(false)
    const [intClearer, setIntClearer] = useState(false)

    const window = useRef(document.window)

// my gameState set-up is a bit unorganized. 
// I should find some way to write it such that it's easier to read 
// while still taking care of things sequentially
    useEffect(() => {
        if (!gameState) {
            setBoard(defaultBoard(boardSize))
            setSnek(false)
            return
        }
        if (gameState !== 'end') {
            setBoard((board) => genEdible(board, boardSize))
        }
        

    }, [gameState])

// movement logic
// currently whenever dir is changed, snek should move
    useEffect(() => {
        if (!dir || !gameState || gameState === 'end') {return}
        const {moveTo} = validateMove(snek, board, dir)

        let validateMovement = true
        // [1] check that moveTo is within grid
        if (
            moveTo[0] >= board.length 
            || 
            moveTo[0] < 0
            ||
            moveTo[1] >= board[0].length
            ||
            moveTo[1] < 0
            ) {
            // can't make this move
            setGameState('end')
            validateMovement = false
            return
        }
        // [2] check that moveTo is not moving to a snek
        if (board[moveTo[0]][moveTo[1]] === 'snek') {
            setGameState('end')
            validateMovement = false
            return
        }

        let consume = false
        if (board[moveTo[0]][moveTo[1]] === 'edible') { 
            consume = true 
        }
        
        let nextSnek = updateSnek(
            snek, 
            consume, 
            moveTo
        )

        setSnek(nextSnek)

        let copyBoard = JSON.parse(JSON.stringify(board))
        for (let i = 0; i < snek.length; i++) {
            let curRow = snek[i][0]
            let curCol = snek[i][1]

            copyBoard[curRow][curCol] = 'empty'
        }
        if (consume) {
            copyBoard = genEdible(copyBoard, boardSize)
        }
        setBoard(copyBoard)



    }, [dir])

    useEffect(() => {

        let copyBoard = JSON.parse(JSON.stringify(board))

        for (let i = 0; i < snek.length; i++) {
            let curRow = snek[i][0]
            let curCol = snek[i][1]

            copyBoard[curRow][curCol] = 'snek'
        }
        console.log('board', board)
        setBoard(copyBoard)
    }, [snek])

    useEffect(() => {
        console.log('board after update', board)
    }, [board])

    const startGame = () => {
        if (gameState === 'end') {
            setGameState(false)
        } else if (gameState) {
            setGameState(false)
        } else if (!gameState) {
            setGameState(!gameState)
        }
        
    }
    
    const placeSnek = (y, x) => {
        if (snek) { return }
        if (!gameState) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnek([[y, x]])
    }

    const setDirection = (key, ev) => {
        if (!gameState || !snek || snek === 'end') { return }

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
                { gameState 
                    ? 
                        gameState === 'end'
                        ?
                        'Reset'
                        :
                        'End' 
                    : 
                    'Start' }
            </button>
            <div
            className='notification'
            >
                {/* build an element for movement keys that visibly depress when keyboard event fired */}
                { 
                !gameState
                ? 'Click Start to begin'
                : gameState && !snek 
                ? 'Place ur snek boyo' 
                : gameState && snek && !dir
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
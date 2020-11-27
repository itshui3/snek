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
import {fetchFreshState} from './assets/fetchFreshState'
// compos
import Cell from './Cell/Cell'

const boardSize = [10, 10]

const SnekBoard = () => {
// will immer's setState cause a refresh where the useEffect[board, dir] will notice? 
    const [board, setBoard] = useState(() => defaultBoard(boardSize))

    // gameState -> false -> 'moving' -> 'end'
    const [gameState, setGameState] = useState(false)
    const [snek, setSnek] = useState(false)
    const [dir, setDir] = useState(false)
    const [intClearer, setIntClearer] = useState(false)
    const [edibles, setEdibles] = useState(0)
    const [maxEdibles, setMaxEdibles] = useState(1)

// my gameState set-up is a bit unorganized. 
// I should find some way to write it such that it's easier to read 
// while still taking care of things sequentially

    useEffect(() => {
        console.log('gameState', gameState)
        if (!gameState) {
            setBoard(defaultBoard(boardSize))
            setSnek(false)
            if (intClearer) {clearInterval(intClearer)}
            return
        }

        if (gameState && gameState !== 'moving') {
            setBoard((board) => genEdible(board, boardSize))
            setEdibles(1)
        }
    
        if (gameState === 'moving') {
            let movementClearer = setInterval(() => {

                // I  can write a cool-ass helper function that 'wraps' stateSetters
                const [dir, board, snek] = fetchFreshState([setDir, setBoard, setSnek])

                    const { moveTo } = validateMove(snek, board, dir)
                    // check if I can make this move, end game if can't
                    if(!endGame(board, moveTo)) {
                        setGameState('end')
                        setIntClearer(intClearer => {
                            if(intClearer) {
                                clearInterval(intClearer)
                            }
                            return false
                        })
                    } else {
                        let consume = false; 


                        setEdibles(edibles => {
                            if (board[moveTo[0]][moveTo[1]] === 'edible') {
                                consume = true
                                return edibles - 1
                            } else {
                                return edibles
                            }
                        })
                        

                        setBoard(resetBoard(board, snek))

                        setSnek(updateSnek(snek, consume, moveTo))
                        setDir(dir)
                    }
            }, 500)

            setIntClearer(movementClearer)
        }

        if (gameState === 'end') {
            if (intClearer) {clearInterval(intClearer)}
        }
        
    }, [gameState])

    useEffect(() => {
        console.log('board snek error', snek, board)
        let copyBoard = JSON.parse(JSON.stringify(board))

        for (let i = 0; i < snek.length; i++) {
            let curRow = snek[i][0]
            let curCol = snek[i][1]

            copyBoard[curRow][curCol] = 'snek'
        }

        setBoard(copyBoard)
    }, [snek])

    useEffect(() => {

        if (edibles < maxEdibles) {
            setBoard((board) => genEdible(board, boardSize))
            setEdibles((edibles) => edibles + 1)
        }

    }, [edibles])

    const endGame = (board, moveTo) => {

        if (
            moveTo[0] >= board.length
            || 
            moveTo[0] < 0
            ||
            moveTo[1] >= board[0].length
            ||
            moveTo[1] < 0
            ) {
            return false
        }

        if (board[moveTo[0]][moveTo[1]] === 'snek') {
            return false
        }

        return true
    }

    const moveSnek = (board, snek, moveTo) => {

        let consume = false

        setEdibles((edibles) => {
            if (board[moveTo[0]][moveTo[1]] === 'edible') {
                consume = true
                return edibles - 1
            } else {
                return edibles
            }
        })
        
        return updateSnek(snek, consume, moveTo)
    }

    const resetBoard = (board, snek) => {
        // [2] adjust board
        let copyBoard = JSON.parse(JSON.stringify(board))

        for (let i = 0; i < snek.length; i++) {
            let curRow = snek[i][0]
            let curCol = snek[i][1]

            copyBoard[curRow][curCol] = 'empty'
        }

        if (edibles < maxEdibles) {
            copyBoard = genEdible(copyBoard, boardSize)
            setEdibles((edibles) => {
                return edibles + 1
            })
        }

        return copyBoard
    }

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
            <div className='statistics'>
                {
                    gameState && gameState !== 'end'
                        ?
                        'things eaten: ' + (snek.length-1).toString()
                        :
                        null
                }
            </div>
            {/* directions controller */}
            <KeyBoardEventHandler 
            handleKeys={['e', 's', 'd', 'f']}
            onKeyEvent={(key, ev) => {
                setDirection(key, ev)
                if (gameState !== 'moving') {
                    setGameState('moving')
                }
            }}
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
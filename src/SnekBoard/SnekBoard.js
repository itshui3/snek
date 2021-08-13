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
import {calculateMove} from './assets/calculateMove'
import {fetchFreshState} from './assets/fetchFreshState'
// compos
import Cell from './Cell/Cell'

const preBuiltBoardSize = [30, 30]

const SnekBoard = () => {
// will immer's setState cause a refresh where the useEffect[board, dir] will notice? 
    const [boardSize, setBoardSize] = useState(preBuiltBoardSize)
    const [board, setBoard] = useState(() => defaultBoard(boardSize))

    // gameState -> false -> 'moving' -> 'end'
    const [gameState, setGameState] = useState(false)
    // if true, game has ended and assets frozen until reset triggered
    const [awaitReset, setAwaitReset] = useState(false)
    const [snek, setSnek] = useState([])
    const [dir, setDir] = useState(false)
    const [intClearer, setIntClearer] = useState(false)
    const [edibles, setEdibles] = useState(0)
    const [maxEdibles, setMaxEdibles] = useState(1)

    // init board
    useEffect(() => {
        setBoard(defaultBoard(boardSize))

        if (!gameState) {

        }
    }, [gameState])

    useEffect(() => {
        // awaitReset should first switch when game ends
        // 1] by button press
        // 2] by user losing the game
        // once it switches back, the gameState should still be on
        if (!awaitReset && gameState) {
            setGameState(false)
            setSnek([])
            setDir(false)
            // board is controlled by snek, so I don't need to adjust this
            // setBoard(defaultBoard(boardSize))
        }

        if (awaitReset) {
            clearInterval(intClearer)
            setIntClearer(false)
        }

    }, [awaitReset])

    useEffect(() => {
        console.log(
            'dir', dir, 
            'snek', snek, 
            'intClearer', intClearer,
            'gameState', gameState,
            'awaitReset', awaitReset
            )
        if (!gameState || awaitReset) {
            clearInterval(intClearer)
            setIntClearer(false)
            return
        }
        
        if (dir && snek.length && !intClearer) {
            let movementClearer = setInterval(() => {

                // I  can write a cool-ass helper function that 'wraps' stateSetters
                const [dir, board, snek] = fetchFreshState([setDir, setBoard, setSnek])

                    const { moveTo } = calculateMove(snek, board, dir)
                    // check if I can make this move, end game if can't
                    if(!validateMove(board, moveTo)) {
                        setAwaitReset(true)
                        setIntClearer(intClearer => {
                            if(intClearer) {
                                clearInterval(intClearer)
                                setIntClearer(false)
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
        
    }, [gameState, dir])

    useEffect(() => {
        // so if my snek controls board, I never need to modify board except for adding edible
        let copyBoard = JSON.parse(JSON.stringify(board))

        if (gameState) {

            for (let i = 0; i < snek.length; i++) {
                let curRow = snek[i][0]
                let curCol = snek[i][1]
    
                copyBoard[curRow][curCol] = 'snek'
            }
    
            if (snek.length && edibles === 0) {
                for (let i = 0; i < maxEdibles; i++) {
                    copyBoard = genEdible(copyBoard)
                }
            }
            setBoard(copyBoard)
        } else {
            setBoard(() => defaultBoard(boardSize))
        }
    }, [snek])

    useEffect(() => {
        // if game starts, or if edibles get eaten, build more
        if (gameState && edibles < maxEdibles) {
            setBoard((board) => genEdible(board, boardSize))
            setEdibles((edibles) => edibles + 1)
        }

    }, [gameState, edibles])

    const validateMove = (board, moveTo) => {

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

    const resetBoard = (board, snek) => {

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

    const controller = () => {

        if (!gameState) {
            setGameState(true)
        }

        if (gameState && !awaitReset) {
            // game progressing
            setAwaitReset(true)
            return
        } 
        
        if (gameState && awaitReset) {
            // game ended state
            performReset()
            return
        }

    }

    const performReset = () => {
        setGameState(false)
        setAwaitReset(false)
        setEdibles(0)
        setSnek([])
        setDir(false)
    }
    
    const placeSnek = (y, x) => {

        if (snek.length) { return }
        if (!gameState) { return }
        setBoard((board) => putSnek(board, y, x))
        setSnek([[y, x]])
    }

    const setDirection = (key, ev) => {
        if (!gameState || !snek || awaitReset) { return }

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
            onClick={controller}
            >
                {   gameState 
                    ? 
                        awaitReset
                        ?
                        'Reset'
                        :
                        'End'
                    :
                    'Start' 
                }
            </button>
            <div className='notification'>
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
            <div className='notification'>
                {
                    gameState
                        ?
                        'Things eaten: ' + (snek.length ? snek.length-1 : 0).toString()
                        :
                        null
                }
            </div>
            {/* directions controller */}
            <KeyBoardEventHandler 
            handleKeys={['e', 's', 'd', 'f']}
            onKeyEvent={(key, ev) => {
                if(gameState && !awaitReset) {
                    setDirection(key, ev)
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
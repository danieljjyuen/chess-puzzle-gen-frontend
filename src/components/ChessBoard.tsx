    import Chessground  from '@react-chess/chessground';
    import '@react-chess/chessground/node_modules/chessground/assets/chessground.base.css';
    import '@react-chess/chessground/node_modules/chessground/assets/chessground.brown.css';
    import '@react-chess/chessground/node_modules/chessground/assets/chessground.cburnett.css';

    import {Chess, Move} from 'chess.js';
    import { useState, useEffect, useRef } from 'react';
    import { Config } from "@react-chess/chessground/node_modules/chessground/src/config.ts";
    import {Key, Dests} from "@react-chess/chessground/node_modules/chessground/src/types.ts"
    import { usePuzzle } from "../hooks/usePuzzle";
    
    const game = new Chess();

    const ChessBoard:React.FC = () => {
        // const [game,setGame] = useState(new Chess());
        let minsize: number = Math.min(window.innerHeight, window.innerWidth)-50;
        //const [legalMoves, setLegalMoves] = useState<string[]>([]);
        const [position, setPosition] = useState(game.fen()); 
        const [dests, setDests] = useState<Dests>(new Map<Key, Key[]>);
        
        const { puzzle, solvePuzzle, loading } = usePuzzle();
        const puzzleRef = useRef(puzzle);
        const solutionRef = useRef<string[]>([]);
        //const [solution, setSolution] = useState<string[]>([]);

        // solution: [
        //     "c4e6",
        //     "d8d7",
        //     "f3f8"
        //     ],

        // example solution: c4e6 => from:c4 to: e6

        //use move number to match solution's
        //const [moveNumber, setMoveNumber] = useState(0);
        const moveNumberRef = useRef(0);
        // const handleMove = (from:Square, to:Square) => {
        //     //const move:Move = game.move({from, to});
        //     const validMoves = game.moves({square:from, verbose: true});
        //     console.log(validMoves);
        //     const isValidMove = validMoves.some((move: Move) => move.to === to);

        //     if(isValidMove) {
        //         const move: Move = game.move({from, to});
        //         if(move) {
        //             setPosition(game.fen());
        //             updateDests();
        //         }
        //     } else {
        //         console.log("invalid move");
        //         setPosition(game.fen());
        //         updateDests();
        //         console.log(game.fen());
        //     }
        // };

        const [config, setConfig] = useState<Config>({
            draggable: {
                enabled: true,
                showGhost: true,
                autoDistance: true, 
                deleteOnDropOff: false,
            },
            events: {
                //move: handleMove,
                // select: (square:any) => onSelectPiece(square),
                // select: (square:Key ) => {
                //     const moves = game.moves({square, verbose: false});
                // }, 

            },
            movable: {
                events: {
                    after: (from:Key, to: Key) => {
                        console.log("chessgorund match chess.js", game.fen());
                        //handleMove(from, to)
                        try{    
                            // console.log(puzzle);
                            console.log(moveNumberRef.current);
                            const realSolution = puzzleRef.current.puzzle.solution;
                            console.log(realSolution);
                            const currentMove = realSolution[moveNumberRef.current];
                            console.log("current move : " , currentMove);
                            const correctFrom = currentMove.slice(0,2);
                            const correctTo = currentMove.slice(2,4);
                            console.log(from===correctFrom);
                            console.log(to===correctTo);
                            console.log(`attempting to move from ${from} to ${to}`);
                            if(from === correctFrom && to === correctTo){
                                const move:Move = game.move({from, to, promotion: 'q'});
                                if (move) {
                                    moveNumberRef.current++;
                                    //setMoveNumber(moveNumber+1);
                                    setPosition(game.fen());
                                    updateDests();
                                    solutionRef.current.push(currentMove);
                                    //setSolution(prevSolution => [...prevSolution, currentMove]);
                                }
                                console.log(moveNumberRef, " " , realSolution.length);
                                console.log(solutionRef.current);
                                if(moveNumberRef.current == realSolution.length) {
                                    solvePuzzle(solutionRef.current, realSolution);
                                    moveNumberRef.current = 0;
                                }else {
                                    //console.log("auto moving");
                                    const autoNextMove = realSolution[moveNumberRef.current];
                                    console.log("auto moving ", autoNextMove)
                                    const autoFrom = autoNextMove.slice(0,2);
                                    const autoTo = autoNextMove.slice(2,4);
                                    const autoMove = game.move({from:autoFrom, to:autoTo, promotion: 'q'});
                                    
                                    if(autoMove){
                                        setPosition(game.fen());
                                        updateDests();
                                        //setMoveNumber(moveNumber+1);
                                        moveNumberRef.current++;
                                        solutionRef.current.push(autoNextMove);
                                        //setSolution(prevSolution => [...prevSolution, autoNextMove]);
                                    }
                                }
                            }else{
                                setPosition(game.fen());
                                updateDests();
                            }

                        }catch(error){
                            console.log(error);
                            setPosition(game.fen());
                            updateDests();
                        }
                    },
                },
                dests: dests,
                showDests: true,

            },
            highlight: {
                lastMove: true,
                check: true,
            },
            animation: {
                enabled: true,
            },
            fen: position,
            selectable: {
                enabled: true,
            }
        }
        );        
        
        useEffect(() => {
            // setPosition(game.fen());
            
            setConfig({
                ...config,
                fen: position,
                movable: {
                    ...config.movable,
                    dests,
                }
            });
            console.log(dests);
            
            //console.log(config);

        },[dests,position]);

        
        useEffect(() => {
            if(!loading && puzzle) {
                console.log(puzzle);
                puzzleRef.current = puzzle;
                console.log(puzzleRef);
                game.load(puzzle.fen);
                setPosition(game.fen());
                solutionRef.current = [];
                updateDests();
                setConfig({
                    ...config,
                    orientation: puzzleRef.current.puzzle.initialPly%2 == 0 ? 'black': 'white',
                });

            }
        },[puzzle, loading])
    
        
        // useEffect(() => {
        //     console.log(position);
        //     setPosition(game.fen());
        // },[game.fen()]);

        const updateDests = () => {
            //const dests: { [key: string]: string[]} = {};
            const dests = new Map<Key, Key[]>();
            game.board().forEach((row) => {
                row.forEach((piece) => {
                    if( piece){
                        const square = piece.square;
                        const moveList = game.moves({ square, verbose: false});
                        if(moveList.length > 0){
                            dests.set(square as Key, moveList as Key[]);
                            //dests[square] = moveList;
                        }
                    }
                });
            });
            setDests(dests);
        };




        // const updateDests = () => {
        //     const dests: { [key:string]:string[] } = {};
        //     //console.log(dests);
        //     const board = game.board();
            // board => {
            //     {
            //         square, color, type , ex: 'e4' 'b' 'r'
            //     }
            // }

            //         chess.moves()
            // // -> ['a3', 'a4', 'b3', 'b4', 'c3', 'c4', 'd3', 'd4', 'e3', 'e4',
            // //     'f3', 'f4', 'g3', 'g4', 'h3', 'h4', 'Na3', 'Nc3', 'Nf3', 'Nh3']

            // chess.moves({ square: 'e2' }) // single square move generation
            // // -> ['e3', 'e4']
            //chess.moves({ piece: 'n' }) // generate moves for piece type
            // ['Na3', 'Nc3', 'Nf3', 'Nh3']

    //       chess.moves({ verbose: true }) // return verbose moves
    // -> [{ color: 'w', from: 'a2', to: 'a3',
    //       piece: 'p',
    //       san: 'a3', lan: 'a2a3',
    //       before: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    //       after: 'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1'
    //       # a `captured` field is included when the move is a capture
    //       # a `promotion` field is included when the move is a promotion




        return (
            <div>
                {loading ? 
                        <div>loading...</div>
                :
                <Chessground config={config} width={minsize} height={minsize}/>}
            </div>
        )
    }

    export default ChessBoard
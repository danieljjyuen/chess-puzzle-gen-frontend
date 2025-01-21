    import Chessground  from '@react-chess/chessground';
    import '@react-chess/chessground/node_modules/chessground/assets/chessground.base.css';
    import '@react-chess/chessground/node_modules/chessground/assets/chessground.brown.css';
    import '@react-chess/chessground/node_modules/chessground/assets/chessground.cburnett.css';

    import {Chess, Move} from 'chess.js';
    import { useState, useEffect } from 'react';
    import { Config } from "@react-chess/chessground/node_modules/chessground/src/config.ts";
    import {Key, Dests} from "@react-chess/chessground/node_modules/chessground/src/types.ts"
    const game = new Chess();

    const ChessBoard:React.FC = () => {
        // const [game,setGame] = useState(new Chess());
        let minsize: number = Math.min(window.innerHeight, window.innerWidth)-50;
        //const [legalMoves, setLegalMoves] = useState<string[]>([]);
        const [position, setPosition] = useState(game.fen()); 
        const [dests, setDests] = useState<Dests>(new Map<Key, Key[]>);

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

        // const onSelectPiece = (square:Square) => {
        //     const moves:Move[] = game.moves({square, verbose:false});
        //     const legal = moves.map((move:Move)=> move.to);
        //     //setLegalMoves(legal);
        // }

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
                        //handleMove(from, to)
                        try{    
                            const move:Move = game.move({from, to});
                            if (move) {
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
            // updateDests();
            setConfig({
                ...config,
                fen: position,
                movable: {
                    ...config.movable,
                    dests,
                }
            });
            //console.log(dests);
            console.log(config);

        },[dests,position]);
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
                <Chessground config={config} width={minsize} height={minsize}/>
            </div>
        )
    }

    export default ChessBoard
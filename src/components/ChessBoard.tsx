import { Chessboard } from "react-chessboard"

const ChessBoard = () => {
    let minsize: number = Math.min(window.innerHeight, window.innerWidth)-50
    return (
        <div>
            <Chessboard boardWidth={minsize}/>
        </div>
    )
}

export default ChessBoard
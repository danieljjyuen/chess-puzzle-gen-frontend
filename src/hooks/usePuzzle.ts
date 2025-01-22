import { useState, useEffect } from "react";
import { getNextPuzzle } from "../services/puzzleService";

export const usePuzzle = () => {
    const [puzzle, setPuzzle] = useState<any|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPuzzle = async () => {
        try {
            setLoading(true);
            const data = await getNextPuzzle();
            if(data){
                setPuzzle(data);
            }
            
        } catch (error){
            console.error("error fetching puzzle: ",error);
        } finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPuzzle();
    }, []);

    const solvePuzzle = (solution: string[], realSolution: string[]) => {
        console.log(realSolution);
        console.log(solution);
        console.log(solution===realSolution);
        const isCorrect = JSON.stringify(solution) === JSON.stringify(realSolution);
        if(isCorrect){
            alert("correct");
            fetchPuzzle();
        }else {
            alert("try again");
        }
    };
    return {puzzle, solvePuzzle, loading};
};


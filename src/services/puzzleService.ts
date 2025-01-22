import axios from 'axios';

const API_URL = 'http://localhost:8000/puzzle/next';

export const getNextPuzzle = async (): Promise<any> => {
    try{
        const response = await axios.get(API_URL);
        return response.data;
    }catch(error) {
        console.error("error next puzzle", error);
    }
}
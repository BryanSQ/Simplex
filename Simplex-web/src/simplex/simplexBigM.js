import { rowAddition, simplexProcess } from "./utils";
const M = 1000000;


const simplexBigM = (matrix, BVS, header, artificialCount) => {
    const end = matrix[0].length - 1;
    const start = end - artificialCount;
    for (let i = start; i < end; i++) {
        if (matrix[0][i] == M) {
            for (let j = 1; j < matrix.length; j++) {
                if (matrix[j][i] == 1) {
                    matrix = rowAddition(matrix, j, 0, -M);
                }
            }
        }         
    }
    const newMatrix = simplexProcess(matrix, BVS, header);
    return newMatrix;
}

export { simplexBigM };
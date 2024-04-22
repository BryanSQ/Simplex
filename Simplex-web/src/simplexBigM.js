import { iteration, findPivotRow, showMatrix, showResults, findPivot, buildRestrictions, getOtherVariablesCount, buildBVS, rowMult, rowAddition, simplexProcess } from "./utils";
const M = 1000000;

const buildBigMZ = (variables, slackCount, artificialCount) => {
    const z = variables.map((variable) => {
        const v = Number(variable[Object.keys(variable)[0]])
        return v * -1
    })

    for (let i = 0; i < slackCount; i++) {
        z.push(0);
    }

    for (let i = 0; i < artificialCount; i++) {
        z.push(M);
    }

    z.push(0);
    console.log(z);
    return z;
}

const simplexBigM = (matrix, BVS, header, artificialCount) => {
    for (let i = matrix[0].length - artificialCount; i < matrix.length; i++) {
        if (matrix[0][i] == M) {
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[j][i] == 1) {
                    matrix = rowAddition(matrix, j, 0, -M);  
                }
            }
        }         
    }

    simplexProcess(matrix, BVS, header);
    return matrix;
}

export { buildBigMZ, simplexBigM };
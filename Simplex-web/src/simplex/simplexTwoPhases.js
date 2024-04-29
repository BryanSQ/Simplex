import { buildZ, rowAddition, simplexProcess, removeColumn, findPivot, iteration } from "./utils";
import { setSteps } from '../reducers/tableReducer';
import Store from "../store";

const buildTwoPhaseZ = (variables, slackCount, artificialCount, target) => {
    const total = variables.length + slackCount + artificialCount;
    const begin = []
    let w = []
    for (let i = 0; i < total; i++) {
       if (i < (variables.length + slackCount)) {
           w.push(0);
       } else {
           w.push(1);
       }
    }

    w.push(0);

    const z = buildZ(variables, (slackCount + artificialCount + 1), target);
    
    begin.push(w);
    begin.push(z);

    return begin;
    
}

const simplexTwoPhases = (matrix, BVS, header, artificialCount) => {
    const end = matrix[0].length - 1;
    const start = end - artificialCount;
    for (let i = start; i < end; i++) {
        if (matrix[0][i] == 1) {
            for (let j = 1; j < matrix.length; j++) {
                if (matrix[j][i] == 1) {
                    matrix = rowAddition(matrix, j, 0, -matrix[j][i]);
                }
            }
        }         
    }

    console.table(matrix);
    const phaseOne = simplexProcessPhaseOne(matrix, BVS, header);
    const matrixPhaseOne = phaseOne.matrix;
    const BVSPhaseOne = phaseOne.BVS;
    const headerPhaseOne = phaseOne.header;

    console.log(matrixPhaseOne[0]);
    for(let i = 0; i < matrixPhaseOne[0].length; i++) {
        if (matrixPhaseOne[0][i] > 0 && matrixPhaseOne[0][matrixPhaseOne[0].length - 1] != 0) {
            alert('The problem is infeasible');
            break;
        }
    }
    
    const { preparedMatrix, preparedHeader } = phaseTwoPreparation(matrixPhaseOne, headerPhaseOne, artificialCount);
    const matrixPhaseTwo = simplexProcess(preparedMatrix, BVSPhaseOne, preparedHeader);
   
    return matrixPhaseTwo;
}

const phaseTwoPreparation = (matrix, header, artificialCount) =>{
    let preparedMatrix = matrix.slice(1);
    const end = preparedMatrix[0].length - 1;
    const start = end - artificialCount;
    for (let i = start; i < end; i++) {
        preparedMatrix = removeColumn(preparedMatrix, i);
        header.splice(i, 1)
    }
    return { preparedMatrix, preparedHeader: header };
}

const simplexProcessPhaseOne = (matrix, BVS, header) => {
    Store.dispatch(setSteps(matrix.map((row, i) => [i, BVS[i], ...row])));    
    while (matrix[0].slice(0, matrix[0].length-1).some(value => value < 0)) {
        const pivot = findPivot(matrix[0]);
        const pivotRow = findPivotRow(matrix, pivot);
        if (pivotRow === -1) {
            alert('No solution');
            break;
        }
        BVS[pivotRow.index] = header[pivot];
        const pivotValue = matrix[pivotRow.index][pivot];        
        matrix = iteration(matrix, pivotRow.index, pivot, pivotValue);
        const step = matrix.map((row, i) => [i, BVS[i], ...row]);
        Store.dispatch(setSteps(step));
    }
    
    return { matrix,  BVS, header };
}

const findPivotRow = (matrix, pivot) => {
    const ratios = matrix.slice(2).map((row, key) => {
        const value = row[row.length - 1];
        const pivotValue = row[pivot];

        if (pivotValue <= 0) {
            return {index: key+1, value: Infinity}
        }
        return {index: key+1, value: value/pivotValue}
    })

    if (ratios.every(ratio => ratio.value === Infinity)) {
        return -1;
    }

    const pivotRow = ratios.reduce((prev, current) => {
        return prev.value < current.value ? prev : current;
    })
    
    return pivotRow;
}

export { buildTwoPhaseZ, simplexTwoPhases };
import { rowAddition, simplexProcess, removeColumn, findPivot, iteration } from "./utils";
import { setHeader, setSteps, setSwaps  } from '../reducers/tableReducer';
import Store from "../store";
import { setNotification } from "../reducers/notificationReducer";

const buildW = (variables, counts) => {
    const { slackCount, artificialCount } = counts;
    const total = variables.length + slackCount + artificialCount;
    let w = []
    for (let i = 0; i < total; i++) {
       if (i < (variables.length + slackCount)) {
           w.push(0);
       } else {
           w.push(1);
       }
    }

    w.push(0);
    return w;    
}


const simplexTwoPhases = (matrix, BVS, header, artificialCount) => {
    const end = matrix[0].length - 1;
    const start = end - artificialCount;
    for (let i = start; i < end; i++) {
        if (matrix[0][i] == 1) {
            for (let j = 1; j < matrix.length; j++) {
                if (matrix[j][i] == 1) {
                    matrix = rowAddition(matrix, j, 0, -1);
                }
            }
        }         
    }

    const phaseOne = simplexProcessPhaseOne(matrix, BVS, header);
    const matrixPhaseOne = phaseOne.matrix;
    const BVSPhaseOne = phaseOne.BVS;
    const headerPhaseOne = phaseOne.header;
  
    for(let i = 0; i < matrixPhaseOne[0].length; i++) {
        if (matrixPhaseOne[0][i] > 0 && matrixPhaseOne[0][matrixPhaseOne[0].length - 1] != 0) {            
            Store.dispatch(setNotification('Sin solución factible', 5000));
            break;
        }
    }
    
    console.table(matrixPhaseOne);
    const { preparedMatrix, preparedBVS, preparedHeader } = phaseTwoPreparation(matrixPhaseOne, BVSPhaseOne, headerPhaseOne, artificialCount);
    console.table(preparedMatrix);
    const matrixPhaseTwo = simplexProcess(preparedMatrix, preparedBVS, preparedHeader);
    
    return matrixPhaseTwo;
}

const phaseTwoPreparation = (matrix, BVS, header, artificialCount) =>{

    let preparedMatrix = matrix.slice(1);
    const end = preparedMatrix[0].length - 1;
    const start = end - artificialCount;
    for (let i = start; i < end; i++) {
        console.log('quita', i);
        preparedMatrix = removeColumn(preparedMatrix, i);
        header.splice(i, 1)
    }
    BVS.splice(0, 1);
    return { preparedMatrix, preparedBVS: BVS, preparedHeader: header };
}

const simplexProcessPhaseOne = (matrix, BVS, header) => { 
    while (matrix[0].slice(0, matrix[0].length-1).some(value => value < 0)) {
        const pivot = findPivot(matrix[0]);
        const { pivotRow, ratios } = findPivotRow(matrix, pivot);
        if (!pivotRow) {
            Store.dispatch(setNotification('Sin solución factible', 5000));
            break;
        }

        const pivotValue = matrix[pivotRow.index][pivot];   
        
        const r = ['N/A', 'N/A', ...ratios.map(ratio => ratio.value)];
        const newHeader = ['i', 'BVS', ...header, 'RHS', 'Radios'];
        const step = matrix.map((row, i) => [i, BVS[i], ...row, r[i]]);
        Store.dispatch(setHeader(newHeader));
        Store.dispatch(setSteps(step));       
        
        matrix = iteration(matrix, pivotRow.index, pivot, pivotValue);
        console.log(BVS[pivotRow.index], header[pivot], pivotRow.index);
        Store.dispatch(setSwaps({ out: BVS[pivotRow.index], in: header[pivot], ratio: r[pivotRow.index] }));
        BVS[pivotRow.index] = header[pivot];
    }
    Store.dispatch(setHeader(['i', 'BVS', ...header, 'RHS']));
    Store.dispatch(setSteps(matrix.map((row, i) => [i, BVS[i], ...row])));
    Store.dispatch(setSwaps({ out: 'N/A', in: 'N/A', ratio: 'N/A' }));
    
    return { matrix,  BVS, header };
}

const findPivotRow = (matrix, pivot) => {
    const ratios = matrix.slice(2).map((row, key) => { // 
        const value = row[row.length - 1];
        const pivotValue = row[pivot];

        if (pivotValue <= 0) {
            return {index: key+2, value: Infinity}
        }
        return {index: key+2, value: value/pivotValue}
    })
  
    if (ratios.every(ratio => ratio.value === Infinity)) {
        return { pivotRow: -1, value: NaN};
    }

    const pivotRow = ratios.reduce((prev, current) => {
        return prev.value < current.value ? prev : current;
    })
    
    return { pivotRow, ratios };
}

export { simplexTwoPhases, buildW };
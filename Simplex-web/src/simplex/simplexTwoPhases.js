import { buildZ, rowAddition, simplexProcess, removeColumn } from "./utils";

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

    //console.log('Two phase Z');
   // console.log(begin);

    return begin;
    
}

const simplexTwoPhases = (matrix, BVS, header, artificialCount) => {
    const end = matrix[0].length - 1;
    const start = end - artificialCount;
    for (let i = start; i < end; i++) {
        if (matrix[0][i] == 1) {
            for (let j = 0; j < matrix.length; j++) {
                if (matrix[j][i] == 1) {
                    matrix = rowAddition(matrix, j, 0, -1);
                }
            }
        }         
    }

    const phaseOne = simplexProcess(matrix, BVS, header);
    const matrixPhaseOne = phaseOne.matrix;
    const BVSPhaseOne = phaseOne.BVS;
    const headerPhaseOne = phaseOne.header;

    for(let i = 0; i < matrixPhaseOne[0].length; i++) {
        if (matrixPhaseOne[0][i] > 0 && matrixPhaseOne[0][matrixPhaseOne[0].length - 1] != 0) {
            alert('The problem is infeasible');
        }
    }
    
    console.log('BVS QUE ENTRA A LA FASE 2', BVSPhaseOne);
    const { preparedMatrix, preparedHeader } = phaseTwoPreparation(matrixPhaseOne, headerPhaseOne, artificialCount);
    const matrixPhaseTwo = simplexProcess(preparedMatrix, BVSPhaseOne, preparedHeader).matrix;
   
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

export { buildTwoPhaseZ, simplexTwoPhases };
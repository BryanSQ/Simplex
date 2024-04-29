import Store from "../store";
import { setSteps } from '../reducers/tableReducer';

const iteration = (matrix, pivotRow, pivotCol, pivotValue) =>{
    if (pivotValue != 1){
        // console.log('row operation', `1/${pivotValue}f${pivotRow} => f${pivotRow}`);
        matrix = rowMult(matrix, pivotRow, 1/pivotValue);
        // console.table(matrix);
    }
    
    for (let i = 0; i < matrix.length; i++) {
        if (i !== pivotRow && matrix[i][pivotCol] !== 0) {            
            // console.log('row operation', `${-matrix[i][pivotCol]}f${pivotCol} + f${i} => f${i}`);
            matrix = rowAddition(matrix, pivotRow, i, -matrix[i][pivotCol]);
        }      
    }
    return matrix;
}

// function to multiply a row of a matrix by a constant
const rowMult = (matrix, rowIndex, k) => {
    return matrix.map((row, i) => {
        return row.map(n  => {
            return i === rowIndex ? n * k : n;
        })
    })
}

// function to multiply a row by a constant and add it to another row, and return the new matrix
const rowAddition = (matrix, sourceRowIndex, targetRowIndex, k) => {
    return matrix.map((row, i) => {
        if (i === targetRowIndex) {
            return row.map((n, j) => n + matrix[sourceRowIndex][j] * k);
        } else {
            return row;
        }
    });
};

const findPivotRow = (matrix, pivot) => {
    const ratios = matrix.slice(1).map((row, key) => {
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

const showMatrix = (matrix, BVS, header) => {
    const tableHeader = ['i', 'BVS', ...header, 'RHS'];
    const table = [tableHeader, ...matrix.map((row, i) => [i, BVS[i], ...row])];
    console.table(table);
}

const showResults = (matrix, BVS) => {
    const results = {}
    for (let i = 0; i < matrix.length; i++) {
        results[BVS[i]] = matrix[i][matrix[i].length - 1];
    }
    console.log(results);
}

const slackOrArtificial = (row) => {
    // if the row constains 1 and the rest are 0, it is a slack variable
    // if the row contains a -1 and a 1, it is a artificial variable
    const one = row.indexOf(1);
    const minusOne = row.indexOf(-1);
    if (one !== -1 && minusOne === -1) {
        return one;
    }
    if (one !== -1 && minusOne !== -1) {
        return one;
    }
}

const buildBVS = (header, matrix, start, method) => {
    const subheader = header.slice(start, header.length);
    const submatrix = matrix.map(row => row.slice(start, matrix[0].length - 1));
    const vars = []
    start++;
    for (let row of submatrix) {
        const position = slackOrArtificial(row);
        vars.push(`${subheader[position]}`);
        start++;
    }
    if (method === 'two-phase') {
        return ['-w', 'z', ...vars];
    }
    return ['z', ...vars];
}

const findPivot = (z) => {
    const min = Math.min(...z.slice(0, z.length - 1));
    const index = z.indexOf(min);
    return index;
}

const buildRestrictions = (restrictions) => {
    // if the restriction is a <=, we need to add a slack variable to the matrix
    // if the restriction is a =, we need to add a artificial variable to the matrix
    // if the restriction is a >=, we need to add a surplus variable to the matrix
    const { slackCount, artificialCount } = getOtherVariablesCount(restrictions);
    const restrictionMatrix = [];

    let slackPos = 0;
    let artificialPos = 0;
    for (let restriction of restrictions){

        const row = []
        const slack = Array.from({length: slackCount}, () => 0);
        const artificial = Array.from({length: artificialCount}, () => 0);

        // get the variables x1, x2, x3, etc values
        const values = Object.keys(restriction)
            .filter(key => key !== 'comp' && key !== 'res')
            .map(key => Number(restriction[key]));

        row.push(...values);
        // get the restriction type
        const comp = restriction.comp;

        if (comp === '<=') {
            slack[slackPos] = 1;
            slackPos++;
        }
        if (comp === '=') {
            artificial[artificialPos] = 1;
            artificialPos++;            
        }
        if (comp === '>=') {
            slack[slackPos] = -1;
            artificial[artificialPos] = 1;
            slackPos++;
            artificialPos++;
        }
        row.push(...slack);
        row.push(...artificial);
        row.push(Number(restriction.res));
        restrictionMatrix.push(row);
        
        
    }
    return restrictionMatrix;
}

const getOtherVariablesCount = (restrictions) => {
    let surplus = restrictions.filter(restriction => restriction.comp === '>=').length;
    let slackCount = restrictions.filter(restriction => restriction.comp === '<=').length + surplus;        
    let artificialCount = restrictions.filter(restriction => restriction.comp === '=').length + surplus;
    return {
        slackCount,
        artificialCount        
    }
}

const buildZ = (variables, counts, target, method) =>{
    const { slackCount, artificialCount } = counts;
    const total = slackCount + artificialCount + 1;
    let vars = []

    const methodConstant = {
        'simplex': 0,
        'big-m': 1000000,
        'two-phase': 1
    }

    vars = variables.map((variable) => {
        const v = Number(variable[Object.keys(variable)[0]])
        return target === 'max' ? v * -1 : v;
    })
        
    let zFill = new Array(total).fill(0);
    for (let i = slackCount; i < total - 1; i++) {
        zFill[i] = methodConstant[method];
    }

    const z = vars.concat(zFill);
    return z;
}

const simplexProcess = (matrix, BVS, header) => {
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
    

    return { matrix, BVS };
}

const buildHeader = (variables, counts) => {
    const { slackCount, artificialCount } = counts;
    let header = []
    header.push(...variables.map((variable) => Object.keys(variable)[0]));
    let start = variables.length + 1;
    for (let i = 0; i < slackCount; i++) {
        header.push(`s${start}`);
        start++;
    }
    for (let i = 0; i < artificialCount; i++) {
        header.push(`a${start}`);
        start++;
    }
    return header;
}

const buildMatrix = (Z, restrictions) => {
    const matrix = [];
    matrix.push(Z);
    const restrictionMatrix = buildRestrictions(restrictions);    
    console.table(restrictionMatrix);
    matrix.push(...restrictionMatrix);
    return matrix;
}

function removeColumn(matrix, column) {
    return matrix.map(row => {
        return [...row.slice(0, column), ...row.slice(column + 1)];
    });
}


export { 
    iteration, findPivotRow, showMatrix, 
    showResults, buildBVS, findPivot, 
    buildRestrictions, getOtherVariablesCount, 
    buildZ, rowMult, rowAddition, 
    simplexProcess, buildMatrix, removeColumn, buildHeader
};
import Store from "./store";

const Simplex = () => {
    // access the simplex reducer
    const {variables, restrictions} = Store.getState().simplex;
    console.log(restrictions);
     buildRestrictions(restrictions);

    // create a matrix with the simplex data and BVS
    const {BVS, matrix, header} = buildMatrix(variables, restrictions);
    

    console.log(BVS, matrix);

    const processedMatrix = simplexProcess(matrix, BVS, header);

    console.log('After simplex', processedMatrix);

    //console.log(variables, restrictions);
}


const buildZ = (variables, rows) =>{
    const z = variables.map((variable) => {
        const v = Number(variable[Object.keys(variable)[0]])
        return v*-1
    })

    for (let zeros = 0; zeros < rows; zeros++) {
        z.push(0);
    }    
    return z;
}

const buildRestrictions = (restrictions) => {
    // if the restriction is a <=, we need to add a slack variable to the matrix
    // if the restriction is a =, we need to add a artificial variable to the matrix
    // if the restriction is a >=, we need to add a surplus variable to the matrix
    for (let i = 0; i < restrictions.length; i++) {
        const restriction = restrictions[i];
        const restrictionValue = Number(restriction[Object.keys(restriction)[0]]);
        const restrictionType = Object.keys(restriction)[0];
        if (restrictionType === '<=') {
            restrictions[i] = {...restriction, s: 1, a: 0, r: restrictionValue} //[0,0,0,0,1]
        } else if (restrictionType === '=') {
            restrictions[i] = {...restriction, s: 0, a: 1, r: restrictionValue} //[0,0,0,0,0,0, 1]
        } else {
            restrictions[i] = {...restriction, s: -1, a: 1, r: restrictionValue} //[0,0,0,0,0,0, -1, 1]
        }
    }
    console.log(restrictions);
}

const buildBVS = (variables, restrictions) => {
    let start = variables + 1;
    const bvs = []
    for (let i = 0; i < restrictions; i++) {
        bvs.push(`s${start}`)
        start++;
    }
    return ['z', ...bvs];
}

const buildMatrix = (variables, restrictions) => {
    const matrix = [];
    const BVS = buildBVS(variables.length, restrictions.length);
    const rows = restrictions.length + 1;

    const z = buildZ(variables, rows);
    matrix.push(z);
    const slack = buildSlack(restrictions);
    
    matrix.push(...slack);

    const header = []
    header.push(...variables.map((variable) => Object.keys(variable)[0]));
    header.push(...BVS.slice(1));

    return {BVS, matrix, header};
}

const findPivot = (z) => {
    const min = Math.min(...z);
    const index = z.indexOf(min);
    return index;
}

const simplexProcess = (matrix, BVS, header) => {
    while (matrix[0].some(value => value < 0)) {
        const pivot = findPivot(matrix[0]);
        const pivotRow = findPivotRow(matrix, pivot);
        BVS[pivotRow.index] = header[pivot];
        const pivotValue = matrix[pivotRow.index][pivot];
        console.log(pivotValue);
        console.log('Before iteration', matrix);
        matrix = iteration(matrix, pivotRow.index, pivot, pivotValue);
    }
    return matrix;
}

const findPivotRow = (matrix, pivot) => {
    const ratios = matrix.slice(1).map((row, key) => {
        const value = row[row.length - 1];
        const pivotValue = row[pivot];

        if (pivotValue <= 0) {
            return {index: key+1, value: Infinity}
        }
        return {index: key+1, value: value/pivotValue}
    })
    const pivotRow = ratios.reduce((prev, current) => {
        return prev.value < current.value ? prev : current;
    })
    return pivotRow;
}

const iteration = (matrix, pivotRow, pivotCol, pivotValue) =>{   
    if (pivotValue != 1){
        matrix = rowMult(matrix, pivotRow, 1/pivotValue);
    }
    
    for (let i = 0; i < matrix.length; i++) {
        if (i !== pivotRow && matrix[i][pivotCol] !== 0) {
            matrix = rowAddition(matrix, pivotRow, i, -matrix[i][pivotCol]);
            console.log(matrix);
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

export default Simplex
import Store from "./store";

const Simplex = () => {
    // access the simplex reducer
    const {variables, restrictions} = Store.getState().simplex;

    // create a matrix with the simplex data and BVS
    const {BVS, matrix, header} = buildMatrix(variables, restrictions);
    

    console.log(BVS, matrix);

    simplexProcess(matrix, BVS, header);

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

const buildSlack = (restrictions) => {
    const slack = restrictions.map((restriction, key) => {
        const values = Object.keys(restriction)
            .filter(key => key !== 'comp' && key !== 'res')
            .map(key => Number(restriction[key]))
        const zeros = new Array(restrictions.length).fill(0);
        zeros[key] = 1;
        return [...values, ...zeros, Number(restriction['res'])]
        
    })    
    return slack;
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
        //const pivotColumn = matrix.map(row => row[pivot]);
        const ratios = matrix.slice(1).map((row, key) => {
            const value = row[row.length - 1];
            const pivotValue = row[pivot];

            if (pivotValue <= 0) {
                return {index: key+1, value: Infinity}
            }
            return {index: key+1, value: value/pivotValue}
        })

        // get the lowest ratio
        const pivotRow = ratios.reduce((prev, current) => {
            return prev.value < current.value ? prev : current;
        })
        
        BVS[pivotRow.index] = header[pivot];
        
        const pivotValue = matrix[pivotRow.index][pivot];
        console.log(pivotValue);
        console.log(matrix);
        matrix = rowMult(matrix, pivotRow.index, 1/pivotValue);
        console.log(matrix);
        break;
    }
}

// function to multiply a row of a matrix by a constant
const rowMult = (matrix, rowIndex, k) => {
    return matrix.map((row, i) => {
        return row.map((n, j) => {
            return i === rowIndex ? n * k : n;
        })
    })
}


const matMult = (matrix, row, k) => {
    return matrix.map((m, i) => {
        return m.map((n, j) => {
            return n + row[i] * k;
        })
    })
}

export default Simplex
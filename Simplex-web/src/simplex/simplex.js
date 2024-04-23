import Store from "../store";
import { resetTable, setHeader } from '../reducers/tableReducer';
import { showMatrix, showResults, buildZ, simplexProcess, buildMatrix, getOtherVariablesCount } from "./utils";
import { buildBigMZ, simplexBigM } from "./simplexBigM";
import { buildTwoPhaseZ, simplexTwoPhases } from "./simplexTwoPhases";

const Simplex = () => {
    // access the simplex reducer
    Store.dispatch(resetTable())
    const {variables, restrictions } = Store.getState().simplex;
    const {target, method} = Store.getState().config;

    const {slackCount, artificialCount} = getOtherVariablesCount(restrictions);
    
    let processedMatrix = [];
    let Z = []
    
    let arrays = {
        matrix: [],
        BVS: [],
        header: []
    }

    if (method === 'simplex') {
        Z = buildZ(variables, (slackCount + artificialCount + 1), target);
        arrays = buildMatrix(variables, restrictions, Z);
        processedMatrix= simplexProcess(arrays.matrix, arrays.BVS, arrays.header);        
    }
    else if (method === 'big-m') {
        Z = buildBigMZ(variables, slackCount, artificialCount);
        arrays = buildMatrix(variables, restrictions, Z);
        processedMatrix = simplexBigM(arrays.matrix, arrays.BVS, arrays.header, artificialCount);
    }
    else if (method === 'two-phase') {
        Z = buildTwoPhaseZ(variables, slackCount, artificialCount, target);
        arrays = buildMatrix(variables, restrictions, target, Z);
        processedMatrix = simplexTwoPhases(arrays.matrix, arrays.BVS, arrays.header, artificialCount);
    }
    else {
        console.log('Invalid method');
    }
    
    
    if (target === 'min'){
        processedMatrix[0][processedMatrix.length - 1] = processedMatrix[0][processedMatrix.length - 1] * -1;
    }
    
    Store.dispatch(setHeader(arrays.header));

    console.log('Processed matrix');
    console.table(processedMatrix);
    console.log(arrays.BVS);
    console.log(arrays.header);

    showMatrix(processedMatrix.matrix, arrays.BVS, arrays.header);
    showResults(processedMatrix.matrix, arrays.BVS);
}



export default Simplex
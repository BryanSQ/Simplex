import Store from "./store";
import { setMatrix, setHeader, setBVS } from './reducers/tableReducer';
import { iteration, findPivotRow, showMatrix, showResults, findPivot, buildRestrictions, getOtherVariablesCount, buildBVS, buildZ, simplexProcess } from "./utils";

const Simplex = () => {
    // access the simplex reducer
    const {variables, restrictions } = Store.getState().simplex;
    const {target} = Store.getState().config;

    const {matrix, BVS, header} = buildMatrix(variables, restrictions, target);
    const processedMatrix = simplexProcess(matrix, BVS, header);
    
    if (target === 'min'){
        processedMatrix[0][processedMatrix.length - 1] = processedMatrix[0][processedMatrix.length - 1] * -1;

    }
    
    Store.dispatch(setHeader(header));

    showMatrix(processedMatrix, BVS, header);
    showResults(processedMatrix, BVS);
    console.log(processedMatrix);
}

const buildMatrix = (variables, restrictions, target) => {
    const matrix = [];
    const { slackCount, artificialCount } = getOtherVariablesCount(restrictions);
    const BVS = buildBVS(variables.length, { slackCount, artificialCount });
    const rows = slackCount + artificialCount + 1; 
    const z = buildZ(variables, rows, target);
    
    matrix.push(z);
    const restrictionMatrix = buildRestrictions(restrictions);
    
    matrix.push(...restrictionMatrix);

    const header = []
    header.push(...variables.map((variable) => Object.keys(variable)[0]));
    header.push(...BVS.slice(1));

    return {matrix, BVS, header};
}

export default Simplex
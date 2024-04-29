import Store from "../store";
import { resetTable, setHeader } from '../reducers/tableReducer';
import { buildW, simplexTwoPhases } from "./simplexTwoPhases";
import { simplexBigM } from "./simplexBigM";
import { 
    showMatrix, showResults, buildZ, simplexProcess,
    getOtherVariablesCount, buildHeader, buildBVS, buildRestrictions 
} from "./utils";

const Simplex = () => {
    // access the simplex reducer
    Store.dispatch(resetTable())
    const {variables, restrictions } = Store.getState().simplex;
    const {target, method} = Store.getState().config;

    const counts = getOtherVariablesCount(restrictions);
    
    let simplexResults = {};
    const header = buildHeader(variables, counts);
    const Z = buildZ(variables, counts, target, method);
    const restrictionMatrix = buildRestrictions(restrictions);
    const BVS = buildBVS(header, restrictionMatrix, variables.length, method);
    const matrix = [Z, ...restrictionMatrix];

    if (method === 'simplex') {
        simplexResults = simplexProcess(matrix, BVS, header);        
    }
    else if (method === 'big-m') {
        simplexResults = simplexBigM(matrix, BVS, header, counts.artificialCount);
    }
    else if (method === 'two-phase') {
        const matrixW = [buildW(variables, counts), ...matrix];        
        simplexResults = simplexTwoPhases(matrixW, BVS, header, counts.artificialCount);
    }
    else {
        console.log('Invalid method');
    }
    
    if (target === 'min'){
        const length = simplexResults.matrix[0].length;
        simplexResults.matrix[0][length - 1] = simplexResults.matrix[0][length - 1] * -1;
    }
    
    Store.dispatch(setHeader(header));
    showMatrix(simplexResults.matrix, simplexResults.BVS, header);
    showResults(simplexResults.matrix, simplexResults.BVS);
}



export default Simplex
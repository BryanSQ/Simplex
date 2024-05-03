import Store from "../store";
import { setNotification } from "../reducers/notificationReducer";
import { resetTable, setHeader, setResults } from '../reducers/tableReducer';
import { buildW, simplexTwoPhases } from "./simplexTwoPhases";
import { simplexBigM } from "./simplexBigM";
import { 
    showMatrix, showResults, buildZ, simplexProcess,
    getOtherVariablesCount, buildHeader, buildBVS,
    buildRestrictions, addUnrestrictedVariables, solveEquation
} from "./utils";

const Simplex = () => {
    // access the simplex reducer
    Store.dispatch(resetTable())
    const {variables, restrictions, unrestricted } = Store.getState().simplex;    
    const {target, method} = Store.getState().config;    
    const counts = getOtherVariablesCount(restrictions);
    
    let simplexResults = {};
    const header = buildHeader(variables, counts);
    const Z = buildZ(variables, counts, target, method);
    const restrictionMatrix = buildRestrictions(restrictions);
    const BVS = buildBVS(header, restrictionMatrix, variables.length, method);
    const matrix = [Z, ...restrictionMatrix];

    addUnrestrictedVariables(matrix, header, variables, unrestricted);

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
        Store.dispatch(setNotification('Método inválido', 5000));
    }
    
    if (target === 'min'){
        const length = simplexResults.matrix[0].length;
        simplexResults.matrix[0][length - 1] = simplexResults.matrix[0][length - 1] * -1;
    }
    
    const r = solveEquation(simplexResults.matrix, simplexResults.BVS);    

    let RHS = simplexResults.matrix.map(row => row[row.length - 1]);

    const changes = changeValues(simplexResults.BVS, r, RHS);
    
    if (changes){
        RHS = changes.RHS;
        simplexResults.BVS = changes.BVS;
    }

    const extendedHeader = ['i', 'BVS', ...header, "RHS"];

    Store.dispatch(setHeader(extendedHeader));
    Store.dispatch(setResults({BVS: simplexResults.BVS, RHS}));

    
    showMatrix(simplexResults.matrix, simplexResults.BVS, header);
    showResults(simplexResults.matrix, simplexResults.BVS);
}

const changeValues = (BVS, results, RHS) => {
    if (!results.length){
        return null;
    }

    const newBVS = BVS.map((item) => {
        return item.replace('p', '').replace('p', '');
    });

    for (let r of results){
        const index = newBVS.indexOf(r[0]);
        if (index !== -1){
            RHS[index] = r[1];
        }
        
    }

    return { BVS: newBVS, RHS };
}

export default Simplex
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
    console.log('variables', variables.length);
    console.log('restrictions', restrictions.length);
    if (isValidInput(variables) || isValidInput(restrictions)){
        Store.dispatch(setNotification('No se han ingresado variables o restricciones', 5000));
        return;
    }
    
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
        const matrixW = [buildW(variables, counts, unrestricted), ...matrix];
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
    const { sortedBVS, sortedRHS } = sortResults({BVS: simplexResults.BVS, RHS});
    Store.dispatch(setResults({BVS: sortedBVS, RHS: sortedRHS}));

    
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

const sortResults = (results) => {
    const { BVS, RHS } = results;
    
    const newResults = BVS.map((item, index) => {
        return {[item]: RHS[index]};
    });

    newResults.sort((a, b) => {
        const aKey = Object.keys(a)[0];
        const bKey = Object.keys(b)[0];

     
        if (aKey === 'z') return -1;
        if (bKey === 'z') return 1;

      
        const aNumber = parseInt(aKey.replace(/\D/g, ''), 10);
        const bNumber = parseInt(bKey.replace(/\D/g, ''), 10);
       
        return aNumber - bNumber;
    });

    const sortedBVS = [];
    const sortedRHS = [];
    newResults.forEach((item) => {
        const key = Object.keys(item)[0];
        sortedBVS.push(key);
        sortedRHS.push(item[key]);
    });

    return { sortedBVS, sortedRHS };
}

const isValidInput = (v) => {
    const values = Object.values(v);
    return values.every(value => value === '');
}
    



export default Simplex
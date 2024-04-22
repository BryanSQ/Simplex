import { iteration, findPivotRow, showMatrix, showResults, findPivot, buildRestrictions, getOtherVariablesCount, buildBVS, buildZ } from "./utils";


const buildTwoPhaseZ = (variables, slackCount, artificialCount) => {
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

    const z = buildZ(variables, (slackCount + artificialCount + 1));
    
    begin.push(w);
    begin.push(z);

    return begin;
    
}

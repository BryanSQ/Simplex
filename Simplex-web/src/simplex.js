function resuelva(M) {
    var n = M.length;

    for (var f = 0; f < n - 1; f++) {
        for (var i = f + 1; i < n; i++) {
            var v = multFilaK(M[f], -M[i][f]);
            M[i] = sume(M, v, i, -M[i][f]);
        }
    }
    
    for (var f = n - 1; f >= 0; f--) {
        for (var i = f - 1; i >= 0; i--) {
            var v = multFilaK(M[f], M[i][f]);
            M[i] = sume(M, v, i, -M[i][f]);
        }
    }
    
    for (var i = 0; i < n; i++) {
        M[i] = multFilaK(M[i], 1 / M[i][i]);
    }

    var valores = [];
    for (var i = 0; i < n; i++) {
        valores.push(M[i][n]);
    }
    return valores;
}

function sume(M, v, j, k) {
    var Mprime = [];
    for (var i = 0; i < M.length; i++) {
        var row = [];
        for (var j = 0; j < M[i].length; j++) {
            row.push(v[j] + k * M[j]);
        }
        Mprime.push(row);
    }
    return Mprime;
}

function multFilaK(fila, k) {
    var result = [];
    for (var i = 0; i < fila.length; i++) {
        result.push(fila[i] * k);
    }
    return result;
}

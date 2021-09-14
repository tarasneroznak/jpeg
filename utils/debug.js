export function printMatrix(name, matrix, correct = []) {
    console.log('\n');
    console.log(`${name}: `);
    matrix.forEach((i, _i) => {
        let toLog = i.map(j => j.toString().padEnd(5)).join('');
        if (correct[_i]) {
            toLog += '    |    ' + correct[_i].map(j => j.toString().padEnd(5)).join('');
        }

        console.log(toLog);
    })
    console.log('\n');
}

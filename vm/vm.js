let fs = require('fs');
let readlineSync = require('readline-sync');
let inFileName = process.argv[2];

if (fs.existsSync(inFileName)) {
    let inFile = fs.readFileSync(inFileName, "utf8");

    let memory = [];
    //регистры
    memory[0] = 2; //ip
    memory[1] = 0; //cf

    // переводим массив
    let s = inFile.split('\r\n');
    for (let i of s) {
        memory = memory.concat(i.split(' '));
    }
    memory = memory.concat('exit');
    // удаляем пробелы
    let i = 0;
    while (i < memory.length) {
        if (memory[i] === '') {
            memory.splice(i, 1);
        } else {
            i++;
        }
    }

    while (memory[memory[0]] !== 'exit') {
        if (memory[memory[0]].charAt(0) === '.') {
            memory[0]+=1;
        }
        switch (memory[memory[0]]) {
                case 'input':
                    let inp = readlineSync.question('Input: ');
                    if (Number.isInteger(Number(inp))) {
                        memory[memory[memory[0] + 1]] = Number(inp);
                        memory[0] += 2;
                    }
                    else {
                        console.log('Допустимы только целые числа');
                        process.exit();
                    }
                    break;
                case 'set':
                    if (isNaN(Number(memory[memory[0] + 1]))){
                        console.log(`Ожидалось число: set ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    else if (isNaN(Number(memory[memory[0] + 2]))){
                        memory[memory[memory[0] + 1]] = memory[memory[0] + 2];
                    }
                    else {
                        memory[memory[memory[0] + 1]] = Number(memory[memory[0] + 2]);
                    }
                    memory[0] += 3;
                    break;
                case 'output':
                    if (isNaN(Number(memory[memory[0] + 1]))){
                        console.log(`Ожидалось число: output ${memory[memory[0] + 1]}`);
                        process.exit();
                    }
                    console.log(memory[memory[memory[0] + 1]]);
                    memory[0] += 2;
                    break;
                case 'add':
                    if (isNaN(Number(memory[memory[0] + 1])) || isNaN(Number(memory[memory[0] + 2])) || isNaN(Number(memory[memory[0] + 3]))){
                        console.log(`Ожидалось число: add ${memory[memory[0] + 1]} ${memory[memory[0] + 2]} ${memory[memory[0] + 3]}`);
                        process.exit();
                    }
                    else if (isNaN(Number(memory[memory[memory[0] + 1]])) || isNaN(Number(memory[memory[memory[0] + 2]]))) {
                        console.log(`В регистре не число: add ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    memory[memory[memory[0] + 3]] = memory[memory[memory[0] + 1]] + memory[memory[memory[0] + 2]];
                    memory[0] += 4;
                    break;
                case 'sub':
                    if (isNaN(Number(memory[memory[0] + 1])) || isNaN(Number(memory[memory[0] + 2])) || isNaN(Number(memory[memory[0] + 3]))){
                        console.log(`Ожидалось число: sub ${memory[memory[0] + 1]} ${memory[memory[0] + 2]} ${memory[memory[0] + 3]}`);
                        process.exit();
                    }
                    else if (isNaN(Number(memory[memory[memory[0] + 1]])) || isNaN(Number(memory[memory[memory[0] + 2]]))) {
                        console.log(`В регистре не число: sub ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    memory[memory[memory[0] + 3]] = memory[memory[memory[0] + 1]] - memory[memory[memory[0] + 2]];
                    memory[0] += 4;
                    break;
                case 'mul':
                    if (isNaN(Number(memory[memory[0] + 1])) || isNaN(Number(memory[memory[0] + 2])) || isNaN(Number(memory[memory[0] + 3]))){
                        console.log(`Ожидалось число: mul ${memory[memory[0] + 1]} ${memory[memory[0] + 2]} ${memory[memory[0] + 3]}`);
                        process.exit();
                    }
                    else if (isNaN(Number(memory[memory[memory[0] + 1]])) || isNaN(Number(memory[memory[memory[0] + 2]]))) {
                        console.log(`В регистре не число: mul ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    memory[memory[memory[0] + 3]] = memory[memory[memory[0] + 1]] * memory[memory[memory[0] + 2]];
                    memory[0] += 4;
                    break;
                case 'div':
                    if (isNaN(Number(memory[memory[0] + 1])) || isNaN(Number(memory[memory[0] + 2])) || isNaN(Number(memory[memory[0] + 3]))){
                        console.log(`Ожидалось число: div ${memory[memory[0] + 1]} ${memory[memory[0] + 2]} ${memory[memory[0] + 3]}`);
                        process.exit();
                    }
                    else if (isNaN(Number(memory[memory[memory[0] + 1]])) || isNaN(Number(memory[memory[memory[0] + 2]]))) {
                        console.log(`В регистре не число: div ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    memory[memory[memory[0] + 3]] = Math.floor(memory[memory[memory[0] + 1]] / memory[memory[memory[0] + 2]]);
                    memory[0] += 4;
                    break;
                case 'mov':
                    if (isNaN(Number(memory[memory[0] + 1])) || isNaN(Number(memory[memory[0] + 2]))){
                        console.log(`Ожидалось число: mov ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    memory[memory[memory[0] + 1]] = memory[memory[memory[0] + 2]];
                    memory[0] += 3;
                    break;
                case 'compare':
                    if (isNaN(Number(memory[memory[0] + 1])) || isNaN(Number(memory[memory[0] + 2]))){
                        console.log(`Ожидалось число: compare ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    else if (isNaN(Number(memory[memory[memory[0] + 1]])) || isNaN(Number(memory[memory[memory[0] + 2]]))) {
                        console.log(`В регистре не число: compare ${memory[memory[0] + 1]} ${memory[memory[0] + 2]}`);
                        process.exit();
                    }
                    if (memory[memory[memory[0] + 1]] === memory[memory[memory[0] + 2]]) {
                        memory[1] = 0;
                    } else if (memory[memory[memory[0] + 1]] > memory[memory[memory[0] + 2]]) {
                        memory[1] = 1;
                    } else {
                        memory[1] = 2;
                    }
                    memory[0] += 3;
                    break;
                case 'je':
                    if (memory[1] === 0) {
                        if (memory.indexOf("." + memory[memory[0] + 1]) === -1) {
                            console.log(`Не удалось найти метку ${"." + memory[memory[0] + 1]}`);
                            process.exit();
                        }
                        memory[0] = memory.indexOf("." + memory[memory[0] + 1]) + 1;
                    } else {
                        memory[0] += 2;
                    }
                    break;
                case 'ja':
                    if (memory[1] === 1) {
                        if (memory.indexOf("." + memory[memory[0] + 1]) === -1) {
                            console.log(`Не удалось найти метку ${"." + memory[memory[0] + 1]}`);
                            process.exit();
                        }
                        memory[0] = memory.indexOf("." + memory[memory[0] + 1]) + 1;
                    } else {
                        memory[0] += 2;
                    }
                    break;
                case 'jb':
                    if (memory[1] === 2) {
                        if (memory.indexOf("." + memory[memory[0] + 1]) === -1) {
                            console.log(`Не удалось найти метку ${"." + memory[memory[0] + 1]}`);
                            process.exit();
                        }
                        memory[0] = memory.indexOf("." + memory[memory[0] + 1]) + 1;
                    } else {
                        memory[0] += 2;
                    }
                    break;
                case 'goto':
                    if (memory.indexOf("." + memory[memory[0] + 1]) === -1) {
                        console.log(`Не удалось найти метку ${"." + memory[memory[0] + 1]}`);
                        process.exit();
                    }
                    memory[0] = memory.indexOf("." + memory[memory[0] + 1]) + 1;
                    break;
                default:
                    console.log(`Нераспознанная команда: ${memory[memory[0]]}`);
                    process.exit();
            }
    }
}
else {
    console.log('Нет такого файла');
}

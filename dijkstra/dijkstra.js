// node dijkstra.js [file name]

const fs = require('fs');
let inFileName = process.argv[2];

if (fs.existsSync(inFileName)) {
    let inFile = fs.readFileSync(inFileName, "utf8");
    let str = Dijkstra(inFile);
    let outStr = '';
    for (let s of str) {
        outStr+=s+' ';
    }
    console.log(outStr);
    if ( Count(str) === -1 ) {
        console.log('Неверное выражение');
    }
    else {
        console.log(Count(str));
    }
}
else {
    console.log('Такого файла не существует.');
}

function Dijkstra(input) {
    input = input.split(' ').join('');
    let stack = [];
    let resStr = [];
    const priorities = {
        '+': 0,
        '-': 0,
        '*': 1,
        '/': 1,
        '^': 2
    };

    let regex1 = new RegExp('[0-9.]');
    let regex2 = new RegExp('[()\\-+\\*/\\^]');
    let i = 0;
    while (i !== input.length) {

        if (input[i].search(regex1) !== -1) {
            let num = input[i];
            if (i < input.length-1) {
                i++;
                while (i !== input.length && input[i].search(regex1) !== -1) {
                    num+=input[i];
                    i++;
                }
                i--;
            }
            resStr.push(num);
            num = '';

        }
        else if (input[i] === '(' && input[i+1] === '-') {
            i+=2;
            let num = '-';
            while (input[i] !== ')') {
                num+=input[i];
                i++;
            }
            resStr.push(num);
        }
        else if (input[i].search(regex2) !== -1) {
            if (input[i] === '(') {
                stack.push(input[i]);
            }
            else if (input[i] === ')') {
                let k = stack.length-1;
                while (stack[k] !== '(') {
                    resStr.push(stack[k]);
                    stack.splice(k,1);
                    k--;
                }
                stack.splice(k,1);
            }
            else if (stack[stack.length-1] === '(' ){
                stack.push(input[i]);
            }
            else if (stack.length !== 0 && priorities[input[i]] <= priorities[stack[stack.length-1]]){
                let temp = stack.pop();
                stack.push(input[i]);
                resStr.push(temp);
            }
            else {
                stack.push(input[i]);
            }
        }
        i++;

    }
    while (stack.length !== 0) {
        resStr.push(stack.pop());
    }
    return resStr;
}

function Count(input) {
    let stack = [];

    let i = 0;
    while (i < input.length) {
        if (!isNaN(input[i])) {
            stack.push(Number(input[i]));
        }
        else {
            let temp;
            switch (input[i]) {
                case '+':
                    temp = Number(stack[stack.length-2])+Number(stack[stack.length-1]);
                    stack.splice(stack.length-2,2,temp);
                    break;
                case '-':
                    temp = Number(stack[stack.length-2])-Number(stack[stack.length-1]);
                    stack.splice(stack.length-2,2,temp);
                    break;
                case '*':
                    temp = Number(stack[stack.length-2])*Number(stack[stack.length-1]);
                    stack.splice(stack.length-2,2,temp);
                    break;
                case '/':
                    temp = Number(stack[stack.length-2])/Number(stack[stack.length-1]);
                    stack.splice(stack.length-2,2,temp);
                    break;
                case '^':
                    temp = Math.pow(Number(stack[stack.length-2]),Number(stack[stack.length-1]));
                    stack.splice(stack.length-2,2,temp);
                    break;
            }
        }
        i++;
    }
    if (stack.length !== 1) {
        return -1;
    }
    return stack.pop();
}
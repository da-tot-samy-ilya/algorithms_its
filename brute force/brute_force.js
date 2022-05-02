"use strict";

const fs = require('fs');

let flag = '';
let stringFile = '';
let substringFile = '';

let keyC = false;
let keyN = false;
let keyT = false;

let N = 0;

let k = 2;
while(process.argv[k] !== 'b' && process.argv[k] !== 'h1' && process.argv[k] !== 'h2' && process.argv[k] !== 'h3') {
    if(process.argv[k] === '-c') {
        keyC = true;
        k++;
    }
    else if(process.argv[k] === '-t') {
        keyT = true;
        k++;
    }
    else {
        keyN = true;
        N = process.argv[k+1];
        k+=2;
    }
}
flag = process.argv[k];
stringFile = process.argv[k+1];
substringFile = process.argv[k+2];

function bruteForce(text, pattern) {
    let i = 0;
    const lengthOfText = text.length;
    const lengthOfPattern = pattern.length;
    let arrOfEntry = [0];
    while(i<=lengthOfText-lengthOfPattern+1) {
        let substr = text[i] + text[i + 1] + text[i + 2];
        let flag = compare(substr, pattern);
        if (flag)
            arrOfEntry.push(i);
        i++;
    }
    return arrOfEntry;
}

function compare(text, pattern) {
    let j = 0;
    const lengthOfPattern = pattern.length;
    while(text[j] === pattern[j]) {
        j++;
        if(j === lengthOfPattern) {
            return true;
        }
    }
    return false;
}

function hashSumOfCodes(text, pattern) {
    const lengthOfText = text.length;
    const lengthOfPattern = pattern.length;
    let hashP = 0;
    for (let i = 0; i < lengthOfPattern; ++i)
        hashP += pattern.charCodeAt(i);
    let hashSubstr = 0;
    for (let i = 0; i < lengthOfPattern; ++i)
        hashSubstr += text.charCodeAt(i);
    let arrOfEntry = [0];
    for (let i = 0; i < lengthOfText - lengthOfPattern + 1; ++i) {
        let substr = "";
        for(let j = 0; j < lengthOfPattern; ++j) {
            substr+=text[i+j];
        }
        if (hashSubstr === hashP) {
            let flag = compare(substr, pattern);
            if (flag)
                arrOfEntry.push(i);
            else
                arrOfEntry[0] += 1
        }
        hashSubstr = hashSubstr - text.charCodeAt(i) + text.charCodeAt(i + lengthOfPattern);
    }
    return arrOfEntry;
}

function sumOfSquaresOfCodes(text, pattern) {
    const lengthOfText = text.length;
    const lengthOfPattern = pattern.length;
    let hashP = 0;
    for (let i = 0; i < lengthOfPattern; ++i)
        hashP += Math.pow(pattern.charCodeAt(i), 2);
    let hashSubstr = 0;
    for (let i = 0; i < lengthOfPattern; ++i)
        hashSubstr += Math.pow(text.charCodeAt(i), 2);
    let arrOfEntry = [0];
    for (let i = 0; i < lengthOfText - lengthOfPattern + 1; ++i) {
        let substr = "";
        for(let j = 0; j < lengthOfPattern; ++j) {
            substr+=text[i+j];
        }
        if (hashSubstr === hashP) {
            let flag = compare(substr, pattern);
            if (flag) {
                arrOfEntry.push(i);
            }
            else {
                arrOfEntry[0] += 1;
            }

        }
        hashSubstr = hashSubstr - Math.pow(text.charCodeAt(i), 2) + Math.pow(text.charCodeAt(i + lengthOfPattern), 2);
    }
    return arrOfEntry;
}


function RabinKarp(text, pattern) {
    const lengthOfText = text.length;
    const lengthOfPattern = pattern.length;
    let hashP = 0;
    for (let i = 0; i < lengthOfPattern; ++i)
        hashP += pattern.charCodeAt(i)*Math.pow(2, lengthOfPattern-i-1);
    let hashSubstr = 0;
    for (let i = 0; i < lengthOfPattern; ++i) {
        hashSubstr += text.charCodeAt(i)*Math.pow(2, lengthOfPattern-i-1);
    }
    let arrOfEntry = [0];
    for (let i = 0; i < lengthOfText - lengthOfPattern + 1; ++i) {
        let substr = "";
        for(let j = 0; j < lengthOfPattern; ++j) {
            substr+=text[i+j];
        }
        if (hashSubstr === hashP) {
            let flag = compare(substr, pattern);
            if (flag) {
                arrOfEntry.push(i);
            }
            else {
                arrOfEntry[0] += 1;
            }
        }
        hashSubstr = (hashSubstr - text.charCodeAt(i)*Math.pow(2, lengthOfPattern - 1))*2 + text.charCodeAt(i + lengthOfPattern);
    }
    return arrOfEntry;
}

fs.stat(stringFile, function(err, stats) {
    if (err) {
        console.log(err);
    }
    else {
        let str = fs.readFileSync(stringFile, "utf8");
        let subStr = fs.readFileSync(substringFile, "utf8");
        let arrOfEntry;
        if (flag === 'b') {
            arrOfEntry = bruteForce(str, subStr);
        }
        else if (flag === 'h1') {
            arrOfEntry = hashSumOfCodes(str, subStr);
        }
        else if (flag === 'h2') {
            arrOfEntry = sumOfSquaresOfCodes(str, subStr);
        }
        else {
            arrOfEntry = RabinKarp(str, subStr)
        }
        if (keyN) {
            if (N>arrOfEntry.length) {
                N = arrOfEntry.length - 1;
            }
            for(let i = 1; i<=N; ++i) {
                console.log(arrOfEntry[i])
            }

        }
        else {
            for(let i = 1; i<arrOfEntry.length; ++i) {
                console.log(arrOfEntry[i])
            }
        }
        if (keyC) {
            console.log("Number of collisions:", arrOfEntry[0])
        }
        if (keyT) {
            console.log("Algorithm operation time:", process.uptime())
        }
    }
});
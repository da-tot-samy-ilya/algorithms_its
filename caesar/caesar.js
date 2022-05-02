// node caesar.js [code/decode] [input.txt] [output.txt] [k] [ru/en]

let fs = require('fs');
let action = process.argv[2];
let inputFileName = process.argv[3];
let outputFileName = process.argv[4];
const cfRu = {'О': 0.10983, 'Е': 0.08483, 'А': 0.07998, 'И': 0.07367, 'Н': 0.067, 'Т': 0.06318, 'С': 0.05473, 'Р': 0.04746, 'В': 0.04533, 'Л': 0.04343, 'К': 0.03486, 'М': 0.03203, 'Д': 0.02977, 'П': 0.02804, 'У': 0.02615, 'Я': 0.02001, 'Ы': 0.01898, 'Ь': 0.01735, 'Г': 0.01687, 'З': 0.01641, 'Б': 0.01592, 'Ч': 0.0145, 'Й': 0.01208, 'Х': 0.00966, 'Ж': 0.0094, 'Ш': 0.00718, 'Ю': 0.00639, 'Ц': 0.00486, 'Щ': 0.00361, 'Э': 0.00331, 'Ф': 0.00267, 'Ъ': 0.00037, 'Ё': 0.00013}
const cfEn = {'A': 0.0817, 'B': 0.0149, 'C': 0.0278, 'D': 0.0425, 'E': 0.1270, 'F': 0.0223, 'G': 0.0202, 'H': 0.0609, 'I': 0.0697, 'J': 0.0015, 'K': 0.0077, 'L': 0.0403, 'M': 0.0241, 'N': 0.0675, 'O': 0.0751, 'P': 0.0193, 'Q': 0.0010, 'R': 0.0599, 'S': 0.0633, 'T': 0.0906, 'U': 0.0276, 'V': 0.0098, 'W': 0.0236, 'X': 0.0015, 'Y': 0.0197, 'Z': 0.0007};
const ABC = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
let input = '';
if (fs.existsSync(inputFileName) && fs.existsSync(outputFileName)) {
    input = fs.readFileSync(inputFileName, "utf8");
    input = input.toUpperCase();
    const regex = new RegExp('[ \\-.,\\—!]');
    input = input.split('\n').join('');
    input = input.split(regex).join('');
}
else {
    console.log('Такого файла не существует');
    process.exit();
}
const UNICODESTART = 65;
if (action === 'code') {
    let k = Number(process.argv[5]);
    let lang = process.argv[6];
    if (isNaN(k)) {
        console.log('k - не число');
        process.exit();
    }
    let ABCLength = 0;
    if (lang === 'ru') {
        ABCLength = 33;
    }
    else if (lang === 'en') {
        ABCLength = 26;
    }
    else {
        console.log('Некорректно введен язык');
        process.exit();
    }
    k = ((k % ABCLength) + ABCLength) % ABCLength;
    fs.writeFileSync(outputFileName,Code(input, k,lang,ABCLength));
}
else if (action === 'decode') {
    let CF = {};
    let FF = {};
    let lang = process.argv[5];
    if (lang === 'ru') {
        CF = cfRu;
        FF = {'О': 0, 'Е': 0, 'А': 0, 'И': 0, 'Н': 0, 'Т': 0, 'С': 0, 'Р': 0, 'В': 0, 'Л': 0, 'К': 0, 'М': 0, 'Д': 0, 'П': 0, 'У': 0, 'Я': 0, 'Ы': 0, 'Ь': 0, 'Г': 0, 'З': 0, 'Б': 0, 'Ч': 0, 'Й': 0, 'Х': 0, 'Ж': 0, 'Ш': 0, 'Ю': 0, 'Ц': 0, 'Щ': 0, 'Э': 0, 'Ф': 0, 'Ъ': 0, 'Ё': 0};

    }
    else if (lang === 'en') {
        CF = cfEn;
        FF = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0, 'G': 0, 'H': 0, 'I': 0, 'J': 0, 'K': 0, 'L': 0, 'M': 0, 'N': 0, 'O': 0, 'P': 0, 'Q': 0, 'R': 0, 'S': 0, 'T': 0, 'U': 0, 'V': 0, 'W': 0, 'X': 0, 'Y': 0, 'Z': 0};
    }
    else {
        console.log('Неверный язык ru/en');
        process.exit();
    }
    let ABCLength = Object.keys(FF).length;
    for (let i = 0; i < input.length; i++) {
        FF[input[i]]+=1;
    }
    for (let i in FF) {
        FF[i] = FF[i]/input.length;
    }
    let kMin = Infinity;
    let k = 0;
    for (let i = 0; i < ABCLength;i++ ) {
        let kI = Fk(CF,FF,i, lang);
        if (kI < kMin) {
            kMin = kI;
            k = i;
        }
    }
    console.log(k)
    k = (((-k) % ABCLength) + ABCLength) % ABCLength;
    fs.writeFileSync(outputFileName,Code(input, k,lang,ABCLength));
}
else {
    console.log('Неверное действие, возможны code/decode');
}
function Code(strInput, kInput,langInput,ABClengthInput) {
    let output = '';
    for (let i = 0; i < strInput.length; i++) {
        if (langInput === 'ru') {
            output+=ABC[(ABC.indexOf(input[i])+kInput)%ABClengthInput];
        }
        else {
            output+=String.fromCharCode((input.charCodeAt(i)+kInput-UNICODESTART)%ABClengthInput+UNICODESTART);
        }
    }
    return output;
}
function Fk(FkCF, FkFF, FkK, FkLang) {
    let result = 0;
    let FkFFLen = Object.keys(FkFF).length;
    FkK = ((FkK % FkFFLen) + FkFFLen) % FkFFLen;
    for (let i in FkFF) {
        if (FkLang === 'en') {
            result+=Math.pow(FkCF[i]-FkFF[String.fromCharCode((i.charCodeAt(0)+FkK-UNICODESTART)%FkFFLen+UNICODESTART)],2);
        }
        else {
            result+=Math.pow(FkCF[i]-FkFF[ABC[(ABC.indexOf(i)+FkK)%FkFFLen]],2);
        }
    }
    return Math.sqrt(result);
}
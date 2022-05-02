// Ввод команды в консоль: node huffman.js [encode/decode] [входной файл] [файл с таблицей] [выходной файл]

let action = process.argv[2];
let inFileName = process.argv[3];
let tableFileName = process.argv[4];
let outFileName = process.argv[5];

const fs = require('fs');
if (fs.existsSync(inFileName) && fs.existsSync(tableFileName) && fs.existsSync(outFileName)) {
    let inFile = fs.readFileSync(inFileName, "utf8");
    let tableFile = fs.readFileSync(tableFileName, "utf8");
    if (action === 'encode') {
        let symbols = {};
        // подсчет количества символов в строке
        for ( let sym of inFile ) {
            if (sym in symbols) {
                symbols[sym]+=1;
            }
            else {
                symbols[sym] = 1;
            }
        }
        // сортировка по количеству символов по возрастанию
        let symbolsSorted = Object.keys(symbols).sort(function(a,b){
            return symbols[a]-symbols[b];
        });
        let symbolsSortedList = {};
        for (let keys of symbolsSorted) {
            symbolsSortedList[keys] = symbols[keys];
        }
        // массив объектов
        let dots = [];
        let dot = {};
        // добавление в массив объектов начальных вершин и задание им основных свойств
        for (let key in symbolsSortedList) {
            dot = {};
            dot.name = key;
            dot.count = symbolsSortedList[key];
            dot.parent = '';
            dot.used = false;
            dot.binCode = '';
            dots.push(dot);
        }
        // проходимся по каждой вершине, добавляя родителей и устанавливая связи
        for (let i = 0; i+1 < dots.length;i++) {
            if (dots[i].used === false) {
                dots[i].used = true;
                dots[i+1].used = true;
                dots[i].parent = dots[i].name + dots[i+1].name;
                dots[i+1].parent = dots[i].name + dots[i+1].name

                // новая вершина родитель
                dot = {};
                dot.name = dots[i].name + dots[i+1].name;
                dot.count = dots[i].count + dots[i+1].count;
                dot.parent = '';
                dot.used = false;
                dot.binCode = '';
                dots.push(dot);

                //сортировка массива с добавленным элементом (он всегда будет в конце)
                for (let j = 0; j < dots.length;j++) {
                    if (dots[j].count > dots[dots.length-1].count) {
                        // вставляем неотсортированный объект на место первого большего по count объекта
                        dots.splice(j, 0, dots[dots.length-1]);
                        // удаляем последний добавленный объект
                        dots.splice(dots.length-1, 1);

                    }
                    // получаем отсортированный заново список
                }
            }
        }
        // заполняем пустой объект с кодами для каждого символа
        let codes = {}
        for (let key of dots) {
            if (key.name.length === 1) {
                codes[key.name] = '';
            }
        }
        // расставляем 0 или 1 для каждой точки, спускаясь по дереву вниз
        dotsReversed = dots.reverse();
        for (dot of dotsReversed) {
            let i = '0';
            for (let dot1 of dots) {
                if (dot1.parent === dot.name){
                    dot1.binCode = i;
                    i = '1';
                }
            }
        }
        let topDot = dotsReversed[0].name;
        // Проходим по всем точкам с названием длиной 1 символ
        for (let outDot of dots) {
            // для каждой точки поднимаемся по ее родителям и прародителям, собирая все 0 и 1
            dot = outDot;
            if (outDot.name.length === 1) {
                codes[outDot.name] = outDot.binCode;
                let parent = outDot;
                while (parent.name !== topDot) {
                    // ищем родителя этой точки
                    for (let parKey of dots) {
                        if (parKey.name === dot.parent) {
                            parent = parKey;
                        }
                    }
                    codes[outDot.name]+=parent.binCode;
                    dot = parent;
                }
            }
        }

        // не забываем перевернуть коды и записать в table.txt
        let writeCodes = '';
        for (let code in codes) {
            codes[code] = codes[code].split("").reverse().join("");
            writeCodes+=code + " " + codes[code] + '\n';
        }
        writeCodes = writeCodes.split('');
        writeCodes.splice(writeCodes.length-1,1);
        writeCodes = writeCodes.join('');
        fs.writeFileSync(tableFileName, writeCodes);

        // кодирование
        let writeCode = '';
        for (let s of inFile) {
            writeCode+=codes[s];
        }
        fs.writeFileSync(outFileName, writeCode);
        console.log(`Содержимое файла ${inFileName} успешно зашифровано в файл ${outFileName} с использованием таблицы кодов, записанной в ${tableFileName}.`);
    }
    else if (action === 'decode') {
        // заполняем объект с кодами из таблицы
        let codes = {};
        let itemSplit = ['',''];
        let tableFileSplit = tableFile.split('\n');
        for (let item of tableFileSplit) {
            itemSplit = item.split(' ');
            if (itemSplit.length > 2) {
                codes[' '] = itemSplit[itemSplit.length-1];
            }
            else {
                codes[itemSplit[0]] = itemSplit[itemSplit.length-1];
            }

        }
        // декодирование
        let outFile = fs.readFileSync(inFileName, "utf8");
        let count = 0;
        // специальный массив с кодами без ключей
        codesNoKeys = [];

        for (let code in codes) {
            codesNoKeys.push(codes[code]);
        }
        let writeDecode = '';

        let success = true;
        while (count < outFile.length) {
            let subStr = outFile[count];
            while (codesNoKeys.indexOf(subStr) === -1) {
                count+=1;
                if (count >= outFile.length) {
                    success = false;
                    break;
                }
                subStr+=outFile[count];
            }
            for (let key in codes) {
                if (codes[key] === subStr) {
                    writeDecode+=key;
                }
            }
            count+=1;
        }
        fs.writeFileSync(outFileName, writeDecode);
        if (success) {
            console.log(`Содержимое файла ${inFileName} успешно расшифровано в файл ${outFileName} с использованием таблицы кодов из ${tableFileName}.`);
        }
        else {
            console.log(`Не удалось успешно расшифровать файл ${inFileName} с использованием ${tableFileName}, то что удалось декодировать, передано в ${outFileName}.`);
        }
    }
    else {
        console.log('Неверно введена команда, возможны только варианты encode или decode.');
    }
}
else {
    console.log('В директории нет одного из указанных файлов');
}
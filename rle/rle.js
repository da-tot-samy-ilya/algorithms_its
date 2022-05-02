// Ввод команды в консоль: node rle.js [encode/decode] [escape/jump] [входной файл] [выходной файл]

let action = process.argv[2];
let method = process.argv[3]; 
let inFileName = process.argv[4];
let outFileName = process.argv[5];
const fs = require('fs');

if (fs.existsSync(inFileName) && fs.existsSync(outFileName)) {
	let inFile = fs.readFileSync(inFileName, "utf8");
	let result = "";
	let i = 0;
	if (method == 'escape') {
		const escSym = "#";
		if (action == 'encode') {
			while (i < inFile.length) {
		        let k = 1;
		        while (k <= 255 && inFile.charAt(i) == inFile.charAt(i+k)) {
		            k++;
		        }

		        if ( (k > 3) || (inFile.charAt(i) == escSym) ) { 
		            result += escSym + String.fromCharCode(k) + inFile.charAt(i);   
		        }
		        else {
	                for (let u = 0; u < k; u++) {
	                    result += inFile.charAt(i); 
	                }
		        }
		        i += k;
			}	
			fs.writeFileSync(outFileName, result);
			console.log('Содержимое файла ' + inFileName + ' успешно зашифровано в файл ' + outFileName + ' по методу ' + method + '.');
		}
		else if (action == 'decode') {
			while (i < inFile.length) {
		        if (inFile.charAt(i) == escSym) {
	                let m = 0;               
	                while (m < inFile.charCodeAt(i + 1)) {
	                    result += inFile.charAt(i + 2);
	                    m++;
	                }
	                i += 3; 
		        }
		        else {
	                result += inFile.charAt(i);
	                i++;
		        }
			}
			fs.writeFileSync(outFileName, result);
			console.log('Содержимое файла ' + inFileName + ' успешно расшифровано в файл ' + outFileName + ' по методу ' + method + '.');
		}
		else {
			console.log('Неверно введена операция (возможны только encode или decode)');
		}
	}
	else if (method == 'jump') {
		if (action == 'encode') {
			while (i < inFile.length) {
		        let k = 1;
		        while (inFile.charAt(i) == inFile.charAt(i + k) && (k < 127) ) {
		        	k++;
		        }
		        if (k > 1) {
	                result += String.fromCharCode(k) + inFile.charAt(i);    
	                i += k;
		        }
		        else {
	                let u = 0;
	                while (inFile.charAt(i + u) != inFile.charAt(i + u + 1)) {       
	                        u++;
	                }
	                result += String.fromCharCode(u + 127);            
	                for (let m = 0; m < u; m++) {
	                    result += inFile.charAt(i + m);                   
	                }
	                i += u;
		        }
			}
			fs.writeFileSync(outFileName, result);
			console.log('Содержимое файла ' + inFileName + ' успешно зашифровано в файл ' + outFileName + ' по методу ' + method + '.');
		}
		else if (action == 'decode') {
			let n = 0;
			let m = 0;
			while (n < inFile.length) {
		        if (inFile.charCodeAt(n) <= 127) {                   
	                while (m < inFile.charCodeAt(n)) {
	                    result += inFile.charAt(n + 1); 
	                    m++;
	                }
	                n += 2;
		        }
		        else {
	                for (let c = 0; c < inFile.charCodeAt(n) - 127; c++) {
	                	result += inFile.charAt(n + c + 1);
	                }        
	                n += 1 + inFile.charCodeAt(n) - 127;
		        }
		        m = 0;
			}
			fs.writeFileSync(outFileName, result);
			console.log('Содержимое файла ' + inFileName + ' успешно расшифровано в файл ' + outFileName + ' по методу ' + method + '.');
		}
		else {
			console.log('Неверно введена операция (возможны только encode или decode)');
		}
	}
	else {
		console.log('Неверно введен способ кодирования (возможны только escape или jump)');
	}
}
else {
	console.log('В директории нет одного из указанных файлов');
}

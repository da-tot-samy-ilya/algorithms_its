const fs = require('fs');
let inFile = fs.readFileSync('a.txt', "utf8");
inFile = inFile.split('\n');
let commands = [];
for (i of inFile) {
    k = i.split(' ');
    commands.push(k);
}
console.log(commands);

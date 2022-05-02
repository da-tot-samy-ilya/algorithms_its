let n = Number(process.argv[2]);
n = ;
if (isNaN(n)) {
    console.log('0 11111111 10000000000000000000000');
}
else {
    let indexOfStart = 1;
    let num = Math.abs(n);
    let p;
    // нахождение p
    if ( num >= 1 ) {
        for (p = 1; num/2 >= 1; p++) {
            num = num/2;
        }
        p-=1;
    }
    else if (num === 0) {
        indexOfStart = 0;
        p = -127;
    }
    else {
        for(p=-1; num * 2 < 1; p--) {
            num = num*2;
        }
        indexOfStart = indexOfStart - p + 1;
    }
    p = p + 127;
    // знак
    if (n >= 0) {
        sign = '0';
    }
    else {
        sign = '1';
        indexOfStart++;
    }
    // условие денормализованности
    let denormFlag = false;
    if (p < 1) {
        denormFlag = true;
        p = 0;
    }
    p = p.toString(2);
    while (p.length<8) {
        p = '0'+p;
    }

    if (Math.abs(n) > (2-2**(-23))*2**127) {
        console.log(sign, '11111111', '00000000000000000000000');
        process.exit();
    }
    n = n.toString(2);

    if (denormFlag === true) {
        indexOfStart = 128;
    }
    // вычисление мантиссы
    let mantissa = n.slice(indexOfStart);
    let indexOfPoint = mantissa.indexOf('.');
    if(indexOfPoint !== -1) {
        mantissa = mantissa.slice(0, indexOfPoint) + mantissa.slice(indexOfPoint+1);
    }
    // округление
    if (mantissa[23] === '1') {
        sub_mant = mantissa.slice(24);
        if (mantissa[22] === '1') {
            mantissa = mantissa.slice(0, 23);
            mantissa = Number(parseInt(mantissa, 2)) + 1;
            mantissa = mantissa.toString(2);
            if (mantissa.length !== 23) {
                mantissa = mantissa.slice(1);
            }
        }
        else if (sub_mant.indexOf('1') !== -1) {
            mantissa = mantissa.slice(0, 23);
            mantissa = Number(parseInt(mantissa, 2)) + 1;
            mantissa = mantissa.toString(2);
            while (mantissa.length < 23) {
                mantissa = '0'+mantissa;
            }
            if (mantissa.length > 23) {
                mantissa = mantissa.slice(1);
            }

        }
    }
    mantissa = mantissa.slice(0,23);
    while (mantissa.length<23) {
        mantissa += '0';
    }
    console.log(sign, p, mantissa);
    if(n === 0) {
        console.log('1', p, mantissa);
    }
}




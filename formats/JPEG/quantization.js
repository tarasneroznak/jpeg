import { ZigZagIndex } from './zigzag.js';

// Y QUANTIZATION MATRIX
const YQM = [
    16, 11, 10, 16, 24, 40, 51, 61,
    12, 12, 14, 19, 26, 58, 60, 55,
    14, 13, 16, 24, 40, 57, 69, 56,
    14, 17, 22, 29, 51, 87, 80, 62,
    18, 22, 37, 56, 68, 109, 103, 77,
    24, 35, 55, 64, 81, 104, 113, 92,
    49, 64, 78, 87, 103, 121, 120, 101,
    72, 92, 95, 98, 112, 100, 103, 99
];

// CbCr QUANTIZATION MATRIX
const CbCrQM = [
    17, 18, 24, 47, 99, 99, 99, 99,
    18, 21, 26, 66, 99, 99, 99, 99,
    24, 26, 56, 99, 99, 99, 99, 99,
    47, 66, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99,
    99, 99, 99, 99, 99, 99, 99, 99
];

// SCALING FACTOR AAN for IDCT
const AASF = [1.0, 1.387039845, 1.306562965, 1.175875602, 1.0, 0.785694958, 0.541196100, 0.275899379];
const AASFC = AASF.reduce((acc, r) => [...acc, AASF.map(c => r * c * 8)], []);

export function quantization(compress) {
    if (compress <= 0) compress = 1;
    if (compress > 100) compress = 100;
    if (compress < 50) compress = Math.floor(5000 / compress);
    else compress = Math.floor(200 - compress * 2);

    const YT = new Array(64);
    const CbCrT = new Array(64);
    const YQT = new Array(64);
    const CbCrQT = new Array(64);

    for (let i = 0; i < 64; i++) {
        const Y = Math.floor((YQM[i] * compress + 50) * 0.01);
        const CbCr = Math.floor((CbCrQM[i] * compress + 50) * 0.01);

        const k = ZigZagIndex(i);
        
        YT[k] = Y < 1 ? 1 : Y > 255 ? 255 : Y;
        CbCrT[k] = CbCr < 1 ? 1 : CbCr > 255 ? 255 : CbCr;
    }

    let k = 0;
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const i = ZigZagIndex(k);

            YQT[k] = 1 / (YT[i] * AASFC[row][col]);
            CbCrQT[k] = 1 / (CbCrT[i] * AASFC[row][col]);

            k++;
        }
    }

    return {
        YQM,
        CbCrQM,
        YQT,
        CbCrQT
    };
}

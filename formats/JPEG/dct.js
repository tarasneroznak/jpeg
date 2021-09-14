// https://link.springer.com/content/pdf/10.1155/2009/485817.pdf

function fDCT(block, QT) {
    // libjpeg

    // Rows
    let offset = 0;
    for (let i = 0; i < 8; ++i) {
        let d0 = block[offset];
        let d1 = block[offset + 1];
        let d2 = block[offset + 2];
        let d3 = block[offset + 3];
        let d4 = block[offset + 4];
        let d5 = block[offset + 5];
        let d6 = block[offset + 6];
        let d7 = block[offset + 7];

        let tmp0 = d0 + d7;
        let tmp7 = d0 - d7;
        let tmp1 = d1 + d6;
        let tmp6 = d1 - d6;
        let tmp2 = d2 + d5;
        let tmp5 = d2 - d5;
        let tmp3 = d3 + d4;
        let tmp4 = d3 - d4;

        let tmp10 = tmp0 + tmp3;
        let tmp13 = tmp0 - tmp3;
        let tmp11 = tmp1 + tmp2;
        let tmp12 = tmp1 - tmp2;

        block[offset] = tmp10 + tmp11;
        block[offset + 4] = tmp10 - tmp11;

        let z1 = (tmp12 + tmp13) * 0.707106781; 
        block[offset + 2] = tmp13 + z1;
        block[offset + 6] = tmp13 - z1;

        tmp10 = tmp4 + tmp5; 
        tmp11 = tmp5 + tmp6;
        tmp12 = tmp6 + tmp7;

        let z5 = (tmp10 - tmp12) * 0.382683433;
        let z2 = 0.541196100 * tmp10 + z5;
        let z4 = 1.306562965 * tmp12 + z5; 
        let z3 = tmp11 * 0.707106781;

        let z11 = tmp7 + z3;	
        let z13 = tmp7 - z3;

        block[offset + 5] = z13 + z2;	
        block[offset + 3] = z13 - z2;
        block[offset + 1] = z11 + z4;
        block[offset + 7] = z11 - z4;

        offset += 8; 
    }

    // Columns
    offset = 0;
    for (let i = 0; i < 8; ++i) {
        let d0 = block[offset];
        let d1 = block[offset + 8];
        let d2 = block[offset + 16];
        let d3 = block[offset + 24];
        let d4 = block[offset + 32];
        let d5 = block[offset + 40];
        let d6 = block[offset + 48];
        let d7 = block[offset + 56];

        let tmp0p2 = d0 + d7;
        let tmp7p2 = d0 - d7;
        let tmp1p2 = d1 + d6;
        let tmp6p2 = d1 - d6;
        let tmp2p2 = d2 + d5;
        let tmp5p2 = d2 - d5;
        let tmp3p2 = d3 + d4;
        let tmp4p2 = d3 - d4;

        let tmp10p2 = tmp0p2 + tmp3p2;
        let tmp13p2 = tmp0p2 - tmp3p2;
        let tmp11p2 = tmp1p2 + tmp2p2;
        let tmp12p2 = tmp1p2 - tmp2p2;

        block[offset] = tmp10p2 + tmp11p2;
        block[offset + 32] = tmp10p2 - tmp11p2;

        let z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; 
        block[offset + 16] = tmp13p2 + z1p2; 
        block[offset + 48] = tmp13p2 - z1p2;

        tmp10p2 = tmp4p2 + tmp5p2;
        tmp11p2 = tmp5p2 + tmp6p2;
        tmp12p2 = tmp6p2 + tmp7p2;

        let z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; 
        let z2p2 = 0.541196100 * tmp10p2 + z5p2; 
        let z4p2 = 1.306562965 * tmp12p2 + z5p2;
        let z3p2 = tmp11p2 * 0.707106781; 

        let z11p2 = tmp7p2 + z3p2;
        let z13p2 = tmp7p2 - z3p2;

        block[offset + 40] = z13p2 + z2p2;
        block[offset + 24] = z13p2 - z2p2;
        block[offset + 8] = z11p2 + z4p2;
        block[offset + 56] = z11p2 - z4p2;

        offset++; 
    }

    // Quantization 
    const fDCTBlock = new Array(64);
    for (let i = 0; i < 64; ++i) {
        const cooef = block[i] * QT[i];

        if (cooef > 0) {
            fDCTBlock[i] = (cooef + 0.5) | 0;
        } else {
            fDCTBlock[i] = (cooef - 0.5) | 0;
        }
    }

    return fDCTBlock;
}

const C_ZERO = 1 / Math.sqrt(2);
const C = (z) => z == 0 ? C_ZERO : 1;

function _fDCT(quant) {
    for (let u = 0; u < 8; u++) {
        for (let v = 0; v < 8; v++) {
            let sum = 0;

            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    sum +=
                        quant[x][y] *
                        Math.cos(((2.0 * x + 1) * u * Math.PI) / 16.0) *
                        Math.cos(((2.0 * y + 1) * v * Math.PI) / 16.0);
                }
            }

            quant[u][v] = Math.round(0.25 * C(u) * C(v) * sum);
        }
    }

    return quant;
}

export function DCT(blocks, quantization) {
    const { YQT, CbCrQT } = quantization;

    for (let i = 0; i < blocks.length; i++) {
        const [Y, Cr, Cb] = blocks[i];

        const DCTY = fDCT(Y, YQT);
        const DCTCr = fDCT(Cr, CbCrQT);
        const DCTCb = fDCT(Cb, CbCrQT);

        blocks[i] = [DCTY, DCTCr, DCTCb];
    }

    return blocks;
}
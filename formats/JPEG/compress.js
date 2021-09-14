import { ZigZag } from './zigzag.js'

export function compress(blocks, huffman) {
    const { YDC_HT, CbCrDC_HT, YAC_HT, CbCrAC_HT, BITCODE_HT, CATEGORY_HT } = huffman;

    let bytes = [];
    let pDCY = 0;
    let pDCCr = 0;
    let pDCCb = 0;

    for (let i = 0; i < blocks.length; i++) {
        const [Y, Cr, Cb] = blocks[i];

        const CY = RLE(Y, pDCY, YDC_HT, YAC_HT, BITCODE_HT, CATEGORY_HT);
        const CCr =  RLE(Cr, pDCCr, CbCrDC_HT, CbCrAC_HT, BITCODE_HT, CATEGORY_HT);
        const CCb = RLE(Cb, pDCCb, CbCrDC_HT, CbCrAC_HT, BITCODE_HT, CATEGORY_HT);

        pDCY = CY.pDC;
        pDCCr = CCr.pDC;
        pDCCb = CCb.pDC;

        bytes.push(...CY.compressed);
        bytes.push(...CCr.compressed);
        bytes.push(...CCb.compressed);
    }

    return bytes;
}

function RLE(block, pDC, DC_HT, AC_HT, BITCODE_HT, CATEGORY_HT) {
    const compressed = [];
    const data = ZigZag(block);
    const DC = data[0];

    const EOB = AC_HT[0x00];
    const M16zeroes = AC_HT[0xF0];
    const diff = DC - pDC;
    const categoryShift = 32767;

    let p = 0;

    // DC
    if (diff == 0) {
        compressed.push(DC_HT[0]);
    } else {
        p = categoryShift + diff;
        compressed.push(DC_HT[CATEGORY_HT[p]]);
        compressed.push(BITCODE_HT[p]);
    }

    // AC RLE
    let endP = 63;
    while (endP && data[endP] == 0) {
        endP--;
    }

    if (endP == 0) {
        compressed.push(EOB);
        return { pDC: DC, compressed };
    }

    let i = 1;
    let length;
    while (i <= endP) {
        let startP = i;

        while (data[i] == 0 && i <= endP) {
            i++;
        }

        let zero = i - startP;

        if (zero >= 16) {
            length = zero >> 4;
            for (let nrmarker = 1; nrmarker <= length; ++nrmarker) {
                compressed.push(M16zeroes);
            }
            zero = zero & 0xF;
        }

        p = categoryShift + data[i];

        compressed.push(AC_HT[(zero << 4) + CATEGORY_HT[p]]);
        compressed.push(BITCODE_HT[p]);

        i++;
    }

    if (endP != 63) {
        compressed.push(EOB);
    }

    return { pDC: DC, compressed };
}
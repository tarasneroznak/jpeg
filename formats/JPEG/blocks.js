import { RGBtoYCbCr } from './ycbcr.js'

export function blocks(data, width, height) {
    const quantsWidth = width * 4;
    const quantsHeight = height;

    const offsetX = 32;
    const offsetY = 8;

    let y = 0;
    let x = 0;

    const blocks = [];

while (y < quantsHeight) {
    x = 0;

    while (x < quantsWidth) {
        let row = 0;
        let col = -1;
        let startFrom = quantsWidth * y + x;
        let p = startFrom;

        const YB = new Array(64);
        const CbB = new Array(64);
        const CrB = new Array(64);

        for (let pos = 0; pos < 64; pos++) {
            row = parseInt(pos / 8);
            col = parseInt(pos % 8);
            row = pos >> 3;
            col = (pos & 7) * 4;

            p = startFrom + (row * quantsWidth) + col;

            if (y + row >= quantsHeight) p -= (quantsWidth * (y + 1 + row - quantsHeight));
            if (x + col >= quantsWidth) p -= ((x + col) - quantsWidth + 4);

            const { Y, Cb, Cr } = RGBtoYCbCr(data[p++], data[p++], data[p++]);

            YB[pos] = Y;
            CbB[pos] = Cb;
            CrB[pos] = Cr;
        }

        blocks.push([YB, CbB, CrB]);

        x += offsetX;
    }

    y += offsetY;
}

    return blocks;
}

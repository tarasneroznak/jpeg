import { huffman } from './huffman.js';
import { quantization } from './quantization.js';
import { blocks } from './blocks.js';
import { DCT } from './dct.js';
import { compress } from './compress.js';
import { file } from './file.js';

function encode(data, options) {
    const bytes = data;
    const c = options.c || 50;
    const width = options.width || 500;
    const height = options.height || 500;
    
    const H = huffman();
    const Q = quantization(c);
    const B = blocks(bytes, width, height);
    const DCTB = DCT(B, Q);
    const C = compress(DCTB, H);
    const JPEG = file();

    JPEG.marker(0xFFD8);
    JPEG.APP0();
    JPEG.APP1();
    JPEG.DQT(Q);
    JPEG.SOF0(width, height);    
    JPEG.DHT(H);
    JPEG.SOS();
    JPEG.bytes(C);
    JPEG.marker(0xFFD9);

    return JPEG.getBuffer();
}

export default {
    encode
}

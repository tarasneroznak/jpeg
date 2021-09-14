import { getMIME, saveImage } from '../utils/fs.js';

import _png from './PNG/index.js';
import _jpeg from './JPEG/index.js';

const ENCODERS = {
    '.png': _png,
    '.jpeg': _jpeg
}

const ENCODERS_MAP = {
    '.png': '.jpeg'
}

export async function Transform(path, options) {
    const inputType = getMIME(path);
    const outputType = '.jpeg';
    const outputPath = options.output;

    if (ENCODERS_MAP[inputType] !== outputType) {
        throw new Error(`[Has't formats decoders] Input file (${inputType}) has't have encoder to ${outputType}`);
    }

    const decoded = await ENCODERS[inputType].decode(path);
    const encoded = await ENCODERS[outputType].encode(decoded.data, { ...options, ...decoded.metadata });
    
    saveImage(new URL(outputPath || `../result${outputType}`, import.meta.url), encoded);
}
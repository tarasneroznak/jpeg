import fs from 'fs';
import path from 'path';

function getMIME(p) {
    return path.extname(p);
}

function checkImage(path) {
    return fs.existsSync(path);
}

function saveImage(path, data) {
    return fs.writeFileSync(path, data);
}

function readImage(path) {
    return fs.readFileSync(path);
}

export {
    getMIME,
    checkImage,
    saveImage,
    readImage
}
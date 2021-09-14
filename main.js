import { checkImage } from "./utils/fs.js"
import { Transform } from "./formats/index.js"

const cmArgs = process.argv.slice(2);

const args = {};
const validators = {
    '-f': (value) => {
        if (typeof value === 'string' && checkImage(value)) {
            return { file: value };
        }

        throw new Error(`[NotValid] File is not passed`)
    },
    '-c': (value) => {
        if (typeof +value === 'number' && !isNaN(+value)) {
            return { c: +value };
        }

        throw new Error(`[NotValid] Compress quality is not a number`)
    },
}


try {
    for (let i = 0; i < cmArgs.length; i += 2) {
        const key = cmArgs[i];
        const value = cmArgs[i + 1];
    
        if (typeof validators[key] === 'function') {
            Object.assign(args, validators[key](value));
        }
    }

    await Transform(args.file, args);
} catch (e) {
    console.log(e);
    console.log(`Error - ${e.message}`);
}

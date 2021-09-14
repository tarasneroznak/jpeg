import { Transform } from '../formats/index.js';

(async function () {
    // 1mb
    let s = Date.now();
    await Transform('./tests/images/test.png', { c: 80, output: '../tests/results/result_1.jpeg' });
    console.log(`1mb - ${Date.now() - s}`);

    // 3mb
    s = Date.now();
    await Transform('./tests/images/test_3mb.png', { c: 80, output: '../tests/results/result_2.jpeg' });
    console.log(`3mb - ${Date.now() - s}`);

    // 10mb
    s = Date.now();
    await Transform('./tests/images/test_10mb.png', { c: 80, output: '../tests/results/result_3.jpeg' });
    console.log(`10mb - ${Date.now() - s}`);
})()
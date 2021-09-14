import Jimp from 'jimp';

// 1mb
Jimp.read('./tests/images/test.png', (err, lenna) => {
    if (err) throw err;

    let s = Date.now();

    lenna
        .quality(80)
        .write('./tests/results/result_jimp_1.jpg');

    console.log(`1mb - ${Date.now() - s}`);
});

// 3mb
Jimp.read('./tests/images/test_3mb.png', (err, lenna) => {
    if (err) throw err;

    let s = Date.now();

    lenna
        .quality(80)
        .write('./tests/results/result_jimp_2.jpg');

    console.log(`3mb - ${Date.now() - s}`);
});

// 10mb
Jimp.read('./tests/images/test_10mb.png', (err, lenna) => {
    if (err) throw err;

    let s = Date.now();

    lenna
        .quality(80)
        .write('./tests/results/result_jimp_3.jpg');

    console.log(`10mb - ${Date.now() - s}`);
});


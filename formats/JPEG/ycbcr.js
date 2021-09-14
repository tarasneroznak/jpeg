const RGB_YUV_TABLE = new Array(2048);

export function RGBtoYCbCr(R, G, B) {
    return RGBtoYUV(R, G, B);

    const Y = parseInt(0.299 * R + 0.587 * G + 0.114 * B);
    const Cb = parseInt(0.1687 * R - 0.3313 * G + 0.5 * B);
    const Cr = parseInt(0.5 * R - 0.4187 * G + 0.0813 * B);

    return { Y, Cb, Cr }
}

export function RGBtoYUV(r, g, b) {
    const Y = ((RGB_YUV_TABLE[r] + RGB_YUV_TABLE[(g + 256) >> 0] + RGB_YUV_TABLE[(b + 512) >> 0]) >> 16) - 128;
    const Cb = ((RGB_YUV_TABLE[(r + 768) >> 0] + RGB_YUV_TABLE[(g + 1024) >> 0] + RGB_YUV_TABLE[(b + 1280) >> 0]) >> 16) - 128;
    const Cr = ((RGB_YUV_TABLE[(r + 1280) >> 0] + RGB_YUV_TABLE[(g + 1536) >> 0] + RGB_YUV_TABLE[(b + 1792) >> 0]) >> 16) - 128;

    return { Y, Cb, Cr }
}

(function initRGBYUVTable() {
    for (let i = 0; i < 256; i++) {
        RGB_YUV_TABLE[i] = 19595 * i;
        RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
        RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
        RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
        RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
        RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807FFF;
        RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
        RGB_YUV_TABLE[(i + 1792) >> 0] = - 5329 * i;
    }

    return RGB_YUV_TABLE;
})()

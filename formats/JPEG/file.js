export function file() {
    const image = [];
    
    let bytenew = 0;
    let bytepos = 7;

    function getBuffer() {
        return Buffer.from(image);
    }

    function marker(value) {
        byte((value >> 8) & 0xFF);
        byte((value) & 0xFF);
    }

    function byte(value) {
        image.push(value);
    }

    function bytes(data) {
        for (let i = 0; i < data.length; i++) bits(data[i]);
    }

    function bits(bs) {
        let value = bs[0];
        let posval = bs[1] - 1;

        while (posval >= 0) {
            if (value & (1 << posval)) {
                bytenew |= (1 << bytepos);
            }

            posval--;
            bytepos--;

            if (bytepos < 0) {
                if (bytenew == 0xFF) {
                    byte(0xFF);
                    byte(0);
                }
                else {
                    byte(bytenew);
                }
                bytepos = 7;
                bytenew = 0;
            }
        }
    }

    function APP0() {
        marker(0xFFE0);
        marker(16);
        marker(0x4A);
        marker(0x46);
        marker(0x49);
        marker(0x46);
        marker(0);
        marker(1);
        marker(1);
        marker(0);
        marker(1);
        marker(1);
        marker(0);
        marker(0);
    }

    function APP1(exifBuffer) {
        if (!exifBuffer) {
            return;
        }

        marker(0xFFE1);

        if (exifBuffer[0] === 0x45 &&
            exifBuffer[1] === 0x78 &&
            exifBuffer[2] === 0x69 &&
            exifBuffer[3] === 0x66) {
            marker(exifBuffer.length + 2);
        } else {
            marker(exifBuffer.length + 5 + 2);
            byte(0x45);
            byte(0x78);
            byte(0x69);
            byte(0x66);
            byte(0);
        }

        for (var i = 0; i < exifBuffer.length; i++) {
            byte(exifBuffer[i]);
        }
    }

    function SOF0(width, height) {
        marker(0xFFC0);
        marker(17);
        byte(8);
        marker(height);
        marker(width);
        byte(3);
        byte(1);
        byte(0x11);
        byte(0);
        byte(2);
        byte(0x11);
        byte(1);
        byte(3);
        byte(0x11);
        byte(1);
    }

    function DQT({ YQM, CbCrQM }) {
        marker(0xFFDB);
        marker(132);
        byte(0);
        for (let i = 0; i < 64; i++) byte(YQM[i]);
        byte(1);
        for (let i = 0; i < 64; i++) byte(CbCrQM[i]);
    }

    function DHT({
        DC_LUMINANCE_CODES,
        DC_LUMINANCE_VALUES,
        AC_LUMINANCE_CODES,
        AC_LUMINANCE_VALUES,
        DC_CHOMINANCE_CODES,
        DC_CHOMINANCE_VALUES,
        AC_CHOMINANCE_CODES,
        AC_CHOMINANCE_VALUES
    }) {
        marker(0xFFC4);
        marker(0x01A2);
        byte(0);
        for (let i = 0; i < 16; i++) byte(DC_LUMINANCE_CODES[i + 1]);
        for (let i = 0; i <= 11; i++) byte(DC_LUMINANCE_VALUES[i]);
        byte(0x10);
        for (let i = 0; i < 16; i++) byte(AC_LUMINANCE_CODES[i + 1]);
        for (let i = 0; i <= 161; i++)  byte(AC_LUMINANCE_VALUES[i]);
        byte(1);
        for (let i = 0; i < 16; i++) byte(DC_CHOMINANCE_CODES[i + 1]);
        for (let i = 0; i <= 11; i++) byte(DC_CHOMINANCE_VALUES[i]);
        byte(0x11);
        for (let i = 0; i < 16; i++) byte(AC_CHOMINANCE_CODES[i + 1]);
        for (let i = 0; i <= 161; i++) byte(AC_CHOMINANCE_VALUES[i]);
    }

    function SOS() {
        marker(0xFFDA);
        marker(12);
        byte(3);
        byte(1);
        byte(0);
        byte(2);
        byte(0x11);
        byte(3);
        byte(0x11);
        byte(0);
        byte(0x3f);
        byte(0);
    }

    return {
        getBuffer,
        marker,
        bytes,
        bits,
        APP0,
        APP1,
        DQT,
        SOF0,
        DHT,
        SOS,
    }
};

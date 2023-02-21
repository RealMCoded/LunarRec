const fs = require("fs")

async function setPFP(uid, req){
    var bufferHeader=0;

    fs.unlinkSync(`./profileImages/${uid}.png`)

    var f=fs.createWriteStream(`./profileImages/${uid}.png`);

    req.on('data', (chunk) => {
        // We only want to remove the header data one time
        if (bufferHeader == 0) {
            const slicedBuffer = Buffer.alloc(chunk.length - 141);
            chunk.copy(slicedBuffer, 0, 141);
            f.write(slicedBuffer)
            bufferHeader=1;
        } else {
            f.write(chunk)
        }
    });

    req.on('end', () => {
        f.end();
        return;
    });
}

module.exports = { setPFP }
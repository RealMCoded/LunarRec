const fs = require("fs")
const { randomString } = require("../util.js");

async function setPFP(uid, req){
    var bufferHeader=0;

    fs.unlinkSync(`./cdn/profileImages/${uid}.png`)

    var f=fs.createWriteStream(`./cdn/profileImages/${uid}.png`);

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

async function uploadImg(transient, uid, req){
    var bufferHeader=0;
    //var img_name = transient ? `TRANSIENT_${uid}` : randomstring.generate(10)
    var img_name = "IMG_" + randomString(15)

    var f=fs.createWriteStream(`./cdn/images/${img_name}.png`);

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
    });

    return JSON.stringify({ImageName: `${img_name}.png`});
}

async function deleteImg(req) {
    try {
        fs.unlinkSync(`./cdn/images/${req.body.ImageName}`)
    } catch(e) {
        console.log(e)
    }
}

module.exports = { setPFP, uploadImg, deleteImg }
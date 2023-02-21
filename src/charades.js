const fs = require("fs")

function generateCharades(){
    let charadesJSON = new Array()

    const allFileContents = fs.readFileSync('./shared-items/charades.txt', 'utf-8');
    allFileContents.split(/\r?\n/).forEach(line =>  {
        if (!line.startsWith("//")) {
            charadesJSON.push({
                "EN_US":line,
                "Difficulty":0
            })
        }
    });
    
    return JSON.stringify(charadesJSON);
}

module.exports = { generateCharades }
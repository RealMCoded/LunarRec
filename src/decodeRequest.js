async function decodeRequest(req){
    let data = new Promise(function(resolve) {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                //const data = JSON.parse(body);
                resolve(body)
            } catch (er) {
                console.log(er.message)
                return 0;
            }
        });
    })
    return data;
}

module.exports = { decodeRequest }
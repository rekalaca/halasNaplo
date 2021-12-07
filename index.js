const http = require('http');
const fs = require('fs');
const port = 4444;

const server = http.createServer((req, res) => {

    switch (true) {
        case req.url === '/' && req.method === 'GET':
            fs.readFile('./view/index.html', (err, data) => {
                res.setHeader('content-type', 'text/html');
                res.writeHeader(200);
                res.end(data);

            });
            break;

        case req.url === '/fish.css' && req.method === 'GET':
            fs.readFile('./view/fish.css', (err, data) => {
                res.setHeader('content-type', 'text/css');
                res.writeHeader(200);
                res.end(data);

            });
            break;

        case req.url === "/halak" && req.method === "GET":
            fs.readFile('./data/halak.json', (err, data) => {
                res.setHeader('Content-Type', 'application/json');
                res.writeHeader(200);
                res.end(data);
            })
            break;

        case req.url === "/halak.js" && req.method === "GET":
            fs.readFile('./public/halak.js', (err, data) => {
                res.setHeader('Content-Type', 'application/javascript');
                res.writeHeader(200);
                res.end(data);
            })
            break;

        case req.url === "/halak" && req.method === "POST":
            let tartalom ='';
            req.on('data', (chunk) =>{
                tartalom += chunk.toString();
            });

            req.on('end', () => {
                const ujFogas = JSON.parse(tartalom);
                

                if( ! validateHalNev(ujFogas.fajta)){
                    console.log("Túl rövid a neve...")
                    return;
                }


                if( ! validateTomeg(ujFogas.tomeg) ){
                    console.log("Csak az 1 kg felettiek számítanak!")
                    return;
                }               
                

                fs.readFile("./data/halak.json", (err, data) => {
                    let halaim = JSON.parse(data);
                    halaim.push({
                        fajta: sanitizeString(ujFogas.fajta),
                        tomeg: ujFogas.tomeg,
                        datum:sanitizeString(ujFogas.datum)
                    });
                    fs.writeFile('./data/halak.json',JSON.stringify(halaim), () =>{
                        res.end(JSON.stringify(ujFogas));
                    })
                })
            });
            break;


            default:
                fs.readFile("./view/error.html", (err, file) => {
                    res.setHeader('Content-Type', 'text/html');
                    res.writeHead(404);
                    res.end(file);
                })
    }
});

server.listen(port);

function validateTomeg(tomeg){
    return tomeg > 999;
}

function validateHalNev(fajta){
    return fajta.length >= 4;
}
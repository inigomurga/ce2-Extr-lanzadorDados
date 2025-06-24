const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/history',
    method: 'GET'
};

const req = http.request(options, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
                console.log("Test API /history: OK");
                process.exit(0);
            } else {
                console.error("Test API /history: FAIL (no es un array)");
                process.exit(1);
            }
        } catch (e) {
            console.error("Test API /history: FAIL (respuesta no es JSON)");
            process.exit(1);
        }
    });
});

req.on('error', err => {
    console.error("Test API /history: FAIL (no se pudo conectar)");
    process.exit(1);
});

req.end();

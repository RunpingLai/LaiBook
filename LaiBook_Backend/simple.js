// In Class Exercise 15

const http = require('http');

const host = '127.0.0.1';
const port = process.env.PORT || 3333;

http.createServer(preprocess).listen(port, host);
console.log(`Server running at http://${host}:${port}`);

function preprocess(req, res) {
    let body = '';
    req.on('data', function(chunk) {
        body += chunk
    });
    req.on('end', function() {
        req.body = body;
        server(req, res)
    })
}

function server(req, res) {
    console.log('Request method        :', req.method);
    console.log('Request URL           :', req.url);
    console.log('Request content-type  :', req.headers['content-type']);
    console.log('Request payload       :', req.body);

    let articles = [{ id: 1, author: 'Mack', body: 'Post 1' },
        { id: 2, author: 'Jack', body: 'Post 2' },
        { id: 3, author: 'Zack', body: 'Post 3' }];
    let payload;


    // GET requests
    if ((req.method === 'GET') && (req.url === '/')) {
        payload = { hello: 'world' };
    }
    else if ((req.method === 'GET') && (req.url === '/articles')) {
        payload = { articles: articles };
        // TODO: set payload
    }
    // POST requests
    else if ((req.method === 'POST') && (req.url === '/login')) {
        let body = JSON.parse(req.body);
        payload = { username: body.username, result: "success" };
        // TODO: set payload
    }
    // TODO: PUT requests
    else if ((req.method === 'PUT') && (req.url === '/logout')) {
        payload = "OK";
    }

    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(payload) + '\n')
}
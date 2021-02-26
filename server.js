var http = require('http');
var fs = require('fs');
var cookie = require('cookie');

var hostname = '127.0.0.1';
var port = 3000;

let ppl = new Array(); 

function sendfile(f, response){
  fs.readFile(f, 'utf8', function(error, data){
      if(error){
          console.log(error);
          response.end(error);
      }else{
          console.log(data);
          response.end(data);
      }
  });
}

var server = http.createServer(function (req, res) {
  /* try {
    console.log(cookie.parse(req.headers.cookie))
  } catch {
    random = Math.floor(Math.random()*10000000);
    while (ppl.includes(random)) {
      random = Math.floor(Math.random()*10000000);
    }
    res.setHeader('Set-Cookie', cookie.serialize('value', random))
    ppl.push(random)
    res.statusCode = 302;
    res.setHeader('location', req.headers.referer || '/');
  } */
    switch (req.url){
      default:
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        sendfile('home.html', res);
        break;

      case '/play':
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        sendfile("html.html", res);
        break;

      case '/play/css':
        res.setHeader('Content-Type', 'text/css');
        sendfile('cs.css', res);
        break;

      case '/play/js':
        res.setHeader('Content-Type', 'text/js');
        sendfile('cod.js', res);
        break;
    }
})

server.listen(port, hostname, () => { //this is what gets printed to the _console_.
  console.log("Server running at http://"+hostname + ":" + port);
});
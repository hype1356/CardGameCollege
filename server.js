var http = require('http');
var fs = require('fs');
var cookie = require('cookie');

var hostname = '127.0.0.1';
var port = 3000;

let ppl = new Array(); 

let allowedpeople = ['bob', 'Matt'];
let scores = {'bob':0, 'Matt':16}
let accdetail = {'bob':'asdf', 'Matt':'Mattsp'}

function sendfile(f, response){
  fs.readFile(f, 'utf8', function(error, data){
      if(error){
          console.log(error);
          response.end(error);
      }else{
          //console.log(data);
          response.end(data);
      }
  });
}

var server = http.createServer(function (req, res) {

  let cookies = req.headers.cookie;
  try {
    cookies = cookies.split('=');
  } catch {
    console.log('no cookie');
  } finally {
    initi: try {
      console.log(cookies);
      if (!(allowedpeople.includes(cookies[1]))) {
        res.statusCode = 302;
        res.setHeader('Location', '/login');
        res.end();
      } else {break initi;}
    } catch {
      res.statusCode = 302;
      res.setHeader('Location', '/login');
      res.end();
    }
  }

  switch (req.url){
    default:
      let cookies = req.headers.cookie;
      res.statusCode = 302;
      try {
        cookies = cookies.split('=');
      } catch {
        console.log('no cookie');
      } finally {
        try {
          console.log(cookies);
          if (allowedpeople.includes(cookies[1])) {
            res.setHeader('Location', '/home');
          } else {
            res.setHeader('Location', '/login');
          }
        } catch {res.setHeader('Location', '/login');}
      }
      res.end();
      break;
    
    case '/home':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      sendfile('home.html', res);
      break;

    case '/login':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      sendfile('login.html', res);
      break;

    case '/login/action':
      req.setEncoding('utf-8');
      req.on('data', chunk => {
        data = chunk.split("&");
        n = data[0].split('=')[1]; 
        p = data[1].split('=')[1];
        console.log(n, p);
        res.statusCode = 302;
        if (allowedpeople.includes(n)) {
          if (accdetail[n] == p) {
            res.setHeader('Set-Cookie', cookie.serialize('player', n));
            res.setHeader('Location', '/home')
          } else {
            res.setHeader('Location', '/login');
          }
        } else {
          res.setHeader('Location', '/login');
        }
        res.end;
      });

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
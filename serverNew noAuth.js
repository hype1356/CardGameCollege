var http = require('http');
var fs = require('fs');
var cookie = require('cookie');

var hostname = '127.0.0.1';
var port = 3000;

let ppl = new Array();

function sortOnKeys(dict) {
  var items = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });  
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  return(items.slice(0, 5));
}

let allowedpeople = ['bob', 'Matt'];
let scores = {};
scores = fs.readFile("score.txt","utf8",function (err, data) {
  if (err) {
    console.log(err);
    return;
  }
  scores = JSON.parse(data);
  console.log(scores);
});

//let scores = { 'bob': 0, 'Matt': 16 }
let accdetail = { 'bob': 'asdf', 'Matt': 'Mattsp' }

function sendfile(f, response) {
  fs.readFile(f, 'utf8', function (error, data) {
    if (error) {
      console.log(error);
      response.end(error);
    } else {
      //console.log(data);
      response.end(data);
    }
  });
}

/*function checkLoggedIn(cookies, res) {
  if (cookies != null) {
    if (allowedpeople.includes(cookies[1])){
      return;
    }
  }
  res.statusCode = 301;
  res.setHeader('Location', '/login');
  res.end;
  //break;
}*/

var server = http.createServer(function (req, res) {
  console.log(req.url);
  let url = req.url;

  let cookies = req.headers.cookie;
  try {cookies = cookies.split('=');} catch {}

  if (cookies == null) {
    console.log("no cookie");
  } else {
    console.log(cookies);
  }

  switch (req.url) {
    default:
      res.setHeader('Location', '/home');
      res.statusCode = 301;
      res.end;

    case '/home':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      sendfile('home.html', res);
      break;

    case '/home/board':
      let sortscore = JSON.stringify(sortOnKeys(scores));
      console.log(sortscore);
      res.end(sortscore);
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
        console.log("a");
        if (allowedpeople.includes(n)) {
          console.log("b");
          if (accdetail[n] == p) {
            console.log("c");
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

    case '/play/in':
      req.setEncoding('utf-8');
      req.on('data', chunk => {
        let dat = [];
        dat = JSON.parse(chunk);
        console.log(dat);
        let name = dat["winner"];
        let number = dat["numofcards"];
        scores[name] = number;
        console.log(scores); 
        fs.writeFile("score.txt", JSON.stringify(scores), "utf8", function(err){if (err) {console.log('could not save')}});
      });
      break;
  }
})

server.listen(port, hostname, () => { //this is what gets printed to the _console_.
  console.log("Server running at http://"+hostname + ":" + port);
});
# movie_api

# movie_api

# movie_api

# movie_api

# movie_api

const http = require("http"),
url = require("url"),
fs = require("fs");
http
.createServer((request, response) => {
//response.writeHead(200, { "Content-Type": "text/plain" });
//response.end("Hello Node!\n");

    let addr = request.url,
      q = new URL(addr, "http://" + request.headers.host),
      filePath = " ";
    fs.appendFile(
      "log.txt",
      "URL: " + addr + "\nTimestamp: " + new Date() + "\n\n",
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to log.");
        }
      }
    );

    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filePath = "index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });

})
.listen(8080);

console.log("My first Node test server is running on Port 8080.");

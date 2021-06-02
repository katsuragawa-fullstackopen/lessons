const { createServer } = require("http"); // import http - CommonJS format

/* create new web server, register an event handler that's called every time
an HTTP request it's made to the server */
const app = createServer((reQuest, response) => {
  // respond with the status code 200, content-type header is set to text/plain
  response.writeHead(200, { "Content-Type": "text/plain" });
  // return hello world
  response.end("Hello World");
});

// bind the http server to app variable
const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
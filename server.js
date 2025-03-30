const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const cnad = require("@bitc/cnad");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname =
  process.env.NODE_ENV !== "production" ? "localhost" : "gofroma2zafrica.com";
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

cnad.config("/home/gofromaz/nodevenv/gofroma2zafrica.com/20");

app.prepare().then(() => {
  cnad.start();
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl).then(() => {});
  }).listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );
});

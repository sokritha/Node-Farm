const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const jsonData = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const objectData = JSON.parse(jsonData);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //Overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = objectData
      .map(el => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{% PRODUCT_CARDS %}", cardsHtml);

    res.end(output);
  }
  //Product page
  else if (pathname === "/product") {
    const product = objectData[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.end(objectData);
  }
  //Not Found
  else {
    res.end("Page not found");
  }
  res.end("Hello, I am server.!!!");
});

server.listen(3000, () => {
  console.log("Listening to req at port 3000");
});

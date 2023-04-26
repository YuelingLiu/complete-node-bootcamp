const fs = require('fs');
const http = require('http');
const url = require('url');
////// File
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOutput = `This is what we know about avocado :${textIn}.\n Created on ${Date.now()}`;

// fs.writeFileSync('./starter/txt/input.txt', textOutput);
// console.log('file written');

// using a callback function

// fs.readFile('./starter/txt/inputttt.txt', 'utf-8', (error, data) => {
//   if (error) {
//     return console.log('Error');
//   }
//   console.log(data);
//   fs.readFile('./starter/txt/start.txt', 'utf-8', (error, data2) => {
//     console.log(data2);
//     fs.writeFile(
//       './starter/final.txt',
//       `${data}\n${data2},`,
//       'utf-8',
//       (err) => {
//         console.log('you file has been writeen ');
//       }
//     );
//   });
// });
// console.log('will read file soon');

///////// Server
// these ares syn, they will be r

const replaceTemplate = (tem, product) => {
  let output = tem.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};
const temOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const temCard = fs.readFileSync(`${__dirname}/templates/cards.html`, 'utf-8');
const temProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);

// this is synchornous .
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
//console.log(dataObj);
//  this is a callback function

// SERVER
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // // console.log(url.parse(req.url, true));

  // const pathname = req.url;

  const { query, pathname } = url.parse(req.url, true);

  console.log('checking query', query);
  console.log('checking pathname', pathname);

  if (pathname === '/' || pathname === '/overview') {
    // WE NEED TO actually need to read the tempalate

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(temCard, el))
      .join('');
    // console.log(cardsHtml);
    const output = temOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);

    //res.end('This is OVERVIEW page');
    // console.log(output);
    res.end(output);
  } else if (pathname === '/product') {
    // loop  through dataOBj array
    // el is to hold the data
    console.log('Checking query in product page ....', query);
    //API
  } else if (pathname === '/api') {
    fs.readFile(
      `${__dirname}/starter/dev-data/data.json`,
      'utf-8',
      (error, data) => {
        const productData = JSON.parse(data);
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
      }
    );

    // res.end('this is API');
    // NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-tyle': 'text/html',
      'my-own-header': 'hello world',
    });
    res.end('<h1> page not found! <h1/>');
  }
});

// use that server
// localhost and port 8000
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to the request on port 8000');
});

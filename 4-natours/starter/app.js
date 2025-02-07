const express = require('express');
const fs = require('fs');
const app = express();

// express.json is a middleware
app.use(express.json());

// this is the root url
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server sise !', app: 'Natours' });
// });
//read the file. top level code
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // we need a middleware
  //   console.log(req.body);
  // figure out the id, bc database takes care of it in general
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

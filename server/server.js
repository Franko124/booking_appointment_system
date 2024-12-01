const express = require('express');
const cors = require('cors');
const connectToDB = require('./connectToDB');
// const ObjectID = require('mongodb').ObjectId;
const routes = require('./routes');
// const path = require('path');

const app = express();
const port = 4000;
// const buildPath = path.join(__dirname, 'build');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// });

// app.use(express.static(buildPath));
app.use(cors());
app.use(express.json());
app.use(routes);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(buildPath, 'index.html'))
// });

app.listen(port , () => {
  connectToDB.connectToServer();
  console.log('server is working on port '+ port);

});
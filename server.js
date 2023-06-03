const express = require('express');
const port = 5005
const app = express()

require('dotenv').config();
const path = require('path')
const cors = require('cors');
app.use(cors());


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Router Connecting

const appRoute = require('./router/Routes');
const pageRoute = require('./router/pageRouters');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const db = require('./model/sequelize');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use("/api/v1", appRoute)

app.use(pageRoute)

app.listen(port, (err) => {
  if (err) {
    console.log("Server is Not run !");
  }
  console.log("Server Is Running in this port:", port);
})

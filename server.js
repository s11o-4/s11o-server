const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();

//Esto importa el objeto json que importaste de tasks en controladores 
const tasks = require('./controllers/tasks');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'pug');

//Esto responde con las funcion home que importe de tasks
app.get('/tasks', tasks.home);

app.listen(3000);
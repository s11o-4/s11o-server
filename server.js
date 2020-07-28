const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const methodOverride = require('method-override');
const session = require('express-session');
const socketio = require('socket.io'); 

 

const app = express();
const tasksRoutes = require('./routes/tasks_routes');
const registrationsRoutes = require('./routes/registrations_routes');
const sessionsRoutes = require('./routes/sessions_routes');
const sessions = require('./controllers/sessions');

//                   MIS MIDDLEWARES
const findUserMiddleware = require('./middlewares/find_user');
const authUser = require('./middlewares/auth_user');


//Esto importa el objeto json que importaste de tasks en controladores 
//const tasks = require('./controllers/tasks');

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method')); // Dentro de methodOverride va la estrategia que quieras utilizar -> en este caso usare la de _method -> que despues implemente en la vista
app.set('view engine', 'pug');

//Esto responde con las funcion home que importe de tasks
//app.get('/tasks', tasks.home);

let sessionConfig = {
    secret:['yosoyunaclavewife9ef4nj853jebgegy8n45u94__cporemfpre','yyoorasnfioreuifref65489-*59+4-/+38'],
    saveUnitialized: false,
    resave: false
 }

if(process.env.NODE_ENV && process.env.NODE_ENV == 'production'){//En process.env se especifica el entorno en el que se esta ejecutando nuestra aplicacion. Si esta variable existe y su valor es igual a production, quiero que haga tal cosa
  sessionConfig['store'] = new (require('connect-pg-simple')(session))(); // Cambia el almacen por conect-pg-simple y para hacerlo necesito ejecutar el paquete y pasarlo arguemnto a session  
}

app.use(session(sessionConfig));


 //                 MONTO MIS MIDDLEWARES
app.use(findUserMiddleware);
app.use(authUser);

app.use(tasksRoutes);
app.use(registrationsRoutes);
app.use(sessionsRoutes);

app.get('/', function(req, res){
 res.render('home', {user: req.user});
})

let server = app.listen(process.env.PORT || 3000);
let io = socketio(server);
let sockets = {};

let usersCount = 0;

io.on('connection',function(socket){//utilizo el metodo conection para conectarme
  
  let userId = socket.request._query.loggeduser;
  if(userId) sockets[userId] = socket;
  console.log(sockets);

 //Actualiza usuarios en tiempo real
  usersCount++;//Cuando halla una nueva conexion se incrementa esta variable
  
//Primero argumento: Identificador del mensaje. Segundo argumento: datos que quiero enviarle al cliente, en este caso un contador de cuantos usuarios hay conectados
  io.emit('count_updated',{count: usersCount});//Estoy mandando un mensaje a todas las sockets con el metodo emit del objeto io 
   
  socket.on('new_task', function(data){//Este metodo indica que cuando reciba un mensaje de una socket que se llame new_task, quiero q ejecute la siguietne funcion la cual recibe como argumento el json que yo halla pasado desde mi midelo 
     if(data.userId){
       let userSocket = sockets[data.userId];
       if(!userSocket) return;
       
       userSocket.emit('new_task', data);//Indica que solo a esa soquet le voy a enviar informacion 
      }
    //console.log(data);
     io.emit('new_task', data); // Se lo estoy mandando a todos mis clientes, indico que hay un nuevo task y le voy a enviar todo lo qe me halla pasado mi funcion 
  })

  socket.on('disconnect', function(){//Cuando se desconecte ejecuta la sig. funcion
    
    Object.keys(sockets).forEach(userId => {
      let s = sockets[userId];
        if(s.id == socket.id) sockets[userId] = null;
    });

    console.log(sockets);

    usersCount--;
    io.emit('count_updated', {count: usersCount});//Este es el mensaje de cuando una socket se conecta y cuando se desconecta 
  })
});

//Importo mi socket una ves que ya se configuro todo lo anteiror
const client = require('./realtime/client');
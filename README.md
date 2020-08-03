# THE_LAST_BACKEND
This is the lastest version of my server functional in Heroku !!. This server has an arquitecture MVC and REST, it's really secure and eficient, includes too a connection with web sockets.
// README THE_LAST_BACKEND PART 3

              Relaciones uno a muchos - El esquema



Una ves que has identificado una relacion de uno a muchos en tu esquema de bases de datos, lo que sigue es modificar la estrcutura,, para que se refleje dicha relacion.

Lo unico que tienes que hacer es agregar una columna a la tabla perteneciente. misma columna que nos diga a que otra entidad pertenece. Osea... una llave foranea


Voy a guardar el id del usuario

El primer paso es crear una nueva migracion:

$ sequelize migration:create --name add_user_id_to_tasks

Para agregar una columna utilizaremos el metodo addColumn() del objeto query interface que estamos recibiendo como arguemnto 


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tasks', 'userId', { // nobre de la tabla, nombre del campo, el tipo de dato del campo que se agregara 
      type: Sequelize.INTEGER,
      references: {
        model: 'User', // -> tu tabla
        key: 'id' // -> la otra 
      }
    })
  },

  TODO ESTO ME RETORNA UNA PROMESA

  $ sequelize db:migrate



           Relaciones uno a muchos - Los modelos


Los ORM SUELEN OFRECER APIS PARA TRABAJAR CON ENTIDADES ENTRE SI
LLAMADOR ASSOCIATE, EL CUAL ES EL SIGUIENTE:

 static associate(models) {
      // define association here
    }

 Una entindad puede tener muichas de estas entidades. muchoas a muchos


para esto, sequelize provee de dos metodos: 

hasMany, belongsTo

le pertenece a muchos y le pertenece a 


En el modelo de la tabla user.js defini esto:

  static associate(models) { // EL OBJETO MODELS HACE REFERENCIA A LOS OTROS OBJETOS DEL PROYECTO
      // define association here
      User.hasMany(models.Task); // un usuario puede tener miuchas tareas
    }

Y en el modelo de la tabla task, defini esto:
   
     static associate(models) {
       Task.belongsTo(models.user);//Esto establece la relacion de uno a mucho con el modelo user.js
    }

 Y con todo esto se define una relacion de uno a muchos !!!!






                        Nombres para asociaciones

 
El nombre del modelo es EXTREMADAMENTE importante al momento de definir asociaciones. Ya que  a partir del nombre se infieren campos de asocacion, los nombres que se agregaran para las asociaciones.



Los objeto que obtengamos a partir del modelo Task, tendrian una propiedad User, con la primera letra en mayuscula, que nos devolveria un objeto  con los datos del usuario al que le pertenece la tarea. 

Por lo que el campo userId en la tabla users, no se buscaria por userId, si no que se buscaria por UserId y aqui hay una gran diferencia y daria error. Una posible solucion seria cambiar el nombre de la tabla de la base de datos. Auqnue esto no es lo mas coreecto

LA MEJOR SOLUCION ES: SOBREESCRIBIR EL NOMBRE DEL MODELO AL MOMENTO DE DEFINIR LA ASOCIACION.

Para  hacer esto, pasas un objeto de configuracion json en la creacion de las asociaciones


por lo que al final en user.js queda asi:


static associate(models) { // EL OBJETO MODELS HACE REFERENCIA A LOS OTROS OBJETOS DEL PROYECTO
      // define association here
      User.hasMany(models.Task, {  // un usuario puede tener miuchas tareas
         as: 'tasks' 
      });
    }
  };


y7 en task.js queda asi :



    static associate(models) {
       Task.belongsTo(models.user, { //Esto establece la relacion de uno a mucho con el modelo user.js
         as: 'user'
       });
    }
  };


Esto es bueno. no solamente para cuando tengas este timpo de prblemas si no que para todo, ya que sequelize te define algunos nombres por defecto

sequelize no puede generar plurales en español


La tabla igual se llama users, asi que tendre que cambiar esto en la migracion

al final quieda asi



     type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users' // -> tu tabla
        },
        key: 'id' // -> la otra 
      }
    })
  },



$ sequelize db:migrate:undo

$ sequelize db:migrate





ES MUY IMPORTANTE EL TEMA DE NOMECLATURAS ASI QUE REPAZALO !!!!!



Guardar relación uno a muchos


LO PONRE EN MARCHA

El codigo de nuestra aplicacion no guarda nada en el campo que apunta a la tabla users



            Eager loading (Cargado anticipado)


Es cuando la consulta a una entidad tambien carga las entidades relacionadas, con ella mism



la clave esta en la palabra include()


Voy a mostrar el correo del user que creo la tarea

Primera forma


Task.findByPk(req.params.id, {
      include: [ // Cada uno de los elementos del arreglo es la informacion que vamos a cargar de manera anticipada
         {
           model: User
         }
      ]


Segunda forma:


  Task.findByPk(req.params.id, {
      include: [ // Cada uno de los elementos del arreglo es la informacion que vamos a cargar de manera anticipada
         {
           model: User, // -> Nombre de la relacion
           as: 'user'
          }
        ]

Hice algunas modificaciones. Pero ahora solamente me muestra pas tareas que el usuario a asignado



ESTO ESTA DE PELOS. AHORA YA SOLO ME VA A MOSTRAR LAS TAREAS DE ESE USUARIO SI CREAS UNO NUEVO, NO TE MOSTRARA NADA







                Tabla asociativa


Ya que estableci la relacion de uno a muchos voy a establecer las relaciones de muchos a muchos.

Una relacion una a muchos con las categorias y una relacion una a muchos con las tareas

Nombre de las tablas asociativas:

TaskCategories / CategoryTasks

$ sequelize model:generate --name TaskCategories --attributes taskId:integer, categoryId:integer

sequelize db:migrate


                  WEBsockets

Voy a implementar websockets a mi proyecto. Las web sockets son un protocolo de la capa 7 dek modelo OSI. Ambas usan el procotolo TCP. Las web socekts tienen comunicacion de dos vias

Node no incluye un paquete para comunicarme con este protocolo. Por lo que usare socket.io

$ npm install socket.io

El protocolo web sockets para iniciar la conexion utiliza el protocolo http

Es a lo que se le llama hyshacke -> un saludo 

let io = socketio(server);

A partir de la variable io es como vas a configurar el protocolo o el funcionamiento de websocket

http://localhost:3000/socket.io/socket.io.js

esto me retorna toda la logica del cliente de socket.io

    script. 

en pug eso es como colocar una etiqueta script en html

      socket = io.connect(nombre/server) 




      Comunicar el servidor Http y el servidor de Websockets

Recuerda que son dos cosas totalmente distintas

LO que voy a hacer es convertir el server de http en un servidor de websockets

para hacer esto necesitas cocket.io-client

 $ npm install socket.io-client


configure todo en client.js dentro de la carpeta realtime.

Usuarios conectados:2 -> Uno es el server y el otro soy yo



         Enviar datos de la base de datos a los clientes

Voy a mostrar en tiempo real cuando se mostro la nueva tarea

En los modelos dentro de ellos hay un archivo llamado task.js el cual contiene una funcion que envia todas las propíedades de task

Despues en el server de web sockets, necesito escuchar ese mensaje que estoy enviando 


socket.on('new_task',function(data){
          console.log(data);
      })

Aqui indico que voy a estar al pendiente de mi new_task

Cuando se creee una nueva tarea, todos los clientes van a saberlo 

           Segunda explicacion de que son las WebSockets

Primero debo de importar las web sockets 

Para hacer uso de estas web sockets, necesito guardar la escucha del servidor en una vairbale, ya q como expique antes, el protocolo websockets utiliza el protocolo http para poder iniciar la comunacion.



El protocolo de websockets esta basado en la configuracion de mensajes y eventos.

Cuando tu quieras enviar informacion desde el servidor, para el cliente, lo cual es algo que http no puede hacer... es utilizar el metodo emit del objeto io 

El primer argumento de emit es un identificiador del mensaje. El segundo argumento son los datos que le quieras mandar al cliente


Ya que hiciste todo eso. Necesitas configurar tu cliente, desde las vistas. 

Lo mas importante para configurar un cliente de web sockets es importar el cliente de socket.io

    script(src="/socket.io/socket.io.js")

LO que hace socket io es que cuando entren a esa ruta ese archivo de javascript que es necesario para que los clientes se conecten al servidor. Despues coloque javascript.

La configuracion fue la sifuiente: 

Mande llamar a un objeto global que tiene un metodo connect que indica a donde te tienes que conectar(lo deje vacio porque es la direccion local)

Despues coloco que cuando reciba un mensaje count_updated (tiene que ser el mismo identificador con el que estas emitiendo el mensaje). Ejecuta una funcion. Lo unico que va a hacer esa funcion es imprimir en consola esos datos 

Despues solo agregue un parrafo:

  p
      span Usuarios conectados:
      span#conected

El cual me manda la informacion de cuantos usuario estan conectados a trabes del objeto conecte


          document.querySelector('#conected').innerHTML = data.count
dentro coloco el contador


Ahora hay algo imoirtante de entender y es que amboas entidades estan separadas, y  si yo quiero juntar mi proyecto con todo lo demas necesito hacer lo siguiente:


       Comunicar el servidor Http y el servidor de Websockets



Para hace esto, convierto a mi servidor http en un cliente mas, de mi servidor de websockets


$ npm install socket.io-client

Para poder poder hacer esto cree un nuevo archivo llamado client.js ceontro de la carpeta realtime 



El cual contiene la logica del cliente que se va a comunicar con el server

//Aqui defino la logica del cliente que se va a comunicar con el servidor
const io = require('socket.io-client');

let socket = io.connect('http://localhost:3000', {reconnect: true});// Primer arguemnto el server y el sefundo argumento el json de config. EN este caso coloque que quierp que se reconecte en caso de que se reconecte

//La socket tiene un evento connect q se ejecuta cuando la conexion con web sockets finalizo correctamente
socket.on('connect', function(){//Evento connect
    console.log("\n\nSocket connected from NodeJS\n\n")
})

module.exports = socket;//Exporto la socket

Todo esto fue la configuarcion, que posteriormente tuve que importarlo en mi server principal. Aunque ojo que tiene que ser despues de que tu servidr ya se halla ejecutado. Por eso es que lo coloque hasta el final

const client = require('./realtime/client');

Y con esto el server tambien enlazado con los mensajes que pueda enviar la web socket

La forma de comprobar esto, es que cuando veas cuanto usuarios esten conectados, podras ver que hay 2. Uno es el cliente (tu) y el otro es el servidor mismo 






Ahora, Enviar datos de la base de datos a los clientes 



Voy a mostrar en tiempo real, cuando se creo una nueva tarea

Lo que hice fue importar un objeto para que se comunique con las web soquets en mi modelo

const socket = require('../realtime/client');//Esta es la socket conectada al servidor


una ves que hice esto agregue una funcion a mi hook:

  Task.afterCreate(function(task, options){// Luego que se termine de registrar una nueva tarea , lo voy a poder anviar a los clientes web sockets
    socket.emit('new_task', task)
     // ...task // -> Esto manda todas las propiedades de task
    //})
  })

  y con esto cunaod termine la tarea a crear yo la voy a poder enviar a los clientes web sockets


      socket.emit('new_task', task)//El primer arguemtno es el identificador con lo que lo voy a mandar y dentro un json con la info que yo quiera


  socket.on('new_task', function(data){//Este metodo indica que cuando reciba un mensaje de una socket que se llame new_task, quiero q ejecute la siguietne funcion la cual recibe como argumento el json que yo halla pasado desde mi midelo 

En la vista:

socket.on -> Significia estar al pendiente

      socket.on('new_task',function(data){

Indica que cuando llegue este mensaje imprima los dats que le llegue en la consola

.CUANDO SE CREE UNA NUEVA TAREA, TODOS LOS CLIENTES LO SABRAN

Depsues de esto en consola de la pagina principal

localhost:300

{id: 21, description: "Demo en realtime", userId: 1, updatedAt: "2020-07-27T21:33:03.161Z", createdAt: "2020-07-27T21:33:03.161Z"}
createdAt: "2020-07-27T21:33:03.161Z"
description: "Demo en realtime"
id: 21
updatedAt: "2020-07-27T21:33:03.161Z"
userId: 1
__proto__: Object

tengo la tarea que se acaba de crear !!!


Ahora todo funciona en REALTIME !!!!

Ya con esto puedo crear FACEBOOK!!! 

 
     Control de comunicación por usuario en Websockets

Voy a crear una forma en la que pueda identificar quien creo la tarea.

Aunque hay un problema y es que en socket io no hay un mecanismo como tal, para hacer esto. Ya que con socket io no tienes acceso a las sesiones

      socket = io.connect(window.location.origin)

Con esto hago dinamica mi coneccion. Despues paso un query con informacion que al momento de conectar, quiero que se comunique con el servidor de web socket que en este caso seria el id del usuario que esta conectado el cual se obtiene de user.id


    Object.keys(sockets)
Esto me devuelve todas las claves en una arreglo de sockets


Esto esta dentro del metodo disconnect y lo que hace es borrar la socket cada que alguien se desconecte

        if(s.id == socket.id) sockets[userId] = null;
Y con todo esto ahora ya llevo un control de a que usuarios le estoy enviando que informacion

cuando tu creas un archvo .gitignore indicas que no quieres que se suban ciertos archivos del proyecto



Dejare de usar sequelize y me cambiare a postgress


Para poder utilizar postgress con node js, necesitas instalar el paquete:

$ npm install pg

pg es el driver entre nodejs y postgress

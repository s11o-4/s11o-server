module.exports = function(req, res, next){
    if(!req.originalUrl.includes("tasks")) return next(); // Si no incluye la palabra tasks, los deja pasar pero si si tiene tiene que ejecutar la siguiente logica
    // Si existe una sesion de usuarios los deja pasar y si no hara un redireccionamiento hacia alguna pagna publica de nuestra aplicacion web
    if(req.session.userId) return next(); // Si existe la sesion userId quiero que pase y si no quiero que haga un redireccionamiento
    
    res.redirect('/sessions');
}

// Ya que tengo mi middleware lo voy a montar en el stack de middlewares
// y que asi se haga uso de el


/*
OJO que este middleware no quiero que se aplique a todoas las rutas. Solamente a las rutas que esten relacionadas con el manejo de peticiones
Lamentablemente si yo quiero hacer esto tendria que tener otro stack de middlewares. Pero solo existe uno.
SOLUCION!!:

condicionar directamente en el middleware que el path incluya el termino /tasks  
como parte del path mismo 
*/ 
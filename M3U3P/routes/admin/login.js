var express = require('express');
var router = express.Router();
var usuariosModel = require('./../../models/usuariosModel');

router.get('/', function(req, res, next)  {
    res.render('admin/login',{
        layout: 'admin/layout',
    });
  });

  router.get('/logout', function (req, res, next){
    req.session.destroy();
    res.render('admin/login', {
        layout: 'admin/layout'
    });
  });
//a traves del metodo post va a recibir la info

router.post('/', async (req, res, next) =>{
    try {
        var usuario = req.body.usuario; //capturamos los datos
        var password = req.body.password;
        console.log(req.body);
       
        
        var data = await usuariosModel.getUserAndPassword(usuario, password); 

        if (data != undefined) { //si la info que recibi es diferente a la de undefined me va a redireccionar a la pagina admin/login
            req.session.id_usuario = data.id; //id es el nombre de la columna
            req.session.nombre = data.usuario;
            res.redirect('/admin/novedades');
            
        }else{
            res.render('admin/login', {
                layout: 'admin/layout',
                error: true
            });
        }
    } catch (error){
        console.log(error);
    }
})



  module.exports = router;

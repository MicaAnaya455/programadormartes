var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel');
var cloudinary = require('cloudinary').v2;
/* GET home page. */
router.get('/', async function(req, res, next) {
  var novedades = await novedadesModel.getNovedades()
  
  novedades = novedades.splice(0, 6);
  
  novedades = novedades.map(novedad => {
    if(novedad.img_id){
        const imagen = cloudinary.url(novedad.img_id,{
            width:350,
            crop:'fill'
        });
        return{
            ...novedad,
            imagen
        }
    }else{
        return{
            ...novedad,
            imagen:''
        }
    }
});
  res.render('index',{novedades}); 
});


router.post('/', async (req, res, next) =>{
  
  //console.log(req.body) //estoy capturando datos?
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.tel;
  var mensaje = req.body.mensaje; 

  var obj ={
    to: 'micaelaanaya455@gmail.com',
    subject:'Contacto desde la Web',
    html: nombre + " " + apellido + " se contacto a traves de la web y quiere mas informacion a este correo: " + email + ".<br> Ademas hizo este comentario : " + mensaje + ".<br> Su telefono es " + telefono
  } //cierra var obj

  var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth:{
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })//cierra transporter
 
  var info = await transporter.sendMail(obj);

  res.render('index', {
    message:'Mensaje enviado correctamente',
  });

}); //cierra peticion del post


module.exports = router;

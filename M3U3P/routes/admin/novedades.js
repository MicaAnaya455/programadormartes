var express = require('express');
const pool = require('../../models/bd');
var router = express.Router();
var novedadesModel = require('./../../models/novedadesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.upload);


router.get('/', async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades(); //genero una variable para que almacene esta info
    novedades = novedades.map(novedad => {
        if(novedad.img_id){
            const imagen = cloudinary.image(novedad.img_id,{
                width:80,
                height:80,
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
   
   
    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        novedades
    });
});
//Para eliminar una novedad
router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    let novedad = await novedadesModel.getNovedadById(id);
    if(novedad.img_id){
        await(destroy(novedad.img_id));
    }
    
    await novedadesModel.deleteNovedadesById(id);
    res.redirect('/admin/novedades')
});
//PARA UNA NUEVA NOVEDAD
router.get('/agregar', (req, res, next) => {
    res.render('admin/agregar', { //agregar.hbs
        layout: 'admin/layout'
    });
});

router.post('/agregar', async (req, res, next) => {
    try {
        var img_id = '';//generamos una variable vacia
        if (req.files && Object.keys(req.files).length > 0) {
            imagen = req.files.imagen; //var que captura imagen
            img_id = (await uploader(imagen.tempFilePath)).public_id;
        }

        // console.log(req.body) 
        if (req.body.tiulo != "" && req.body.subtiutlo != "" && req.body.cuerpo != "") {
            await novedadesModel.insertNovedad({
                ...req.body, //me esta trayendo titulo, subtitulo y cuerpo + lo que pase en imagen 
                img_id
            });
            res.redirect('/admin/novedades')
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'La novedad no se cargo'
        })
    }
});

router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    var novedad = await novedadesModel.getNovedadById(id);
    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad //le paso la nueva novedad
    });
});



router.post('/modificar', async (req, res, next) => {
    try {
        let img_id = req.body.img_original;
        let borrar_img_vieja = false;
        if(req.body.img_delete === "1"){
            img_id = null;
            borrar_img_vieja = true;
        } else {
            if(req.files && Object.keys(req.files).length > 0){
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;
            }
        }
        if (borrar_img_vieja && req.body.img_original){
            await(destroy(req.body.img_original));
        }


        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo,
            img_id
        }
        console.log(obj)
        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades');
    } catch (error) {
        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la novedad'
        })
    }

});

module.exports = router;
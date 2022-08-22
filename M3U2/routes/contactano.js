var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send('¡Hola soy la página de contacto de Don antonio, pastas artesanales!');
});

module.exports = router;
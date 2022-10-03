var pool = require('./bd');
var md5 = require('md5');

async function getUserAndPassword(user, password) {
    try{
        var query = 'select * from usuarios where usuario = ? and password = ? limit 1'; 
        var rows = await  pool.query(query, [user, md5(password)]);
        return rows[0]; 
    } catch (error){  //si hay algo que no encuentro, nos va a mostrar el error en el terminal
        console.log(error)
    }
}
module.exports =  { getUserAndPassword }
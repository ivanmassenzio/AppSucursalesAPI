let express = require('express');
let mysql = require('mysql');
let cors = require('cors');
let app = express();
const config = require('./config');


// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(express.json());
app.use(cors());
//Establecemos los prámetros de conexión
let conexion = mysql.createConnection(config.db);
//Conexión a la database
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("¡Conexión exitosa a la base de datos!");
    }
});
app.get('/', function(req,res){
    res.send('Ruta INICIO');
});
//Mostrar todos los empleados
app.get('/api/empleados', (req,res)=>{
    conexion.query('SELECT * FROM empleados', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});
//Mostrar un SOLO empleado
app.get('/api/empleados/:id', (req,res)=>{
    conexion.query('SELECT * FROM empleados WHERE id_empleado = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error
        }else{
            res.send(fila)
        }
    })
})
//Crear un empleado
app.post('/api/empleados', (req,res)=>{
    let data = {nombre:req.body.nombre, genero:req.body.genero, puesto:req.body.puesto, sucursal:req.body.sucursal}
    let sql = "INSERT INTO empleados SET ?"
    conexion.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{              
             /*Esto es lo nuevo que agregamos para el CRUD con Javascript*/
             Object.assign(data, {id: result.insertId }) //agregamos el ID al objeto data             
             res.send(data) //enviamos los valores                         
        }
    })
})
//Editar empleado
app.put('/api/empleados/:id', (req, res)=>{
    let id = req.params.id
    let nombre = req.body.nombre
    let genero = req.body.genero
    let puesto = req.body.puesto
    let sucursal = req.body.sucursal
    let sql = "UPDATE empleados SET nombre = ?, genero = ?, puesto = ?, sucursal = ? WHERE id_empleado = ?"
    conexion.query(sql, [nombre, genero, puesto, sucursal, id], function(error, results){
        if(error){
            throw error
        }else{              
            res.send(results)
        }
    })
})
//Eliminar empleado
app.delete('/api/empleados/:id', (req,res)=>{
    conexion.query('DELETE FROM empleados WHERE id_empleado = ?', [req.params.id], function(error, filas){
        if(error){
            throw error
        }else{              
            res.send(filas)
        }
    })
})

//Mostrar todas las sucursales
app.get('/api/sucursales', (req,res)=>{
    conexion.query('SELECT * FROM sucursales', (error,filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});
//Mostrar una SOLA sucursal
app.get('/api/sucursales/:id', (req,res)=>{
    conexion.query('SELECT * FROM sucursales WHERE idsucursal = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error
        }else{
            res.send(fila)
        }
    })
})
//Crear una sucursal
app.post('/api/sucursales', (req,res)=>{
    let data = {idsucursal:req.body.numero,nombre:req.body.nombre, direccion:req.body.direccion, cajas_total:req.body.totalcajas, plataformas_total:req.body.totalplataformas}
    let sql = "INSERT INTO sucursales SET ?"
    conexion.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{                           
             Object.assign(data, {id: result.insertId })
             res.send(data)                   
        }
    })
})
//Editar sucursal
app.put('/api/sucursales/:id', (req, res)=>{
    let id = req.params.id
    let nombre = req.body.nombre
    let direccion = req.body.direccion
    let totalcajas = req.body.totalcajas
    let totalplataformas = req.body.totalplataformas
    let sql = "UPDATE sucursales SET nombre = ?, direccion = ?, cajas_total = ?, plataformas_total = ? WHERE idsucursal = ?"
    conexion.query(sql, [nombre, direccion, totalcajas, totalplataformas, id], function(error, results){
        if(error){
            throw error
        }else{              
            res.send(results)
        }
    })
})
//Eliminar sucursal
app.delete('/api/sucursales/:id', (req,res)=>{
    conexion.query('DELETE FROM sucursales WHERE idsucursal = ?', [req.params.id], function(error, filas){
        if(error){
            throw error
        }else{              
            res.send(filas)
        }
    })
})




const puerto = process.env.PORT || 3000;
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:"+puerto);
});
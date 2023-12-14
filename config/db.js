const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/flexunstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 10000, 
  socketTimeoutMS: 45000,  
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB error de conexión:', err);
  process.exit(1); // Salir del proceso si hay un error de conexión
});

db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Manejo de eventos de desconexión
db.on('disconnected', () => {
  console.log('Se perdió la conexión con MongoDB');
});

// Manejo de eventos de cierre del proceso
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Conexión a MongoDB cerrada');
    process.exit(0); // Salir del proceso después de cerrar la conexión
  });
});

module.exports = mongoose;

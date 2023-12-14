const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('./config/db');
const path = require('path');  
const { authenticateUser } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const saleRoutes = require('./routes/saleRoutes');
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(
  session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 604800000, 
      sameSite: 'strict', 
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.set('debug', true);

mongoose.connect('mongodb://127.0.0.1:27017/flexunstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
})
.then(() => {
  console.log('Conexión exitosa a la base de datos');
})
.catch((err) => {
  console.error('Error al conectar a la base de datos:', err.message);
});

// Middleware de autenticación para las rutas que lo requieren
app.use(['/profile', '/sales'], authenticateUser);

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(profileRoutes);
//console.log(app._router.stack);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


app.listen(port, () => {
  console.log(`Servidor funcionando en http://localhost:${port}`);
});

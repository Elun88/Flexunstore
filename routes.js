const express = require('express');
const router = express.Router();
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

router.get('/', (req, res) => {
  res.send('Bienvenido a la página de inicio');
});

router.get('/login', (req, res) => {
  res.redirect('/users/login');
});

router.get('/signup', (req, res) => {
  res.render('signup'); 
});


router.use('/products', productRoutes);
router.use('/users', userRoutes);

module.exports = router;

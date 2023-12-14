const Sale = require('../models/Sale');
const User = require('../models/User');

const saleController = {
  getSales: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado y es un administrador
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      // Obtener todas las ventas desde la base de datos
      const sales = await Sale.find();

      // Renderizar la vista de la lista de ventas
      res.render('sale/saleList', { sales });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  addSaleForm: (req, res) => {
    try {
      // Renderizar el formulario de creación de venta
      res.render('sale/addSaleForm');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  addSale: async (req, res) => {
    try {
      // Obtener datos de la nueva venta desde el cuerpo de la solicitud
      const { productName, quantity, price } = req.body;

      // Crear la nueva venta
      const newSale = await Sale.create({ productName, quantity, price });

      res.json(newSale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getSaleDetails: async (req, res) => {
    try {
      const saleId = req.params.id;
      const sale = await Sale.findById(saleId);

      if (!sale) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }

      // Renderizar la vista de detalles de venta
      res.render('sale/saleDetails', { sale });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  checkout: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      // Obtener el carrito del usuario
      const user = await User.findById(req.session.user._id).populate('cart');

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Realizar la lógica de checkout según tus necesidades
      // Puedes generar una factura, actualizar inventario, etc.

      // Crear una venta
      const sale = await Sale.create({
        user: user._id,
        products: user.cart.map(product => product._id),
      });

      // Limpiar el carrito del usuario
      user.cart = [];
      await user.save();

      res.json(sale);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = saleController;

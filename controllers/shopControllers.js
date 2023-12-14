const Product = require('../models/Product');
const User = require('../models/User');

const shopController = {
  getProducts: async (req, res) => {
    try {
      // Obtener todos los productos de la base de datos
      const products = await Product.find();

      res.render('products', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getShop: (req, res) => {
    try {
      // Aquí puedes realizar cualquier lógica necesaria para obtener datos de la tienda

      // Por ejemplo, podrías obtener una lista de productos desde la base de datos
      const products = [
        { id: 1, name: 'Producto 1', price: 20 },
        { id: 2, name: 'Producto 2', price: 30 },
        // ... más productos
      ];

      // Renderizar la vista de la tienda y pasar los datos necesarios
      res.render('shop', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getProductDetails: async (req, res) => {
    const productId = req.params.productId;

    try {
      // Obtener detalles de un producto específico
      const product = await Product.findById(productId);

      if (product) {
        res.render('product-details', { product });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  buyProduct: async (req, res) => {
    try {
      // Lógica para realizar una compra (actualizar inventario, crear orden, etc.)
      // ...

      res.redirect('/profile/orders');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getCart: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      // Obtener detalles del usuario autenticado
      const userId = req.session.user._id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Obtener productos en el carrito del usuario
      const cartProducts = await Product.find({ _id: { $in: user.cart } });

      res.render('shop/cart', { cartProducts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  addToCart: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      // Obtener el ID del producto desde la solicitud
      const productId = req.params.productId;

      // Agregar el producto al carrito del usuario
      const updatedUser = await User.findByIdAndUpdate(
        req.session.user._id,
        { $addToSet: { cart: productId } },
        { new: true }
      );

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      // Obtener el ID del producto desde la solicitud
      const productId = req.params.productId;

      // Eliminar el producto del carrito del usuario
      const updatedUser = await User.findByIdAndUpdate(
        req.session.user._id,
        { $pull: { cart: productId } },
        { new: true }
      );

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = shopController;


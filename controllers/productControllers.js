const Product = require('../models/Product');

const productController = {
  addProduct: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado y es administrador
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      // Obtener datos del nuevo producto desde el cuerpo de la solicitud
      const { name, price } = req.body;

      // Crear el nuevo producto
      const newProduct = await Product.create({ name, price });

      res.json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.render('product/productList', { products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  getProductDetails: async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.render('product/productDetails', { product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createProduct: async (req, res) => {
    try {
      const { name, price, description } = req.body;
      const newProduct = await Product.create({ name, price, description });
      res.json(newProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  createProductForm: (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }
    res.render('product/createProductForm');
  },

  buyProduct: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      // Obtener el ID del producto desde la solicitud
      const productId = req.params.id;

      // Buscar el producto en la base de datos por su ID
      const product = await Product.findById(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Realizar la lógica de compra del producto según tus necesidades
      // Puedes actualizar el stock, generar una factura, etc.

      res.send(`Compra exitosa: ${product.name}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  

  updateProduct: async (req, res) => {
    try {
      // Verificar si el usuario tiene permisos para actualizar productos
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      // Obtener el ID del producto desde la solicitud
      const productId = req.params.id;

      // Obtener los datos actualizados del producto desde la solicitud
      const { name, price, description } = req.body;

      // Buscar y actualizar el producto en la base de datos
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, price, description },
        { new: true }
      );

      // Verificar si el producto existe
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      // Verificar si el usuario tiene permisos para eliminar productos
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      // Obtener el ID del producto desde la solicitud
      const productId = req.params.id;

      // Buscar y eliminar el producto en la base de datos
      const deletedProduct = await Product.findByIdAndDelete(productId);

      // Verificar si el producto existe
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  editProductForm: async (req, res) => {
    try {
      // Verificar si el usuario tiene permisos para acceder al formulario de edición
      if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(403).json({ error: 'Acceso no autorizado' });
      }

      // Obtener el ID del producto desde la solicitud
      const productId = req.params.id;

      // Buscar el producto en la base de datos por su ID
      const product = await Product.findById(productId);

      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Renderizar la vista del formulario de edición de producto
      res.render('product/editProductForm', { product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
};

module.exports = productController;
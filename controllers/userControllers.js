const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userController = {
  // Crear un nuevo usuario
  createUser: async (req, res) => {
    try {
      const { username, password, email } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        return res.status(400).json({ error: 'Nombre de usuario ya en uso' });
      }

      // Hash de la contraseña antes de almacenarla en la base de datos
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear el nuevo usuario
      const newUser = await User.create({ username, password: hashedPassword, email });

      res.json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Obtener detalles de un usuario
  getUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  profile: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      res.render('user/profile', { user: req.session.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Actualizar información de usuario
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const { username, password, email } = req.body;

      // Verificar si el usuario existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Actualizar información del usuario
      user.username = username || user.username;
      if (password) {
        user.password = await bcrypt.hash(password, saltRounds);
      }
      user.email = email || user.email;

      const updatedUser = await user.save();

      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Eliminar un usuario
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  editProfile: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      res.render('user/editProfile', { user: req.session.user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.session.user) {
        return res.redirect('/users/login');
      }

      // Obtener los datos actualizados del perfil desde la solicitud
      const { username, email } = req.body;

      // Actualizar los datos del perfil del usuario
      req.session.user.username = username;
      req.session.user.email = email;

      // Actualizar en la base de datos si es necesario
      await User.findByIdAndUpdate(req.session.user._id, { username, email });

      res.redirect('/profile');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Buscar el usuario en la base de datos
      const user = await User.findOne({ username });

      // Verificar si el usuario existe y la contraseña es correcta
      if (user && await bcrypt.compare(password, user.password)) {
        // Almacenar información del usuario en la sesión
        req.session.user = {
          _id: user._id,
          username: user.username,
          email: user.email,
          // Puedes agregar más información del usuario según tus necesidades
        };

        // Redirigir a la página de perfil después de iniciar sesión
        res.redirect('/profile');
      } else {
        // Credenciales inválidas, redirigir a la página de inicio de sesión
        res.redirect('/login');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Cerrar sesión
  logout: async (req, res) => {
    try {
      // Limpiar la sesión y redirigir a la página de inicio
      req.session.destroy((err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al cerrar sesión' });
        } else {
          res.redirect('/');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },


  
};

module.exports = userController;

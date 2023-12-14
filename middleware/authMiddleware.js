const authenticateUser = (req, res, next) => {
  try {
    // Verificar si el usuario está autenticado
    if (!req.session.user) {
      // Si no está autenticado, redirigir a la página de inicio de sesión
      return res.redirect('/users/login');
    }

    // Verificar si se requiere que el usuario sea administrador
    if (req.originalUrl.includes('admin') && !req.session.user.isAdmin) {
      // Si no es un administrador y se requiere, mostrar mensaje de error
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    // Si el usuario está autenticado y cumple con los requisitos, permitir que la solicitud continúe
    next();
  } catch (error) {
    // Manejar cualquier error interno del servidor
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const checkAdmin = (req, res, next) => {
  try {
    // Verificar si el usuario es administrador
    if (!req.session.user || !req.session.user.isAdmin) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    // Si el usuario es administrador, permitir que la solicitud continúe
    next();
  } catch (error) {
    // Manejar cualquier error interno del servidor
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const redirectIfLoggedIn = (req, res, next) => {
  // Verificar si el usuario ya está autenticado
  if (req.session.user) {
    // Si ya está autenticado, redirigir a la página de inicio, por ejemplo
    return res.redirect('/');
  }

  // Si no está autenticado, permitir que la solicitud continúe
  next();
};

module.exports = { authenticateUser, checkAdmin, redirectIfLoggedIn };

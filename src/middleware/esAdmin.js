const admin = true;

const esAdmin = (req, res, next) => {
  if (admin) next();
  else res.status(401).json({ error: -1, descripcion: "No tiene permiso" });
};

module.exports = esAdmin;

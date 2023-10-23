const authenticateAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({ error: "Only Admins are allowed to perform the specific task" });
  }
};

module.exports=authenticateAdmin

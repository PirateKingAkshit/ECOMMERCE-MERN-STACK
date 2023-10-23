const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized User" });
  }

    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
        return res.status(403).json({ error: "Invalid token" });
    }
    else {
        req.user = await User.findById(verify.userId).select("-password")
        next()
    }
});




module.exports =authenticateUser;

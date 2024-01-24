const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = process.env;

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
};

exports.verifyAccessToken = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ status: false, msg: "Token not found" });
  }

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);

    try {
      const foundUser = await User.findById(user.id);

      if (!foundUser) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: false, msg: "User not found" });
      }

      req.user = foundUser;
      next();
    } catch (err) {
      console.error(err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ status: false, msg: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ status: false, msg: "Invalid token" });
  }
};

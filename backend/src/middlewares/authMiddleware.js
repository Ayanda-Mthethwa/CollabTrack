import jwt from "jsonwebtoken";
import { getUserById } from "../models/UserModel.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID and attach to the request object
      req.user = await getUserById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      // Exclude password hash from the user object
      // The user object from the database might have `password_hash`
      if (req.user && req.user.password_hash) {
        delete req.user.password_hash;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // The column in your DB is `user_role`, so we should check that property.
    if (!req.user || !roles.includes(req.user.user_role)) {
      return res.status(403).json({
        message: `User role '${
          req.user ? req.user.user_role : "guest"
        }' is not authorized to access this route`,
      });
    }
    next();
  };
};

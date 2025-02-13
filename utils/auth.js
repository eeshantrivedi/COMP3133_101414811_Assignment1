const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const authenticate = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new Error("Authentication token must be 'Bearer <token>'");
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
  throw new Error("Authorization header must be provided");
};

module.exports = authenticate;

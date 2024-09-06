import jwt from "jsonwebtoken";

const secretKey = "capstone";

export const createToken = (data) => {
  return jwt.sign({ data }, secretKey, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const middleWareToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Token is required");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).send("Invalid token");
  }

  req.user = decoded.data;
  next();
};

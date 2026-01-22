import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ehsas-super-secret-key-2024";
const JWT_EXPIRATION_HOURS = 24;

export const createJwtToken = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: `${JWT_EXPIRATION_HOURS}h`,
  });
};

export const verifyJwtToken = (token) => {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
};

export const requireAdmin = (req) => {
  const authHeader = req.headers.authorization || "";
  const [, token] = authHeader.split(" ");
  if (!token) {
    const error = new Error("Missing authorization token");
    error.statusCode = 401;
    throw error;
  }

  try {
    const payload = verifyJwtToken(token);
    if (payload.role !== "admin") {
      const error = new Error("Admin access required");
      error.statusCode = 403;
      throw error;
    }
    return payload;
  } catch (err) {
    const error = new Error(err.message || "Invalid token");
    error.statusCode = err.name === "TokenExpiredError" ? 401 : 401;
    throw error;
  }
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;

// Create token for normal users
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Create admin token
export function signAdminToken() {
  return jwt.sign({ role: "admin" }, ADMIN_SECRET, { expiresIn: "7d" });
}

// Verify normal user token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Verify admin token
export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, ADMIN_SECRET);
  } catch (err) {
    return null;
  }
}

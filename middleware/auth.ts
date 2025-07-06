import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function verifyAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) throw new Error("No token provided");

  const token = auth.split(" ")[1];
  return jwt.verify(token, JWT_SECRET) as { userId: number; isAdmin: boolean };
}

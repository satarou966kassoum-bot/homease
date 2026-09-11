import jwt from "jsonwebtoken";

export function generateToken(userId: string): string {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "30d";
  return jwt.sign({ id: userId }, secret, { expiresIn } as jwt.SignOptions);
}

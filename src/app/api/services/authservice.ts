import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export const signup = async (data: { name: string; email: string; username: string; password: string }) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email: data.email }, { username: data.username }] },
  });

  if (existingUser) {
    throw new Error("Email or username already taken");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      username: data.username,
      passwordHash,
    },
  });

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Invalid email or password");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "7d" });

  return { user, token };
};

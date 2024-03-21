import bcrypt from "bcryptjs";
import { prisma } from "../app";

import jwt from "jsonwebtoken";
import { config } from "../config";

export const authenticate = async (token: string) => {
  const userId = await jwt.verify(token, config.jwtSecret);
  const { id } = userId as { id: string };
  if (!id) return new Error("User not found");
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    return new Error("User not found");
  }
  const { password: _, ...userData } = user;
  return userData;
};

export const login = async (email: string, password: string) => {
  try {
    const userData = await prisma.user.findUnique({ where: { email } });

    if (!userData) {
      return { error: "Email or password incorrect" };
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return { error: "Email or password incorrect" };
    }

    const { password: _, ...user } = userData;

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "90d",
    });
    console.log(token);
    return { user: user, token };
  } catch (error) {
    return { error };
  }
};

export const register = async (userData: any) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const data = { ...userData, password: hashedPassword };
  try {
    const createdUser = await prisma.user.create({
      data,
    });

    const { password: _, ...user } = createdUser;

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "90d",
    });
    console.log({ user, token });

    return { user, token };
  } catch (error) {
    return { error };
  }
};

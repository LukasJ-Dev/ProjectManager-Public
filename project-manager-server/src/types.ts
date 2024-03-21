import { PrismaClient, User } from "@prisma/client";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  //Exclude password from user
  user?: Omit<User, "password">;
}

export interface Context {
  prisma: PrismaClient;
  user?: Omit<User, "password">;
}

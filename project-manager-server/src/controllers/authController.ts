import { Request, Response, NextFunction } from "express";

import * as authentication from "../utils/authentication";
import { AuthenticatedRequest } from "../types";

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.cookies?.jwt || req.headers.authorization?.split("Bearer ")[1];
  if (token) {
    try {
      const user = await authentication.authenticate(token);
      if (user instanceof Error) throw user;
      req.user = user;
    } catch (error) {
      console.log(error);
    }
  }

  next();
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = await authentication.login(req.body.email, req.body.password);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body.data);
    const data = await authentication.register(req.body.data);
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not found" });
  }
  res.status(200).json({ user: req.user });
};

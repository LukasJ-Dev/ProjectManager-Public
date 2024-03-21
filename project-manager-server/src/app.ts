import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import schema from "./schema/schema";
import router from "./routes/routes";
import { PrismaClient } from "@prisma/client";
import { config } from "./config";
import { authenticate } from "./controllers/authController";
import { AuthenticatedRequest, Context } from "./types";

const app = express();

export const prisma = new PrismaClient();

app.use(cors({ origin: config.clientUrl, credentials: true }));

app.use(express.json());

app.use(
  "/graphql",
  authenticate,
  graphqlHTTP((req) => {
    const authReq = req as AuthenticatedRequest;
    return {
      schema,
      graphiql: config.nodeEnv === "development",
      context: { prisma, user: authReq.user },
    };
  })
);

//app.use(cors());

app.use("/api/v1", router);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

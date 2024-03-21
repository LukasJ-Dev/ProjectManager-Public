import dotenv from "dotenv";

function envVar<T>(name: string, defaultValue: T): T {
  const value = process.env[name];
  if (!value) {
    console.warn(
      `Environment variable ${name} not set, using default value ${defaultValue}`
    );
    return defaultValue;
  }
  return value as T;
}

function requiredEnvVars<T>(names: string[]): number {
  let missingEnvVars = 0;
  for (const name of names) {
    const value = process.env[name];
    if (!value) {
      console.error(
        `Environment variable ${name} not set. The application will only run in development mode.`
      );
      missingEnvVars++;
    }
  }
  return missingEnvVars;
}

dotenv.config();
export const config = {
  port: envVar("PORT", 3000),
  jwtSecret: envVar("JWT_SECRET", "___secret_key___"),
  nodeEnv:
    requiredEnvVars(["JWT_SECRET", "OPENAI_API_KEY"]) === 0
      ? envVar("NODE_ENV", "development")
      : "development",
  clientUrl: envVar("CLIENT_URL", "http://localhost:8080"),
  OpenAiKey: envVar("OPENAI_API_KEY", "___openai_key___"),
};

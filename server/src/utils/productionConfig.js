const PLACEHOLDER_JWT_SECRET = "your_jwt_secret_key_here_change_in_production";
const LOCAL_FRONTEND_ORIGIN = "http://localhost:3000";
const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

const validateProductionConfig = (env) => {
  if (env.NODE_ENV !== "production") return null;

  if (
    !env.JWT_SECRET ||
    env.JWT_SECRET.length < 32 ||
    env.JWT_SECRET === PLACEHOLDER_JWT_SECRET
  ) {
    return "JWT_SECRET must be a unique secret of at least 32 characters in production.";
  }

  let databaseUrl;
  try {
    databaseUrl = new URL(env.MONGO_URI);
  } catch {
    return "MONGO_URI must be a valid MongoDB connection string in production.";
  }

  if (!["mongodb:", "mongodb+srv:"].includes(databaseUrl.protocol)) {
    return "MONGO_URI must use mongodb:// or mongodb+srv:// in production.";
  }
  if (
    !databaseUrl.hostname ||
    LOCAL_DATABASE_HOSTS.has(databaseUrl.hostname.toLowerCase()) ||
    /^127(?:\.\d{1,3}){3}$/.test(databaseUrl.hostname)
  ) {
    return "MONGO_URI must point to a remote database in production, not localhost.";
  }

  const origins = (env.FRONTEND_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  if (!origins.length) {
    return "FRONTEND_ORIGIN must include the frontend URL in production.";
  }

  for (const origin of origins) {
    let parsedOrigin;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      return "Every FRONTEND_ORIGIN entry must be a valid URL origin.";
    }

    if (parsedOrigin.origin !== origin) {
      return "Every FRONTEND_ORIGIN entry must be an origin without a path.";
    }
    if (parsedOrigin.protocol !== "https:" && origin !== LOCAL_FRONTEND_ORIGIN) {
      return `Production FRONTEND_ORIGIN entries must use HTTPS (except ${LOCAL_FRONTEND_ORIGIN} for local testing).`;
    }
  }

  return null;
};

module.exports = { validateProductionConfig };

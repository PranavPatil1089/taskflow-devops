const test = require("node:test");
const assert = require("node:assert/strict");
const { validateProductionConfig } = require("../src/utils/productionConfig");

const validProductionEnv = {
  NODE_ENV: "production",
  JWT_SECRET: "a".repeat(64),
  MONGO_URI: "mongodb+srv://user:password@cluster.example.mongodb.net/taskflow",
  FRONTEND_ORIGIN: "https://taskflow.example.com,http://localhost:3000",
};

test("production configuration accepts valid deployment settings", () => {
  assert.equal(validateProductionConfig(validProductionEnv), null);
});

test("production configuration rejects a short or sample JWT secret", () => {
  assert.match(
    validateProductionConfig({ ...validProductionEnv, JWT_SECRET: "short" }),
    /unique secret of at least 32 characters/
  );
  assert.match(
    validateProductionConfig({
      ...validProductionEnv,
      JWT_SECRET: "your_jwt_secret_key_here_change_in_production",
    }),
    /unique secret of at least 32 characters/
  );
});

test("production configuration rejects a local MongoDB address", () => {
  assert.match(
    validateProductionConfig({
      ...validProductionEnv,
      MONGO_URI: "mongodb://localhost:27017/taskflow",
    }),
    /remote database in production/
  );
});

test("production configuration requires valid frontend origins", () => {
  assert.match(
    validateProductionConfig({ ...validProductionEnv, FRONTEND_ORIGIN: "" }),
    /FRONTEND_ORIGIN must include/
  );
  assert.match(
    validateProductionConfig({
      ...validProductionEnv,
      FRONTEND_ORIGIN: "http://taskflow.example.com",
    }),
    /must use HTTPS/
  );
  assert.match(
    validateProductionConfig({
      ...validProductionEnv,
      FRONTEND_ORIGIN: "https://taskflow.example.com/dashboard",
    }),
    /without a path/
  );
});

test("production configuration does not restrict local development", () => {
  assert.equal(
    validateProductionConfig({
      NODE_ENV: "development",
      MONGO_URI: "mongodb://localhost:27017/taskflow",
      JWT_SECRET: "your_jwt_secret_key_here_change_in_production",
    }),
    null
  );
});

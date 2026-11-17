const test = require("node:test");
const assert = require("node:assert/strict");
const { errorHandler } = require("../src/utils/errorHandler");

const invokeErrorHandler = (error) => {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  errorHandler(error, {}, response, () => {});
  return response;
};

test("production responses hide internal server error messages", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalConsoleError = console.error;
  process.env.NODE_ENV = "production";
  console.error = () => {};

  try {
    const response = invokeErrorHandler(new Error("database credentials leaked"));
    assert.equal(response.statusCode, 500);
    assert.equal(response.body.message, "Internal Server Error");
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    console.error = originalConsoleError;
  }
});

test("production responses preserve client error messages", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalConsoleError = console.error;
  process.env.NODE_ENV = "production";
  console.error = () => {};

  try {
    const response = invokeErrorHandler(Object.assign(new Error("Invalid task"), { statusCode: 400 }));
    assert.equal(response.statusCode, 400);
    assert.equal(response.body.message, "Invalid task");
  } finally {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    console.error = originalConsoleError;
  }
});

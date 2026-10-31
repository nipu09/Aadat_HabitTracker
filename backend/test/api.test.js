// Black-box checks that run without a database: validation, auth guards, security headers.
process.env.MONGO_URI = "mongodb://localhost/test";
process.env.JWT_KEY = "y".repeat(40);
process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:5173";

const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../app");

let server;
let base;
test.before(async () => {
  await new Promise((r) => {
    server = app.listen(0, r);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
test.after(() => server.close());

const post = (path, body, headers = {}) =>
  fetch(base + path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

test("protected habit routes need a login", async () => {
  for (const path of ["/habits", "/habits/heatmap", "/auth/me"]) {
    const res = await fetch(base + path);
    assert.equal(res.status, 401, path);
  }
});

test("check-in route is also protected", async () => {
  const res = await fetch(base + "/habits/507f1f77bcf86cd799439011/today", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: true }),
  });
  assert.equal(res.status, 401);
});

test("register rejects weak input before touching the database", async () => {
  const res = await post("/auth/register", { name: "A", email: "nope", password: "123" });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.code, "VALIDATION_ERROR");
  assert.ok(body.errors.email && body.errors.password);
});

test("login rejects operator-injection payloads", async () => {
  const res = await post("/auth/login", { email: { $gt: "" }, password: { $gt: "" } });
  assert.equal(res.status, 400);
});

test("requests from another origin are blocked (CSRF guard)", async () => {
  const res = await post("/auth/logout", {}, { Origin: "https://evil.example" });
  assert.equal(res.status, 403);
});

test("security headers are set and tech stack is hidden", async () => {
  const res = await fetch(base + "/");
  assert.equal(res.headers.get("x-powered-by"), null);
  assert.ok(res.headers.get("x-content-type-options"));
});

test("unknown routes return JSON 404", async () => {
  const res = await fetch(base + "/nope");
  assert.equal(res.status, 404);
  assert.equal((await res.json()).code, "NOT_FOUND");
});

import { Hono } from "hono";
type Bindings = {
  MY_VAR: string;
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

export default app;

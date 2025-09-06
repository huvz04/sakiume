import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  MY_VAR: string;
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>();

// 启用 CORS
app.use("*", cors());

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

// 访问计数 API
app.post("/api/visit-count", async (c) => {
  try {
    // 获取客户端IP地址作为唯一标识
    const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const userAgent = c.req.header('User-Agent') || 'unknown';
    
    // 确保数据表存在
    await c.env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS visit_counter (id INTEGER PRIMARY KEY, count INTEGER DEFAULT 0)`
    ).run();
    
    // 创建访问记录表，用于防止重复计数
    await c.env.DB.prepare(
      `CREATE TABLE IF NOT EXISTS visit_records (ip TEXT, user_agent TEXT, visit_time INTEGER, PRIMARY KEY (ip, user_agent))`
    ).run();
    
    // 检查是否已有记录
    const result = await c.env.DB.prepare(
      `SELECT count FROM visit_counter WHERE id = 1`
    ).first<{ count: number }>();
    
    // 检查此IP和UA是否在24小时内访问过
    const currentTime = Math.floor(Date.now() / 1000);
    const oneDayAgo = currentTime - 86400; // 24小时前的时间戳
    
    const visitRecord = await c.env.DB.prepare(
      `SELECT * FROM visit_records WHERE ip = ? AND user_agent = ? AND visit_time > ?`
    ).bind(clientIP, userAgent, oneDayAgo).first();
    
    let count = result ? result.count : 0;
    
    // 如果24小时内没有访问记录，则增加计数
    if (!visitRecord) {
      count += 1;
      
      if (result) {
        // 更新现有记录
        await c.env.DB.prepare(
          `UPDATE visit_counter SET count = ? WHERE id = 1`
        ).bind(count).run();
      } else {
        // 创建新记录
        await c.env.DB.prepare(
          `INSERT INTO visit_counter (id, count) VALUES (1, ?)`
        ).bind(count).run();
      }
      
      // 添加或更新访问记录
      await c.env.DB.prepare(
        `INSERT OR REPLACE INTO visit_records (ip, user_agent, visit_time) VALUES (?, ?, ?)`
      ).bind(clientIP, userAgent, currentTime).run();
    }
    
    // 返回当前UA信息，用于前端判断设备类型
    return c.json({ 
      count,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    });
  } catch (error) {
    console.error('Database error:', error);
    return c.json({ count: 0, error: 'Database error' }, 500);
  }
});

export default app;

// Entrega el código de la plataforma solo a cuentas con sesión iniciada y acceso vigente.
// La página pública /app/ es un cascarón: pide este archivo con el token de la sesión.
// La comprobación la hace la base de datos (función plataforma_tengo_acceso); aquí no hay claves secretas.
const fs = require("fs");
const path = require("path");

const SUPA = "https://pufgxfjxvbgobkavecqo.supabase.co";
const KEY = "sb_publishable_NTYEm1iPk_cet1ASTbpKTQ_TochumyH";
let html = null;

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "GET") return res.status(405).json({ error: "metodo no permitido" });
  const auth = String(req.headers.authorization || "");
  if (!/^Bearer [A-Za-z0-9._-]{20,4000}$/.test(auth)) return res.status(401).json({ error: "sin sesion" });
  let ok = false;
  try {
    const r = await fetch(SUPA + "/rest/v1/rpc/plataforma_tengo_acceso", {
      method: "POST",
      headers: { apikey: KEY, Authorization: auth, "Content-Type": "application/json" },
      body: "{}",
    });
    if (r.status === 401) return res.status(401).json({ error: "sesion vencida" });
    if (!r.ok) return res.status(502).json({ error: "no se pudo comprobar el acceso" });
    ok = (await r.json()) === true;
  } catch (e) {
    return res.status(502).json({ error: "no se pudo comprobar el acceso" });
  }
  if (!ok) return res.status(403).json({ error: "sin acceso" });
  if (html === null) html = fs.readFileSync(path.join(process.cwd(), "app", "index.html"), "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(html);
};

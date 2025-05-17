const fs = require("fs");
const fetch = require("node-fetch"); // Instala con: npm install node-fetch@2

const productos = JSON.parse(fs.readFileSync("./data/productos_tivana.json", "utf8"));
const API_URL = "https://tivana-backend.onrender.com/api/productos";

(async () => {
  for (let i = 0; i < productos.length; i++) {
    const p = productos[i];
    const body = {
      titulo: p.titulo || p.title || "Producto sin título",
      precio: p.precio || p.price?.value || 0,
      imagen: p.imagen || p.image || p.thumbnail || "",
      enlace: p.url || "#"
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      console.log(`✅ Producto ${i + 1} cargado:`, json.producto?.titulo || "OK");
    } catch (err) {
      console.error(`❌ Error en producto ${i + 1}`, err.message);
    }
  }
})();

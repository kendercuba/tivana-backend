const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = "./data/productos.json";

// Middleware
app.use(cors());
app.use(express.json());

// Obtener todos los productos
app.get("/api/productos", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const productos = JSON.parse(data);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: "Error leyendo productos." });
  }
});

// Agregar un producto
app.post("/api/productos", (req, res) => {
  const nuevo = req.body;

    // 👉 Esto es lo que debes agregar:
  console.log("📦 Producto recibido:", nuevo);

  if (!nuevo.titulo || !nuevo.precio || !nuevo.imagen || !nuevo.enlace) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const productos = JSON.parse(data);
    productos.push(nuevo);
    fs.writeFileSync(DATA_FILE, JSON.stringify(productos, null, 2));
    res.status(201).json({ mensaje: "Producto agregado", producto: nuevo });
  } catch (error) {
    res.status(500).json({ error: "Error guardando producto." });
  }
});

// Eliminar producto por índice
app.delete("/api/productos/:index", (req, res) => {
  const index = parseInt(req.params.index);

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const productos = JSON.parse(data);

    if (index < 0 || index >= productos.length) {
      return res.status(404).json({ error: "Índice inválido" });
    }

    const eliminado = productos.splice(index, 1);
    fs.writeFileSync(DATA_FILE, JSON.stringify(productos, null, 2));
    res.json({ mensaje: "Producto eliminado", eliminado });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando producto." });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

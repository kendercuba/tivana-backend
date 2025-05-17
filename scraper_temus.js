const fs = require("fs");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  const url = "https://www.temu.com"; // Página principal
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Espera que la página cargue y cierra pop-ups si existen
  try {
    await page.click('[aria-label="Close"]', { timeout: 3000 });
  } catch (_) {}

  // Buscar productos de una categoría o palabra clave
  const palabraClave = "audifonos"; // Puedes cambiarlo a lo que quieras
  await page.fill("input[type='search']", palabraClave);
  await page.press("input[type='search']", "Enter");

  // Esperar a que cargue la lista de productos
  await page.waitForSelector(".product-card", { timeout: 10000 });

  const productos = await page.$$eval(".product-card", cards =>
    cards.slice(0, 20).map(card => {
      const titulo = card.querySelector(".product-title")?.innerText || "Sin título";
      const precio = card.querySelector(".product-price")?.innerText?.replace(/[^\d.]/g, "") || "0";
      const imagen = card.querySelector("img")?.src || "";
      const enlace = card.querySelector("a")?.href || "#";
      return { titulo, precio: parseFloat(precio), imagen, enlace };
    })
  );

  // Guardar en un archivo
  fs.writeFileSync("./data/productos_temus.json", JSON.stringify(productos, null, 2));
  console.log("✅ Productos guardados en productos_temus.json");

  await browser.close();
})();

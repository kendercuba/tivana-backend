const fs = require("fs");
const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launchPersistentContext("./perfil-temu", {
    headless: false, // Abre el navegador visible para login
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  });

  const page = await browser.newPage();
  const url = "https://www.temu.com";
  await page.goto(url, { waitUntil: "domcontentloaded" });

  console.log("🟡 Esperando que navegues e inicies sesión...");
  await page.pause(); // 🟡 Te permite pausar y tú haces login

  // Luego puedes buscar productos por palabra clave:
  const palabraClave = "audifonos";
  await page.goto(`https://www.temu.com/search_result.html?_bg_fs=1&search_key=${encodeURIComponent(palabraClave)}`, { waitUntil: "domcontentloaded" });

  // Esperar a que carguen los productos
  await page.waitForSelector(".product-card", { timeout: 10000 });

  const productos = await page.$$eval(".product-card", (cards) =>
    cards.slice(0, 20).map((card) => {
      const titulo = card.querySelector(".product-title")?.innerText || "Sin título";
      const precio = card.querySelector(".product-price")?.innerText.replace(/[^\d.]/g, "") || "0";
      const imagen = card.querySelector("img")?.src || "";
      const enlace = card.querySelector("a")?.href || "#";
      return { titulo, precio: parseFloat(precio), imagen, enlace };
    })
  );

  fs.writeFileSync("./data/productos_temus.json", JSON.stringify(productos, null, 2));
  console.log("✅ Productos guardados en productos_temus.json");

  await browser.close();
})();

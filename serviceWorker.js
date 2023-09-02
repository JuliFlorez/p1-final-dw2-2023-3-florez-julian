const staticTeraflopsComponents = "teraflops-components-site-v1";
const assets = [
  "./",
  "./index.html",
  "./comentarios.html",
  "./Carrito.html",
  "./formulario.html",
  "./gracias.html",
  "./script.js",
  "./manifest.json",
  "style/style.css",
  "scripts/scriptComentarios.js",
  "scripts/Carrito.js",
  "scripts/formulario.js",
  "json/comentarios.json",
  "json/productos.json",
  "assets/icons/48.png",
  "assets/icons/144.png",
  "assets/icons/512.png",
  "assets/1.webp",
  "assets/2.webp",
  "assets/3.webp",
  "assets/4.webp",
  "assets/5.webp",
  "assets/6.webp",
  "assets/7.webp",
  "assets/8.webp",
  "assets/9.webp",
  "assets/10.webp",
  "assets/11.webp",
  "assets/12.webp",
  "assets/13.webp",
  "assets/14.webp",
  "assets/15.webp",
  "assets/16.webp",
  "assets/17.webp",
  "assets/18.webp",
  "assets/19.webp",
  "assets/20.webp",
  "assets/21.webp",
  "assets/22.webp",
  "assets/23.webp",
  "assets/24.webp",
  "assets/Mesa de trabajo 1.png",
  "assets/Mesa de trabajo 2.png",
  "assets/MSI-GeForce-RTX-4090-y-GeForce-RTX-4080-SUPRIM.jpg",
  "assets/Untitled-1.jpg",
  "assets/vga-20220920-6.jpg",
];

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticTeraflopsComponents).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    })
  );
});
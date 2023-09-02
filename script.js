function checkOnlineStatus() {
  const offlineModal = new bootstrap.Modal(document.getElementById('offlineModal'), {});
  const onlineModal = new bootstrap.Modal(document.getElementById('onlineModal'), {});

  // Verificar si la conexión se perdió en la sesión anterior
  const connectionLost = sessionStorage.getItem('connectionLost');

  if (!navigator.onLine) {
    // Si la conexión está desconectada, mostramos el modal offline y almacenamos el indicador de conexión perdida
    offlineModal.show();
    onlineModal.hide();
    sessionStorage.setItem('connectionLost', 'true');
  } else if (connectionLost === 'true') {
    // Si la conexión se restableció después de estar desconectado, mostramos el modal online si se perdió la conexión en la sesión anterior
    offlineModal.hide();
    onlineModal.show();
    sessionStorage.removeItem('connectionLost');
  }
}


window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);

// Llamar a la función para verificar el estado de conexión al cargar la página
checkOnlineStatus();

fetch('./json/productos.json')
  .then(response => response.json())
  .then(data => {
    const categorias = new Set(data.productos.map(producto => producto.categoria));
    const categoriaSelect = document.getElementById('categoriaSelect');

    // Llenar el select con las categorías
    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria;
      option.textContent = categoria;
      categoriaSelect.appendChild(option);
    });

    // Agregar evento de escucha para filtrar productos por categoría
    categoriaSelect.addEventListener('change', () => {
      const selectedCategoria = categoriaSelect.value;
      mostrarProductosPorCategoria(data.productos, selectedCategoria);
    });

    // Mostrar todos los productos al inicio
    mostrarProductosPorCategoria(data.productos, '');

    // Función para mostrar productos por categoría
    function mostrarProductosPorCategoria(productos, categoria) {
      const contenedorDeProductos = document.getElementById('productosContainer');
      contenedorDeProductos.innerHTML = '';

      const productosFiltrados = categoria
        ? productos.filter(producto => producto.categoria === categoria)
        : productos;

      productosFiltrados.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('col');

        const cardContent = document.createElement('div');
        cardContent.classList.add('card', 'h-100');

        const imagen = document.createElement('img');
        imagen.src = producto.imagen;
        imagen.classList.add('card-img-top');
        cardContent.appendChild(imagen);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const titulo = document.createElement('h2');
        titulo.innerText = producto.nombre;
        titulo.classList.add('card-title');
        cardBody.appendChild(titulo);

        const precio = document.createElement('h3');
        precio.innerText = producto.precio;
        precio.classList.add('card-text', 'precio');
        cardBody.appendChild(precio);

        const descripcion = document.createElement('p');
        descripcion.innerText = producto.descripcion;
        descripcion.classList.add('card-text');
        cardBody.appendChild(descripcion);

        const categoria = document.createElement('h5');
        categoria.innerText = producto.categoria;
        categoria.classList.add('card-text', 'categoria');
        cardBody.appendChild(categoria);

        const boton = document.createElement('button');
        boton.innerHTML = "Agregar a Carrito";
        boton.classList.add('btn', 'btn-primary', 'm-4');
        boton.addEventListener('click', () => {
          guardarEnCarrito(producto);
        });
        cardBody.appendChild(boton);

        cardContent.appendChild(cardBody);
        card.appendChild(cardContent);
        contenedorDeProductos.appendChild(card);
      });
      const bannerContainer = document.querySelector('.banner-container');
      bannerContainer.style.display = 'block';

      // Ocultar el banner flotante después de 10 segundos
      setTimeout(() => {
        bannerContainer.style.display = 'none';
      }, 1000); // 10000 milisegundos = 10 segundos.
    }

  })
  .catch(err => console.log("no anda nada", err));


function mostrarModal(productoNombre) {
  const alertaModal = new bootstrap.Modal(document.getElementById('alertaModal'), {});
  const alertaMensaje = document.getElementById('alertaMensaje');
  alertaMensaje.innerText = `Producto ${productoNombre} agregado al carrito`;
  alertaModal.show();
}

function guardarEnCarrito(producto) {
  if (!window.indexedDB) {
    console.log("IndexedDB no es compatible con el navegador.");
    return;
  }

  const request = window.indexedDB.open('carritoDB', 1);

  request.onerror = function (event) {
    console.log('Error al abrir la base de datos:', event.target.errorCode);
  };

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('carrito', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('nombre', 'nombre', { unique: false });
    objectStore.createIndex('precio', 'precio', { unique: false });
    objectStore.createIndex('descripcion', 'descripcion', { unique: false });
    objectStore.createIndex('imagen', 'imagen', { unique: false });
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['carrito'], 'readwrite');
    const objectStore = transaction.objectStore('carrito');

    const getRequest = objectStore.get(producto.id);

    getRequest.onsuccess = function (event) {
      const productoEnCarrito = event.target.result;

      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        const putRequest = objectStore.put(productoEnCarrito);
        putRequest.onsuccess = function (event) {
          console.log('Producto actualizado en el carrito:', event.target.result);
        };
      } else {
        producto.cantidad = 1;
        const putRequest = objectStore.put(producto);
        putRequest.onsuccess = function (event) {
          console.log('Producto agregado a carrito:', event.target.result);
        };
      }

      // Obtener todos los productos en el carrito y calcular la cantidad total del producto actual
      const getAllRequest = objectStore.getAll();
      getAllRequest.onsuccess = function (event) {
        const productosEnCarrito = event.target.result;
        const cantidadProductoActual = productosEnCarrito.reduce((total, productoCarrito) => {
          if (productoCarrito && productoCarrito.id === producto.id) {
            return total + productoCarrito.cantidad;
          }
          return total;
        }, 0);
        console.log(`Cantidad total del producto ${producto.nombre} en el carrito: ${cantidadProductoActual}`);
      };
    };

    transaction.oncomplete = function () {
      console.log('Transacción completada: Producto agregado a carrito.');
      db.close();
    };

    transaction.onerror = function (event) {
      console.log('Error en la transacción:', event.target.error);
    };
  };
  mostrarModal(producto.nombre);
}

function Almacenamiento() {
  let storage = {};

  function resetear() {
    storage = {};
  }

  function agregar(formulario) {
    Object.keys(formulario).forEach((key) => {
      storage[key] = formulario[key];
    });
  }

  function leer(propiedad) {
    return storage[propiedad];
  }

  return {
    resetear: resetear,
    agregar: agregar,
    leer: leer
  };
}

function mostrarDatos() {
  const nombre = document.getElementById("Nombre").value;
  const email = document.getElementById("Email").value;
  const comentario = document.getElementById("exampleFormControlTextarea1").value;

  console.log("Nombre:", nombre);
  console.log("Email:", email);
  console.log("Comentario:", comentario);

  const almacenamiento = new Almacenamiento();
  almacenamiento.agregar({
    nombreMostrado: nombre,
    emailMostrado: email,
    comentarioMostrado: comentario
  });

  document.getElementById("nombreMostrado").textContent = almacenamiento.leer("nombreMostrado");
  document.getElementById("emailMostrado").textContent = almacenamiento.leer("emailMostrado");
  document.getElementById("comentarioMostrado").textContent = almacenamiento.leer("comentarioMostrado");
}


if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then(res => console.log("service worker registered", res))
      .catch(err => console.log("service worker not registered", err));
  });
}

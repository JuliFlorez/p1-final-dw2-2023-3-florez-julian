function mostrarCarrito() {
    if (!window.indexedDB) {
      console.log("IndexedDB no es compatible con el navegador.");
      return;
    }
  
    const request = window.indexedDB.open('carritoDB', 1);
  
    request.onerror = function (event) {
      console.log('Error al abrir la base de datos:', event.target.errorCode);
    };
  
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['carrito'], 'readonly');
      const objectStore = transaction.objectStore('carrito');
      const requestGetAll = objectStore.getAll();
  
      requestGetAll.onsuccess = function (event) {
        const carrito = event.target.result;
  
        // Calcular el precio total del carrito
        const totalCarrito = carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  
        // Mostrar el precio total en el resumen de compra
        const totalCarritoElement = document.getElementById('total-carrito');
        totalCarritoElement.textContent = `$${totalCarrito.toFixed(2)}`;
  
        db.close();
      };
  
      transaction.onerror = function (event) {
        console.log('Error en la transacción:', event.target.error);
      };
    };
  }
  
  function realizarCompra(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const direccion = document.getElementById('direccion').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const vencimiento = document.getElementById('vencimiento').value;
    const cvv = document.getElementById('cvv').value;

    if (!nombre || !telefono || !email || !direccion || !tarjeta || !vencimiento || !cvv) {
      const mensajeError = document.getElementById('mensajeError');
      mensajeError.style.display = "block";
      return;
    }
  
    // Limpiar el carrito en IndexedDB
    if (!window.indexedDB) {
      console.log("IndexedDB no es compatible con el navegador.");
      return;
    }
  
    const request = window.indexedDB.open('carritoDB', 1);
  
    request.onerror = function (event) {
      console.log('Error al abrir la base de datos:', event.target.errorCode);
    };
  
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction(['carrito'], 'readwrite');
      const objectStore = transaction.objectStore('carrito');
      const requestClear = objectStore.clear();
  
      requestClear.onsuccess = function (event) {
        console.log('Carrito vaciado correctamente.');
        mostrarCarrito(); // Actualizar el precio total del carrito en el resumen después de vaciarlo
        
      };
  
      requestClear.onerror = function (event) {
        console.log('Error al vaciar el carrito:', event.target.error);
      };
  
      db.close();
      window.location.href = 'gracias.html';
    };
  }
  
  // Llamamos a la función mostrarCarrito() al cargar la página
  mostrarCarrito();
  
  // Agregamos el evento click al botón "Realizar Compra"
  const realizarCompraBtn = document.getElementById('realizar-compra-btn');
  realizarCompraBtn.addEventListener('click', realizarCompra);
  
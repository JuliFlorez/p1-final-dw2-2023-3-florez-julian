window.onload = function () {
  mostrarCarrito();
};

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

    // Verificar si el objeto de almacenamiento "carrito" existe en la base de datos
    if (!db.objectStoreNames.contains('carrito')) {
      console.log("El objeto de almacenamiento 'carrito' no existe en la base de datos.");
      return;
    }

    const transaction = db.transaction(['carrito'], 'readonly');
    const objectStore = transaction.objectStore('carrito');
    const requestGetAll = objectStore.getAll();

    requestGetAll.onsuccess = function (event) {
      const carrito = event.target.result;
      const carritoContainer = document.getElementById('carrito-container');

      // Limpiar el contenido existente del carrito antes de mostrar el carrito actualizado
      carritoContainer.innerHTML = '';

      const realizarCompraButton = document.getElementById('btnCheckout'); // Obtén la referencia al botón de realizar compra

      if (carrito.length === 0) {
        realizarCompraButton.disabled = true; // Deshabilitar el botón si el carrito está vacío
      } else {
        realizarCompraButton.disabled = false; // Habilitar el botón si hay productos en el carrito
      }

      if (carrito.length === 0) {
        const mensajeCarritoVacio = document.createElement('h2');
        mensajeCarritoVacio.textContent = 'No hay productos en el carrito';
        mensajeCarritoVacio.classList.add('mensaje-carrito-vacio'); // Aplicar la clase de estilo
        carritoContainer.appendChild(mensajeCarritoVacio);
        return;
      }


      let totalCarrito = 0; // Variable para almacenar la suma total del carrito

      carrito.forEach(function (producto) {
        const card = document.createElement('div');
        card.classList.add('card', 'w-50', 'mx-auto', 'my-4');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const nombreProducto = document.createElement('h5');
        nombreProducto.textContent = producto.nombre;
        nombreProducto.classList.add('card-title');

        const descripcionProducto = document.createElement('p');
        descripcionProducto.textContent = producto.descripcion;

        const precioProducto = document.createElement('p');
        precioProducto.textContent = `Precio: $${producto.precio.toFixed(2)}`;
        precioProducto.classList.add('precio-producto');

        const contadorProducto = document.createElement('span');
        contadorProducto.textContent = `Cantidad: ${producto.cantidad}`;
        contadorProducto.classList.add('contador-producto');

        const subtotalProducto = producto.precio * producto.cantidad;
        totalCarrito += subtotalProducto;

        const subtotalProductoElement = document.createElement('p');
        subtotalProductoElement.textContent = `Subtotal: $${subtotalProducto.toFixed(2)}`;
        subtotalProductoElement.classList.add('subtotal-producto');

        // Agregar botón de borrado
        const botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Borrar';
        botonBorrar.classList.add('boton-borrar');
        botonBorrar.classList.add('btn');
        botonBorrar.classList.add('btn-primary');
        botonBorrar.addEventListener('click', function () {
          borrarProducto(producto.id); // Llamada a la función para borrar el producto
          mostrarCarrito(); // Actualizar la lista de productos después de borrar uno
        });

        cardBody.appendChild(nombreProducto);
        cardBody.appendChild(descripcionProducto);
        cardBody.appendChild(precioProducto);
        cardBody.appendChild(contadorProducto);
        cardBody.appendChild(subtotalProductoElement);
        cardBody.appendChild(botonBorrar); // Agregar el botón al cardBody
        card.appendChild(cardBody);
        carritoContainer.appendChild(card);
      });

      const totalCarritoElement = document.createElement('h4');
      totalCarritoElement.textContent = `Total del Carrito: $${totalCarrito.toFixed(2)}`;
      totalCarritoElement.classList.add('total-carrito', 'text-center'); // Agrega la clase 'text-center'
      carritoContainer.appendChild(totalCarritoElement);
    };
    const botonBorrarCarrito = document.getElementById('borrar-carrito');
    botonBorrarCarrito.addEventListener('click', borrarCarrito);
  };

  // función para borrar todo el contenido del carrito
  function borrarCarrito() {
    const request = window.indexedDB.open('carritoDB', 1);

    request.onerror = function (event) {
      console.log('Error al abrir la base de datos:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      let transaction; // Declarar la variable transaction aquí

      transaction = db.transaction(['carrito'], 'readwrite');
      const objectStore = transaction.objectStore('carrito');
      const requestClear = objectStore.clear();

      requestClear.onsuccess = function (event) {
        console.log('Carrito vaciado');
        mostrarCarrito();
      };

      transaction.oncomplete = function () {
        console.log('Transacción completada: Carrito vaciado.');
        db.close();
      };

      transaction.onerror = function (event) {
        console.log('Error en la transacción:', event.target.error);
      };
    };
  }

}

// Función para borrar un producto del carrito
function borrarProducto(id) {
  const request = window.indexedDB.open('carritoDB', 1);

  request.onerror = function (event) {
    console.log('Error al abrir la base de datos:', event.target.errorCode);
  };

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(['carrito'], 'readwrite');
    const objectStore = transaction.objectStore('carrito');
    const requestDelete = objectStore.delete(id);

    requestDelete.onsuccess = function (event) {
      console.log('Producto borrado del carrito:', id);
    };

    transaction.oncomplete = function () {
      console.log('Transacción completada: Producto borrado.');
      db.close();
    };

    transaction.onerror = function (event) {
      console.log('Error en la transacción:', event.target.error);
    };
  };
}

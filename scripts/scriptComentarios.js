async function comentarios() {
  const response = await fetch('json/comentarios.json');
  const data = await response.json();
  return data.comentarios;
}

async function renderReviews() {
  const reviews = await comentarios();
  const reviewsContainer = document.getElementById('reviews-container');

  reviews.forEach((comentarios) => {
    const reviewElement = document.createElement('div');
    const reviewChild = document.createElement('div')
    reviewChild.classList.add('m-4')
    reviewElement.classList.add('card')
    reviewElement.classList.add('w-50')
    reviewElement.classList.add('m-auto')
    reviewElement.classList.add('my-4')
    reviewChild.innerHTML = `
        <h2>${comentarios.producto}</h2>
        <p>${comentarios.review}</p>
        <p>${comentarios.nombre}</p>
        <p>Calificacion: ${comentarios.calificacion}/100</p>
      `;
    reviewsContainer.appendChild(reviewElement);
    reviewElement.appendChild(reviewChild)
  });
}
let comentariosDiv = document.getElementById("comentarios");

function agregarComentario() {
  let producto = document.getElementById("Producto").value;
  let comentario = document.getElementById("comentariogrande").value;
  let nombre = document.getElementById("Nombre").value;
  let calificacion = document.getElementById("numero").value;
  
  let comentarioqueseve = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentarioqueseve.push({ "producto": producto, "nombre": nombre, "comentario": comentario, "calificacion": calificacion });
  
  localStorage.setItem("comentarios", JSON.stringify(comentarioqueseve));
  
  actualizarComentarios();
}

function actualizarComentarios() {
  comentariosDiv.innerHTML = ""; // Limpia el contenido previo del elemento

  let comentariosGuardados = JSON.parse(localStorage.getItem("comentarios")) || [];

  comentariosGuardados.forEach(function (comentario) {
    let div1 = document.createElement("div");
    div1.classList.add('m-4');
    
    let div2 = document.createElement("div"); // Elemento contenedor para cada reseña
    div2.classList.add('card');
    div2.classList.add('w-50');
    div2.classList.add('m-auto');
    div2.classList.add('my-4');
    
    let h2 = document.createElement("h2");
    h2.textContent = comentario.producto;
    
    let p = document.createElement("p");
    p.innerHTML = comentario.comentario + "<br>" + comentario.nombre + "<br>" + "Calificación: " + comentario.calificacion + "/100";
    
    div1.appendChild(h2);
    div1.appendChild(p);
    
    div2.appendChild(div1);
    comentariosDiv.appendChild(div2);
    
  });
}


window.addEventListener("load", function () {
  actualizarComentarios();
});



renderReviews();


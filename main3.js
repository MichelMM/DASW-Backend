var buscar =JSON.parse(localStorage.buscar);
var lista = document.getElementById("lista");
var HTMLUsuario = `<div class="media col-8 mt-2" id="modelo">
<div class="media-left align-self-center mr-3">
    <img class="rounded-circle" style="width: inherit;" src="${buscar.url}">
</div>
<div class="media-body">
    <h4>${buscar.nombre} ${buscar.apellido}</h4>
    <p>Correo: ${buscar.correo}</p>
    <p>Fecha de nacimiento: ${buscar.fecha} </p>
    <p>Sexo: ${(buscar.sexo=="M")?"Mujer":"Hombre"} </p>
    <p  type="password">password: ${buscar.password}</p>
    <p>iid:${buscar.iid} </p>
</div>
</div>`

lista.insertAdjacentHTML("beforebegin", HTMLUsuario);
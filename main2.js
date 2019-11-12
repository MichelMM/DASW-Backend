var lista = document.getElementById("lista");


var newalumnos = [];

var editar = document.getElementById("editar");
var formRemove = document.querySelectorAll("form")[0];
var formEditar = document.querySelectorAll("form")[1];

var j;

let pagination = document.getElementsByClassName("pagination")[0];
let btnsPagination = pagination.getElementsByClassName("page-link");
let pagina = document.getElementById("ul");

var actual = 0;

var alumnos = newalumnos;
document.getElementById("Previous").setAttribute("hidden", "");


document.addEventListener("DOMContentLoaded", loadDatos());


function llenarTabla() {
    var alumnos = localStorage.alm;
    alumnos = JSON.parse(alumnos);
    alumnos.forEach(function (element) {
        recibirPersona(element);
    });
    for (let l = 1; l <= Math.ceil((alumnos.length) / 2); l++) {
        var li = document.createElement("li");
        li.setAttribute("class", "page-item");
        li.appendChild(document.createElement("a"));
        li.firstChild.setAttribute("class", "page-link");
        li.firstChild.setAttribute("href", "#");
        li.firstChild.appendChild(document.createTextNode(l));
        pagina.insertBefore(li, document.getElementById("Next"));
    }
}

function loadDatos() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "https://users-dasw.herokuapp.com/api/users");
    xhr.setRequestHeader('x-auth', localStorage.token);
    xhr.setRequestHeader('x-user-token', localStorage.token);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            localStorage.setItem("alm", xhr.response);
            llenarTabla();
        }
    };
}

function recibirPersona(element) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://users-dasw.herokuapp.com/api/users/${element.correo}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-auth', localStorage.token);
    xhr.setRequestHeader('x-user-token', localStorage.token);
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            let newElement = JSON.parse(xhr.response);
            newalumnos.push(newElement);

            let HTMLuser = `<div class="media col-8 mt-2" id="modelo">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" style="width: inherit;"
                src="${newElement.url}">
        </div>
        <div class="media-body">
            <h4>${newElement.nombre}</h4>
            <p>Correo: ${newElement.correo}</p>
            <p>Fecha de nacimiento: ${newElement.fecha} </p>
            <p>Sexo: ${(newElement.sexo == "M")?"Mujer":"Hombre"} </p>
        </div>
        <div class="media-right align-self-center">
            <div class="row">
                <a href="#"  onclick = "buscarFuncion(event)"  name ="${newalumnos.length-1}"class="btn btn-primary edit"><i class="fas fa-search edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" onclick = "editarFuncion(event)"  name ="${newalumnos.length-1}" class="btn btn-primary mt-2" data-target="#editar" href="#" data-toggle="modal"><i class="fas fa-pencil-alt edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" onclick = "removeFuncion(event)" name ="${newalumnos.length-1}" class="btn btn-primary mt-2" data-target="#remove" data-toggle="modal"><i  class="fas fa-trash-alt  remove "></i></i></a>
            </div>
        </div>
    </div>
    `;
            lista.insertAdjacentHTML("beforeend", HTMLuser);
        }
    };
}


function editarFuncion(event) {
    let i = (event.path.length == 10) ? event.path[0].getAttribute("name") : event.path[1].getAttribute("name");
    j = i;
    document.getElementById('editar').getElementsByClassName('form-control')[0].value = newalumnos[i].nombre;
    document.getElementById('editar').getElementsByClassName('form-control')[1].value = newalumnos[i].apellido;
    document.getElementById('editar').getElementsByClassName('form-control')[2].value = newalumnos[i].correo;
    document.getElementById('editar').getElementsByClassName('form-control')[3].value = newalumnos[i].password;
    document.getElementById('editar').getElementsByClassName('form-control')[4].value = newalumnos[i].password;
    document.getElementById('editar').getElementsByClassName('form-control')[5].value = newalumnos[i].fecha;
    document.getElementById('editar').getElementsByClassName('form-control')[6].value = newalumnos[i].url;
    (newalumnos[i].sexo == "M") ? formEditar.getElementsByClassName("form-check-input")[0].checked = true: formEditar.getElementsByClassName("form-check-input")[1].checked = true;
}

function actualizarDatos() {
    event.preventDefault();
    if (document.getElementById('editar').getElementsByClassName('form-control')[3].value == document.getElementById('editar').getElementsByClassName('form-control')[4].value) {
        let Actualizado = {
            nombre: document.getElementById('editar').getElementsByClassName('form-control')[0].value,
            apellido: document.getElementById('editar').getElementsByClassName('form-control')[1].value,
            correo: document.getElementById('editar').getElementsByClassName('form-control')[2].value,
            password: document.getElementById('editar').getElementsByClassName('form-control')[3].value,
            fecha: document.getElementById('editar').getElementsByClassName('form-control')[5].value,
            url: document.getElementById('editar').getElementsByClassName('form-control')[6].value,
            sexo: (formEditar.getElementsByClassName("form-check-input")[0].checked == true) ? "M" : "H"
        }
        console.log(Actualizado);
        registrarFunction(Actualizado);
    } else {
        alert("Contraseñas no coinciden");
    }

}

function registrarFunction(datos) {
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', `https://users-dasw.herokuapp.com/api/users/${newalumnos[j].correo}`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-auth', localStorage.token);
    xhr.setRequestHeader('x-user-token', localStorage.token);
    xhr.send([JSON.stringify(datos)]);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText + 'Error, no se ha podido registrar el usuario');
        } else {
            alert(xhr.responseText + '\n El usuario ha sido actualizado con éxito');
            lista.innerHTML = '';
            newalumnos = [];
            loadDatos();
        }
    };
}

function removeFuncion(event) {
    let i = (event.path.length == 10) ? event.path[0].getAttribute("name") : event.path[1].getAttribute("name");
    j = i;
    document.getElementById('remove').getElementsByClassName('form-control')[0].value = newalumnos[i].nombre;
    document.getElementById('remove').getElementsByClassName('form-control')[1].value = newalumnos[i].apellido;
    document.getElementById('remove').getElementsByClassName('form-control')[2].value = newalumnos[i].correo;
    document.getElementById('remove').getElementsByClassName('form-control')[3].value = newalumnos[i].password;
    document.getElementById('remove').getElementsByClassName('form-control')[4].value = newalumnos[i].password;
    document.getElementById('remove').getElementsByClassName('form-control')[5].value = newalumnos[i].fecha;
    document.getElementById('remove').getElementsByClassName('form-control')[6].value = newalumnos[i].url;
    (newalumnos[i].sexo == "M") ? formRemove.getElementsByClassName("form-check-input")[0].checked = true: formRemove.getElementsByClassName("form-check-input")[1].checked = true;
}

formRemove.addEventListener("submit", function (event) {
    if (confirm("¿De verdad desea remover este usuario?")) {
        event.preventDefault();
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', `https://users-dasw.herokuapp.com/api/users/${newalumnos[j].correo}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('x-auth', localStorage.token);
        xhr.setRequestHeader('x-user-token', localStorage.token);
        xhr.send([JSON.stringify(newalumnos[j])]);
        xhr.onload = function () {
            if (xhr.status != 200) {
                alert(xhr.status + ': ' + xhr.statusText + 'Error, no se ha podido remover el usuario');
            } else {
                alert(xhr.responseText + '\n El usuario ha sido removido');
                lista.innerHTML = '';
                newalumnos = [];
                loadDatos();
            }
        };
    } else {
        formRemove.getElementsByClassName("btn btn-secondary mt-3").click();
    }
});

function buscarFuncion(event) {
    let i = (event.path.length == 10) ? event.path[0].getAttribute("name") : event.path[1].getAttribute("name");
    localStorage.setItem("buscar", JSON.stringify(newalumnos[i]));
    window.location.href = "/detalles.html";
}


pagination.addEventListener("click", function (event) {
    event.preventDefault();
    for (let l = Math.ceil((newalumnos.length) / 2); l > 0 ; l--) {
        if(Math.ceil((alumnos.length) / 2)<l){
            document.getElementsByClassName("page-item")[l].setAttribute("hidden","");
        }else{
            document.getElementsByClassName("page-item")[l].removeAttribute("hidden");
        }
    }
    llenarTablaPagination(event);
});





function llenarTablaPagination(event) {
    lista.innerHTML = '';
    if (event.path[0].outerText == "Next") {
        actual = actual + 2;
        for (let i = actual - 2; i < actual; i++) {
            if (alumnos[i] != undefined) {
                recibirPersonaPagnination(alumnos, i);
            }
        }
    } else if (event.path[0].outerText == "Previous") {
        actual = actual - 2;
        for (let i = actual - 2; i < actual; i++) {
            if (alumnos[i] != undefined) {
                recibirPersonaPagnination(alumnos, i);
            }
        }
    } else {
        actual = parseInt(event.path[0].outerText) * 2;
        for (let i = actual - 2; i < actual; i++) {
            if (alumnos[i] != undefined) {
                recibirPersonaPagnination(alumnos, i);
            }
        }
    }
    if (actual >= 2) {
        document.getElementById("Next").removeAttribute("hidden"); 
    } 
    if(actual <= alumnos.length){
        document.getElementById("Previous").removeAttribute("hidden");
    }
     if (actual == 2) {
        document.getElementById("Previous").setAttribute("hidden", "");
    } 
     if (actual >= alumnos.length) {
        document.getElementById("Next").setAttribute("hidden", "");
    }
}

alert("Si desea activar la paginación, busque un usuario o presione su boton de lugar relativo");

function recibirPersonaPagnination(element, index) {
    let newElement = element[index];
    let HTMLuser = `<div class="media col-8 mt-2" id="modelo">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" style="width: inherit;"
                src="${newElement.url}">
        </div>
        <div class="media-body">
            <h4>${newElement.nombre}</h4>
            <p>Correo: ${newElement.correo}</p>
            <p>Fecha de nacimiento: ${newElement.fecha} </p>
            <p>Sexo: ${(newElement.sexo == "M")?"Mujer":"Hombre"} </p>
        </div>
        <div class="media-right align-self-center">
            <div class="row">
                <a href="#"  onclick = "buscarFuncion(event)"  name ="${index}"class="btn btn-primary edit"><i class="fas fa-search edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" onclick = "editarFuncion(event)"  name ="${index}" class="btn btn-primary mt-2" data-target="#editar" href="#" data-toggle="modal"><i class="fas fa-pencil-alt edit  "></i></a>
            </div>
            <div class="row">
                <a href="#" onclick = "removeFuncion(event)" name ="${index}" class="btn btn-primary mt-2" data-target="#remove" data-toggle="modal"><i  class="fas fa-trash-alt  remove "></i></i></a>
            </div>
        </div>
    </div>
    `;
    lista.insertAdjacentHTML("beforeend", HTMLuser);
}

document.getElementsByClassName("btn btn-primary")[0].addEventListener('click',function(){
    if(document.getElementById("busqueda").value == ""){
        alumnos = newalumnos;
    }else{
        alumnos = [];
        newalumnos.forEach(function(element){
            if(element.nombre.toString().includes(document.getElementById("busqueda").value.toString())){
                alumnos.push(element);
            }
        });
    }
    actual = 0;
    pagination.click();
    
});
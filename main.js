localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNzE0MjkxIiwiaWF0IjoxNTczMzQxMjUyfQ.2WjY9Foq10Yygwr7le_cNO9K11U63DRrtXOZzK1Eqqk"
var registro = document.getElementById("registro");    
var formRegistro = registro.querySelector("form");

var modelId = document.getElementById("modelId");
var login = modelId.getElementsByClassName("container-fluid")[0];
var submitLogin = login.getElementsByTagName("button")[0];



formRegistro.querySelector('button').disabled = true;

formRegistro.addEventListener("change", function () {
    let notValid = formRegistro.querySelectorAll(":invalid");
    let valid = formRegistro.querySelectorAll(":valid");
    let password1 = document.getElementById('registro').getElementsByTagName('input')[3];
    let password2 = document.getElementById('registro').getElementsByTagName('input')[4];
    notValid.forEach(function (element){
        element.style.border = '1px solid #ff0000';
        formRegistro.querySelector('button').disabled = true;
    });
    if (notValid.length == 0 && password1.value == password2.value) {
        formRegistro.querySelector('button').disabled = false;
    }
    valid.forEach(function(element){
        element.style.border = '1px solid #ced4da';
    });
});

formRegistro.addEventListener("submit", function (event) {
    event.preventDefault();
    let formulario = {
        nombre: formRegistro.getElementsByClassName("form-control")[0].value,
        apellido: formRegistro.getElementsByClassName("form-control")[1].value,
        correo: formRegistro.getElementsByClassName("form-control")[2].value,
        password: formRegistro.getElementsByClassName("form-control")[3].value,
        fecha: formRegistro.getElementsByClassName("form-control")[5].value,
        sexo: (formRegistro.getElementsByClassName("form-check-input")[0].checked == true) ? formRegistro.getElementsByClassName("form-check-input")[0].value : formRegistro.getElementsByClassName("form-check-input")[1].value,
        url: formRegistro.getElementsByClassName("form-control")[6].value
    };
    registrarDatos(formulario);
});

function registrarDatos(datos) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "https://users-dasw.herokuapp.com/api/users");
    xhr.setRequestHeader('x-auth', localStorage.token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send([JSON.stringify(datos)]);
    xhr.onload = function () {
        if (xhr.status != 201) {
            alert(xhr.status + ': ' + xhr.statusText  + 'Error, no se ha podido registrar el usuario');
        } else {
            alert(xhr.responseText+'\n El usuario ha sido registrado con éxito');
        }
    };
}


submitLogin.addEventListener("click",function(){
    let loginData = {
        correo: login.getElementsByClassName("col-10 form-control")[0].value,
        password: login.getElementsByClassName("col-10 form-control")[1].value
    }

    loginDatos(loginData);
});

function loginDatos(datos){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', "https://users-dasw.herokuapp.com/api/login");
    xhr.setRequestHeader('x-auth', localStorage.token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send([JSON.stringify(datos)]);
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText + '\n Error, correo o contraseña invalidos');
        } else {
            localStorage.token = JSON.parse(xhr.response).token;
            window.location.href = "https://michelmm.github.io/DASW-Backend/consultas.html";
        }
    }; 
}





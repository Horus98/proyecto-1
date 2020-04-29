var boton = document.getElementById("botonCalcular");
var velocidad = document.getElementById("velocidadDescarga");
var tamanio = document.getElementById("tamArchivo");
var tablaValoresAnterioresBody = document.getElementById("tablaValoresAnterioresBody");


const valoresAlmacenados = 5;
const clave = "claveAlmacenamiento";

// Velocidades del redes moviles expresadas en MBps.
const velocidad5G = 128
const velocidad4G = 3.75
const velocidad3G = 0.625
init();


// Obtiene el valor del radio button checkeado dado un formulario.
function obtenerValorCheckeado(formulario) {
	for (var i = 0; i < formulario.length; i++) {
		if (formulario[i].checked) 
			break;
		}
  return formulario[i].value ;
}

// Calcula el tiempo requerido para descargar un archivo de tamaño "tam" a una velocidad "vel".
function calcularTiempo(tam,vel){
	var time = tam / vel;
	var hours = Math.floor( time / 3600 );  
	var minutes = Math.floor( (time % 3600) / 60 );
	var seconds = time % 60;
   
  //Anteponiendo un 0 a los minutos si son menos de 10 
  minutes = minutes < 10 ? '0' + minutes : minutes;
   
  //Anteponiendo un 0 a los segundos si son menos de 10 
  seconds = seconds < 10 ? '0' + seconds : seconds;
   
  seconds = Math.floor(seconds);
  var result = hours + " Horas " + minutes + " Minutos " + seconds +" Segundos" ;
  return result;
}

// Verifica que la entrada sea valida.
function verificarEntrada(entrada){
	
	for (var i = 0; i < entrada.length; i++){
		if(!(entrada[i].match(/[0-9]/g)))
			return false;
	}
	return true;
}

boton.onclick = function() {
	var formularioDescarga = document.forms[0].descarga;
	var formularioPeso = document.forms[1].peso;
	var vel = obtenerValorCheckeado(formularioDescarga);
	var tam = obtenerValorCheckeado(formularioPeso);
	var velocidadValue = velocidad.value;
	var tamanioValue = tamanio.value;
	var valoresVacios = velocidadValue == "" || tamanioValue == "";
	var noSonNumeros = !(verificarEntrada(Array.from(velocidadValue))) || !(verificarEntrada(Array.from(tamanioValue)));

	if (valoresVacios){
		alert("Por favor complete ambos campos")
		velocidad.value = "";
		tamanio.value = "";
	}
	else{
		if(noSonNumeros){
			alert("Por favor recuerde que debe ingresar numeros enteros")
			velocidad.value = "";
			tamanio.value = "";
		}
	
	else{
		vel = velocidadValue * vel;
		vel = vel/8;
	
		tam = tamanioValue * tam;
		
		var tiempoVelocidadUsuario = calcularTiempo(tam,vel);
		var tiempoVelocidad5G = calcularTiempo(tam,velocidad5G);
		var tiempoVelocidad4G = calcularTiempo(tam,velocidad4G);
		var tiempoVelocidad3G = calcularTiempo(tam,velocidad3G);

		var cadenaStorage = armarCadena(vel,tam,tiempoVelocidadUsuario);
		storeCadena(cadenaStorage);

		document.getElementById("vel3g").innerHTML = tiempoVelocidad3G;
		document.getElementById("vel4g").innerHTML = tiempoVelocidad4G;
		document.getElementById("vel5g").innerHTML = tiempoVelocidad5G;
		document.getElementById("tuVelocidad").innerHTML = tiempoVelocidadUsuario;
		actualizarTablaValores();
		velocidad.value = "";
		tamanio.value = "";
	}

}
}

// Almacena una cadena en el localStorage.
function storeCadena(cadena) {  
	var cadenaArray = getCadenas();
	if(cadenaArray !== null) {
		insertar(cadenaArray,cadena);
		localStorage.setItem(clave, JSON.stringify(cadenaArray));
	} else
		alert("El localStorage no está habilitado en su navegador");   
}

// Devuelve un arreglo con las cadenas almacenadas en el localStorage
function getCadenas() {
    if (typeof(Storage) !== "undefined") {  
        var cadenaArray = JSON.parse(localStorage.getItem(clave));
        if(cadenaArray == null)
            cadenaArray = [];
        return cadenaArray;
    }
    return null;
}

// Almacena la cadena en el arreglo. En caso de que se almacenen mas del permitido se las elimina.
function insertar(array,cadena){
	array.push(cadena);
    while(array.length > valoresAlmacenados)
        array.shift();
}

// Inicializa la tablaValoresAnteriores.
function init(){
	actualizarTablaValores();
	actualizarTema();
}

// Arma la cadena para luego ser mostrada en la tablaValoresAnteriores.
function armarCadena(vel,tam,tiempoVelocidadUsuario) {
	vel = vel.toFixed(1);
	tam = tam.toFixed(1);
	var velocidad = "Velocidad: "+vel+"MBps || ";
	var tamanio = "";
	if( tam > 1024){
		tam = (tam / 1024).toFixed(1);
		tamanio = "Tamaño: "+tam+"GB || ";
	}
	else
		tamanio = "Tamaño: "+tam+"MB || ";
	var cadena = velocidad + tamanio +"Tiempo: " + tiempoVelocidadUsuario;
	return cadena;
}

function almacenarCadena(arr){
	localStorage.setItem(clave,arr);
}

// Actualiza la tabla donde se visualizan los valores del localStorage.
function actualizarTablaValores (){
	var cadenaArray = getCadenas();
	if(cadenaArray !== null){
		while(tablaValoresAnterioresBody.hasChildNodes()){
		tablaValoresAnterioresBody.removeChild(tablaValoresAnterioresBody.firstChild);
		}

		for(var i = cadenaArray.length -1; i >= 0 ; i--){
			var tr = document.createElement('TR');
			tr.setAttribute("class","fila");
			var td = document.createElement('TD');
			td.setAttribute("class","columna");
			td.appendChild(document.createTextNode(cadenaArray[i]));
			tr.appendChild(td);
			tablaValoresAnterioresBody.appendChild(tr);
		}
}
}

const btnSwitch = document.getElementById("switch");



btnSwitch.onclick = function () {
	var classList  = document.body.classList;
	classList.toggle('dark');
	// Guardamos en el localStorage.
	if (classList.contains('dark')){
		localStorage.setItem('dark-mode','true');
	}
	else
		localStorage.setItem('dark-mode','false');

}

function actualizarTema () {
	var classList = document.body.classList;
	if(localStorage.getItem('dark-mode') === 'true')
		classList.add('dark');
	else
		classList.remove('dark');
}
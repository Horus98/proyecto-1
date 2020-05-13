var boton = getElement("botonCalcular");
var btnCleanStorage = getElement("cleanStorage");
var velocidad = getElement("velocidadDescarga");
var tamanio = getElement("tamArchivo");
var tablaValoresAnterioresBody = getElement("tablaValoresAnterioresBody");

const valoresAlmacenados = 5;
const clave = "claveAlmacenamiento";

// Velocidades del redes moviles expresadas en MBps.
const velocidad5G = 128
const velocidad4G = 3.75
const velocidad3G = 0.625
init();


// Obtiene el elemento del html por su ID.
function getElement(id) {
	return document.getElementById(id);
}

// Inserta un valor en un elemento del html segun el id
function insertElement(id,elemento){
	getElement(id).innerHTML = elemento
}

// Limpia los input text 
function cleanInputText() {
	velocidad.value = "";
	tamanio.value = "";
}

// Obtiene el valor del radio button checkeado dado un formulario.
function obtenerValorCheckeado(formulario) {
	for (var i = 0; i < formulario.length; i++) {
		if (formulario[i].checked) 
			break;
		}
  return formulario[i] ;
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
  var result = formatNumber(hours) + " Horas " + minutes + " Minutos " + seconds +" Segundos" ;
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

// Crea una alerta personalizada.
function alertar(texto){
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text: texto,
		timer: 2000,
		confirmButtonColor: '#d33',
		timerProgressBar: true,
	  })

}

// Alerta segun el error.
function alertarErrores (valoresVacios, noSonNumeros) {
	if (valoresVacios){
		alertar('Complete ambos campos!')
		cleanInputText();
	}
	else{
		if(noSonNumeros){
			alertar('Por favor recuerde que debe ingresar numeros enteros!')
			cleanInputText();
		}
	}
}

// Verifica que la entrada sean numeros validos.
function noSonNumeros(velocidad,tamanio){
	return !(verificarEntrada(Array.from(velocidad))) || !(verificarEntrada(Array.from(tamanio)));
}

// Verifica que la entrada no sean valores vacios.
function valoresVacios(velocidad,tamanio){
	return velocidad == "" || tamanio == "";
}


boton.onclick = function() {
	var velForm = obtenerValorCheckeado(document.forms[0].descarga);
	var tamForm = obtenerValorCheckeado(document.forms[1].peso);
	var vel = velForm.value;
	var tam = tamForm.value;
	var velocidadValue = velocidad.value;
	var tamanioValue = tamanio.value;
	var hayQueAlertar = valoresVacios(velocidadValue,tamanioValue) || noSonNumeros(velocidadValue,tamanioValue) ;

	if (hayQueAlertar)
		alertarErrores(valoresVacios(velocidadValue,tamanioValue), noSonNumeros(velocidadValue,tamanioValue));
	
	else{
		vel = (velocidadValue * vel) / 8;
		tam = tamanioValue * tam;

		let tiempoVelocidadUsuario = calcularTiempo(tam,vel);	
		storeCadena(armarCadena(velocidadValue,tamanioValue,tiempoVelocidadUsuario,velForm.id,tamForm.id));

		insertElement("vel3g",calcularTiempo(tam,velocidad3G));
		insertElement("vel4g",calcularTiempo(tam,velocidad4G));
		insertElement("vel5g",calcularTiempo(tam,velocidad5G));
		insertElement("tuVelocidad",tiempoVelocidadUsuario);

		actualizarTablaValores();
		cleanInputText();
	}

}

function formatNumber(number){
	return new Intl.NumberFormat("de-ES").format(number);
}


// Almacena una cadena en el localStorage.
function storeCadena(cadena) {  
	var cadenaArray = getCadenas();
	if(cadenaArray !== null) {
		insertar(cadenaArray,cadena);
		localStorage.setItem(clave, JSON.stringify(cadenaArray));
	} else
		alertar("El localStorage no está habilitado en su navegador");   
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
function armarCadena(vel,tam,tiempoVelocidadUsuario,unidadVel,unidadTam) {
		var velocidad = "Velocidad: " +formatNumber(vel) + unidadVel + " || ";
		var tamanio = "Tamaño: " + formatNumber(tam) + unidadTam + " || ";
	return velocidad + tamanio +"Tiempo: " + tiempoVelocidadUsuario;;
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

// Limplia la tabla de valores anteriormente ingresados.
btnCleanStorage.onclick = function () {
	localStorage.removeItem(clave);
	actualizarTablaValores();
}



const btnSwitch = getElement("switch");



btnSwitch.onclick = function () {
	var classList  = document.body.classList;
	classList.toggle('light');
	// Guardamos en el localStorage.
	if (classList.contains('light')){
		localStorage.setItem('dark-mode','true');
	}
	else
		localStorage.setItem('dark-mode','false');

}

function actualizarTema () {
	var classList = document.body.classList;
	if(localStorage.getItem('dark-mode') === 'true')
		classList.add('light');
	else
		classList.remove('light');
}
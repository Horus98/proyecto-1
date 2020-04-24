var boton = document.getElementById("botonCalcular");
var velocidad = document.getElementById("velocidadDescarga");
var tamanio = document.getElementById("tamArchivo");
// Velocidades del redes moviles expresadas en MBps.
const velocidad5G = 128
const velocidad4G = 3.75
const velocidad3G = 0.625
// Obtiene el valor del radio button checkeado dado un formulario.
function obtenerValorCheckeado(formulario) {
	for (var i = 0; i < formulario.length; i++) {
		if (formulario[i].checked) 
			break;
		}
  return formulario[i].value ;
}

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
	var valoresIncorrectos = velocidadValue == "" || tamanioValue == "" || 
	!(verificarEntrada(Array.from(velocidadValue))) || !(verificarEntrada(Array.from(tamanioValue)));

	if (valoresIncorrectos){
		alert("Por favor Ingrese los valores requeridos")
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

		document.getElementById("vel3g").innerHTML = tiempoVelocidad3G;
		document.getElementById("vel4g").innerHTML = tiempoVelocidad4G;
		document.getElementById("vel5g").innerHTML = tiempoVelocidad5G;
		document.getElementById("tuVelocidad").innerHTML = tiempoVelocidadUsuario;

		velocidad.value = "";
		tamanio.value = "";
	}

} 
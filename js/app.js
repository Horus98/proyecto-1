var boton = document.getElementById("botonCalcular");
var velocidad = document.getElementById("velocidadDescarga");
var tamanio = document.getElementById("tamArchivo");
// Obtiene el valor del radio button checkeado dado un formulario.
function obtenerValorCheckeado(formulario) {
	for (var i = 0; i < formulario.length; i++) {
		if (formulario[i].checked) 
			break;
		}
  return formulario[i].value ;
}


boton.onclick = function() {
	var formularioDescarga = document.forms[0].descarga;
	var formularioPeso = document.forms[1].peso;
	var vel = obtenerValorCheckeado(formularioDescarga);
	var tam = obtenerValorCheckeado(formularioPeso);
  
	vel = velocidad.value * vel;
  
	vel = vel/8;
  
  tam = tamanio.value * tam;
  
  var time = tam/vel;
  var hours = Math.floor( time / 3600 );  
  var minutes = Math.floor( (time % 3600) / 60 );
  var seconds = time % 60;
 
//Anteponiendo un 0 a los minutos si son menos de 10 
minutes = minutes < 10 ? '0' + minutes : minutes;
 
//Anteponiendo un 0 a los segundos si son menos de 10 
seconds = seconds < 10 ? '0' + seconds : seconds;
 
seconds = Math.floor(seconds);
var result = hours + ":" + minutes + ":" + seconds;
alert(result);

} 
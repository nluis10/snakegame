const canvasWidth = 560;
const canvasHeight = 420;
const pantalla = document.getElementById("graficoMobile");
const botonJugar = document.getElementById("jugar");
const botonPuntaje = document.getElementById("puntaje");
const selectNivel = document.getElementById("nivel");
const pincel = pantalla.getContext("2d");

let xInicial = 0;
let yInicial = 0;
const cuadroWidth = 35;
const cuadroHeight = 35;
const cuadroAleatorioWidth = canvasWidth - cuadroWidth;
const cuadroAleatorioHeight = canvasHeight - cuadroHeight;
let intervalDerecha;
let intervalIzquierda;
let intervalArriba;
let intervalAbajo;
const cantidad = 4;
let velocidad = 0;
let direccionDerecha = false;
let direccionIzquierda = false;
let direccionArriba = false;
let direccionAbajo = false;
let agregarPorMovimiento = true;
let agregarPortecla = true;
let puntaje = 0;

const xAleatorioInicial = calcularNumeroBase(cuadroWidth, cuadroAleatorioWidth, cuadroWidth);
const yAleatorioInicial = calcularNumeroBase(cuadroHeight, cuadroAleatorioHeight, cuadroHeight);

const cuadroAleatorio = { x: xAleatorioInicial, y: yAleatorioInicial };
const serpiente = [];

function culebraInicial() {
  serpiente.length = 0;
  for (let i = 0; i < cantidad; i++) {
    serpiente.push({ x: xInicial + cuadroWidth * i, y: yInicial });
  }
}

function calcularNumeroBase(min, max, base) {
  let num = Math.floor(Math.random() * (max + 1 - min) + min);
  while (num % base !== 0 && num > 0) {
    //console.log("CAMBIAR NUMERO BASE OTRA VEZ");
    num = Math.floor(Math.random() * (max + 1 - min) + min);
  }
  return num;
}

function comidaEnSerpiente() {
  for (let coordenadaCuadro of serpiente) {
    if (coordenadaCuadro.x === cuadroAleatorio.x && coordenadaCuadro.y === cuadroAleatorio.y) {
      //console.log("Comida en serpiente")
      return true;
      break;
    }
  }
  return false;
}

function moverCuadroAleatorio() {
  cuadroAleatorio.x = calcularNumeroBase(0, cuadroAleatorioWidth, cuadroWidth);
  cuadroAleatorio.y = calcularNumeroBase(0, cuadroAleatorioHeight, cuadroHeight);

  while (comidaEnSerpiente() === true) {
    //console.log("MOVER PORQUE QUEDO EN LA SERPIENTE");
    cuadroAleatorio.x = calcularNumeroBase(0, cuadroAleatorioWidth, cuadroWidth);
    cuadroAleatorio.y = calcularNumeroBase(0, cuadroAleatorioHeight, cuadroHeight);
  }

  pintarCuadroAleatorio();
}

function chocarConSerpiente() {
  const tamano = serpiente.length;
  const cabeza = { x: serpiente[tamano - 1].x, y: serpiente[tamano - 1].y };
  //console.log(cabeza);

  for (let i = 0; i <= tamano - 2; i++) {
    //console.log(serpiente[i]);
    if (cabeza.x === serpiente[i].x && cabeza.y === serpiente[i].y) {
      //console.log("CHOCO CON LA SERPIENTE");
      reiniciar();
      break;
    }
  }
}

function pintarCuadroAleatorio() {
  pincel.fillStyle = "crimson";
  pincel.strokeStyle = "black";

  pincel.fillRect(cuadroAleatorio.x, cuadroAleatorio.y, cuadroWidth, cuadroHeight);
  pincel.strokeRect(cuadroAleatorio.x, cuadroAleatorio.y, cuadroWidth, cuadroHeight);
}

function agregarCuadroAtrapadoPorMovimiento(direccion, velocidad) {
  if (agregarPorMovimiento) {
    agregarPortecla = false;
    //console.log("POR MOVIMIENTO");
    agregarCuadroAtrapado(direccion, velocidad);
  }
}

function agregarCuadroAtrapadoPorTecla(direccion, velocidad) {
  if (agregarPortecla) {
    agregarPorMovimiento = false;
    //console.log("POR TECLA");
    agregarCuadroAtrapado(direccion, velocidad);
  }
}

async function agregarCuadroAtrapado(tecla, segundos) {
  //console.log(velocidad - segundos)
  const cantidadActualAtr = serpiente.length;
  let xAlt = cuadroAleatorio.x;
  let yAlt = cuadroAleatorio.y;

  switch (tecla) {
    case "ArrowRight":
      if (direccionDerecha) {
        const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad - segundos));
        serpiente.push({ x: xAlt + cuadroWidth, y: yAlt });
        chocarConSerpiente();
        pintarSerpiente("ArrowRight");
        moverCuadroAleatorio();
        if (serpiente[cantidadActualAtr].x > canvasWidth - cuadroWidth) {
          reiniciar();
        } else {
          moverSerpiente({ key: "ArrowRight" });
        }
        limpiarMovimientoDerecha();
      }
      break;
    case "ArrowLeft":
      if (direccionIzquierda) {
        const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad - segundos));
        serpiente.push({ x: xAlt - cuadroWidth, y: yAlt });
        chocarConSerpiente();
        pintarSerpiente("ArrowLeft");
        moverCuadroAleatorio();
        if (serpiente[cantidadActualAtr].x < 0) {
          reiniciar();
        } else {
          moverSerpiente({ key: "ArrowLeft" });
        }
        limpiarMovimientoIzquierda();
      }
      break;
    case "ArrowUp":
      if (direccionArriba) {
        const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad - segundos));
        serpiente.push({ x: xAlt, y: yAlt - cuadroHeight });
        chocarConSerpiente();
        pintarSerpiente("ArrowUp");
        moverCuadroAleatorio();
        if (serpiente[cantidadActualAtr].y < 0) {
          reiniciar();
        } else {
          moverSerpiente({ key: "ArrowUp" });
        }
        limpiarMovimientoArriba();
      }
      break;
    case "ArrowDown":
      if (direccionAbajo) {
        const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad - segundos));
        serpiente.push({ x: xAlt, y: yAlt + cuadroHeight });
        chocarConSerpiente();
        pintarSerpiente("ArrowDown");
        moverCuadroAleatorio();
        if (serpiente[cantidadActualAtr].y > canvasHeight - cuadroHeight) {
          reiniciar();
        } else {
          moverSerpiente({ key: "ArrowDown" });
        }
        limpiarMovimientoAbajo();
      }
      break;
  }
}

async function mantenerMovimientoDespuesDeAtraparComida(direccion) {
  limpiarIntervalos();
  //Este Promise con  SetTimeout es para esperar unos segundos,
  //si no se presiona una tecla al atrapar la comida se activa
  //el movimiento en la misma direccion que viene.
  const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad));
  //console.log(agregarPorMovimiento);
  switch (direccion) {
    case "ArrowRight":
      //console.log("DERECHA EN PINTAR SERPIENTE");
      direccionDerecha = true;
      agregarCuadroAtrapadoPorMovimiento(direccion, velocidad);
      break;

    case "ArrowLeft":
      //console.log("IZQUIERDA EN PINTAR SERPIENTE");
      direccionIzquierda = true;
      agregarCuadroAtrapadoPorMovimiento(direccion, velocidad);
      break;

    case "ArrowUp":
      //console.log("ARRIBA EN PINTAR SERPIENTE");
      direccionArriba = true;
      agregarCuadroAtrapadoPorMovimiento(direccion, velocidad);
      break;

    case "ArrowDown":
      //console.log("ABAJO EN PINTAR SERPIENTE");
      direccionAbajo = true;
      agregarCuadroAtrapadoPorMovimiento(direccion, velocidad);
      break;
  }
}

function sumarPuntaje() {
  puntaje++;
  botonPuntaje.innerHTML = puntaje;
}

function pintarSerpiente(direccion) {
  //console.log(serpiente.length);
  pincel.fillStyle = "deepskyblue";
  pincel.strokeStyle = "black";

  for (const posicion of serpiente) {
    pincel.fillRect(posicion.x, posicion.y, cuadroWidth, cuadroHeight);
    pincel.strokeRect(posicion.x, posicion.y, cuadroWidth, cuadroHeight);
  }
  //console.log("serpiente pintada")
  const cantidadActual = serpiente.length;
  //Verificar si la serpiente esta en la comida
  if (serpiente[cantidadActual - 1].x === cuadroAleatorio.x && serpiente[cantidadActual - 1].y === cuadroAleatorio.y) {
    //console.log("ATRAPADO");
    sumarPuntaje();
    mantenerMovimientoDespuesDeAtraparComida(direccion);
  }
}

function limpiarPantalla() {
  //console.log("pantalla borrada")
  pincel.clearRect(0, 0, canvasWidth, canvasHeight);
  //pintarCuadroAleatorio();
}

function moverSerpienteDerecha() {
  const cantidadActualDer = serpiente.length;
  let xActual = serpiente[cantidadActualDer - 1].x;
  let yActual = serpiente[cantidadActualDer - 1].y;
  //Asignando la coordenada a donde va el ultimo cuadro
  serpiente[cantidadActualDer - 1] = { x: xActual + cuadroWidth, y: yActual };
  //Asignando a los primeros cuadros la posicion del siguiente
  for (let i = 0; i < cantidadActualDer - 2; i++) {
    serpiente[i] = serpiente[i + 1];
  }
  //Asignando al penultimo cuadro la posicion del ultimo
  serpiente[cantidadActualDer - 2] = { x: xActual, y: yActual };

  limpiarPantalla();
  pintarCuadroAleatorio();
  pintarSerpiente("ArrowRight");

  //Si choca con el limite reiniciar el juego
  if (serpiente[cantidadActualDer - 1].x > canvasWidth - cuadroWidth) {
    reiniciar();
  }

  chocarConSerpiente();
}

function moverSerpienteIzquierda() {
  const cantidadActualIzq = Object.keys(serpiente).length;
  let xActual = serpiente[cantidadActualIzq - 1].x;
  let yActual = serpiente[cantidadActualIzq - 1].y;
  //Asignando la coordenada a donde va el ultimo cuadro
  serpiente[cantidadActualIzq - 1] = { x: xActual - cuadroWidth, y: yActual };
  //Asignando a los primeros cuadros la posicion del siguiente
  for (let i = 0; i < cantidadActualIzq - 2; i++) {
    serpiente[i] = serpiente[i + 1];
  }
  //Asignando al penultimo cuadro la posicion del ultimo
  serpiente[cantidadActualIzq - 2] = { x: xActual, y: yActual };

  limpiarPantalla();
  pintarCuadroAleatorio();
  pintarSerpiente("ArrowLeft");

  //Si choca con el limite reiniciar el juego
  if (serpiente[cantidadActualIzq - 1].x < 0) {
    reiniciar();
  }

  chocarConSerpiente();
}

function moverSerpienteArriba() {
  const cantidadActualArr = Object.keys(serpiente).length;
  let xActual = serpiente[cantidadActualArr - 1].x;
  let yActual = serpiente[cantidadActualArr - 1].y;
  //Asignando coordenadas del ultimo cuadro
  serpiente[cantidadActualArr - 1] = { x: xActual, y: yActual - cuadroHeight };
  //Asignando a los primeros cuadros la posicion del siguiente
  for (let i = 0; i < cantidadActualArr - 2; i++) {
    serpiente[i] = serpiente[i + 1];
  }
  //Asignando al penultimo cuadro la posicion del ultimo
  serpiente[cantidadActualArr - 2] = { x: xActual, y: yActual };

  limpiarPantalla();
  pintarCuadroAleatorio();
  pintarSerpiente("ArrowUp");

  //Si choca con el limite reiniciar el juego
  if (serpiente[cantidadActualArr - 1].y < 0) {
    reiniciar();
  }

  chocarConSerpiente();
}

function moverSerpienteAbajo() {
  const cantidadActualAba = Object.keys(serpiente).length;
  let xActual = serpiente[cantidadActualAba - 1].x;
  let yActual = serpiente[cantidadActualAba - 1].y;
  //Asignando coordenadas del ultimo cuadro
  serpiente[cantidadActualAba - 1] = { x: xActual, y: yActual + cuadroHeight };
  //Asignando a los primeros cuadros la posicion del siguiente
  for (let i = 0; i < cantidadActualAba - 2; i++) {
    serpiente[i] = serpiente[i + 1];
  }
  //Asignando al penultimo cuadro la posicion del ultimo
  serpiente[cantidadActualAba - 2] = { x: xActual, y: yActual };

  limpiarPantalla();
  pintarCuadroAleatorio();
  pintarSerpiente("ArrowDown");

  //Si choca con el limite reiniciar el juego
  if (serpiente[cantidadActualAba - 1].y > canvasHeight - cuadroHeight) {
    reiniciar();
  }

  chocarConSerpiente();
}

function limpiarIntervalos() {
  clearInterval(intervalDerecha);
  clearInterval(intervalIzquierda);
  clearInterval(intervalArriba);
  clearInterval(intervalAbajo);
}

function reiniciar() {
  limpiarIntervalos();
  limpiarPantalla();
  culebraInicial();
  pintarSerpiente("ArrowRight");
  direccionDerecha = false;
  direccionIzquierda = false;
  direccionArriba = false;
  direccionAbajo = false;
  selectNivel.disabled = false;
  botonJugar.disabled = false;
  mensajeJuegoFinalizado();
}

async function moverSerpiente(e) {
  const cantidadActual = serpiente.length;
  //console.log(e.key)
  if (serpiente[cantidadActual - 1].x === cuadroAleatorio.x && serpiente[cantidadActual - 1].y === cuadroAleatorio.y) {
    //Para desactivar el switch que se ejecuta despues del setTimeout
    //en la funcion pintarSerpiente porque ya no hace falta,
    //el movimiento se va a activar con la pulsacion del teclado.
    //agregarPorMovimiento = false;
    agregarCuadroAtrapadoPorTecla(e.key, velocidad * 0.25);
    //agregarCuadroAtrapado(e.key, velocidad * 0.25);
  } else {
    switch (e.key) {
      case "ArrowRight":
        //console.log("TECLA DERECHA");
        if (direccionDerecha) {
          limpiarIntervalos();
          intervalDerecha = setInterval(moverSerpienteDerecha, velocidad);
          const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad));
          limpiarMovimientoDerecha();
          agregarPorMovimiento = true;
          agregarPortecla = true;
        }
        break;

      case "ArrowLeft":
        //console.log("TECLA IZQUIERDA");
        if (direccionIzquierda) {
          limpiarIntervalos();
          intervalIzquierda = setInterval(moverSerpienteIzquierda, velocidad);
          const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad));
          limpiarMovimientoIzquierda();
          agregarPorMovimiento = true;
          agregarPortecla = true;
        }
        break;

      case "ArrowUp":
        //console.log("TECLA ARRIBA");
        if (direccionArriba) {
          limpiarIntervalos();
          intervalArriba = setInterval(moverSerpienteArriba, velocidad);
          const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad));
          limpiarMovimientoArriba();
          agregarPorMovimiento = true;
          agregarPortecla = true;
        }
        break;

      case "ArrowDown":
        //console.log("TECLA ABAJO");
        if (direccionAbajo) {
          limpiarIntervalos();
          intervalAbajo = setInterval(moverSerpienteAbajo, velocidad);
          const respuestaTrue = await new Promise((resolve) => setTimeout(() => resolve(true), velocidad));
          limpiarMovimientoAbajo();
          agregarPorMovimiento = true;
          agregarPortecla = true;
        }
        break;
    }
  }
}

function limpiarMovimientoDerecha() {
  direccionDerecha = false;
  direccionIzquierda = false;
  direccionArriba = true;
  direccionAbajo = true;
}

function limpiarMovimientoIzquierda() {
  direccionDerecha = false;
  direccionIzquierda = false;
  direccionArriba = true;
  direccionAbajo = true;
}

function limpiarMovimientoArriba() {
  direccionDerecha = true;
  direccionIzquierda = true;
  direccionArriba = false;
  direccionAbajo = false;
}

function limpiarMovimientoAbajo() {
  direccionDerecha = true;
  direccionIzquierda = true;
  direccionArriba = false;
  direccionAbajo = false;
}

function jugar() {
  direccionDerecha = true;
  puntaje = 0;
  botonPuntaje.innerHTML = puntaje;
  selectNivel.disabled = true;
  botonJugar.disabled = true;
  //console.log("JUGAR");
  switch (selectNivel.value) {
    case "FACIL":
      velocidad = 250;
      break;

    case "NORMAL":
      velocidad = 125;
      break;

    case "DIFICIL":
      velocidad = 62.5;
      break;
  }
  //console.log(velocidad);
  //console.log(direccionDerecha);
  moverCuadroAleatorio();
  moverSerpiente({ key: "ArrowRight" });
  pantalla.focus();
}

function mensajeInicarJuego() {
  pincel.font = "bold 21px Arial";
  pincel.fillStyle = "black";
  pincel.fillText("Presiona el boton azul JUGAR para empezar el juego", 10, 200);
  pincel.font = "bold 18px Arial";
  pincel.fillText("Mueve la serpiente usando las flechas de dirección", 50, 250);
}

function mensajeJuegoFinalizado() {
  //console.log("JUEGO TERMINADO")
  let xMensajeNivel = 0;
  //Asignar el valor de x para el mensaje del NIVEL
  switch (selectNivel.value) {
    case "FACIL":
      xMensajeNivel = 200;
      break;

    case "NORMAL":
      xMensajeNivel = 180;
      break;

    case "DIFICIL":
      xMensajeNivel = 190;
      break;
  }
  pincel.font = "bold 26px Arial";
  pincel.fillStyle = "black";
  pincel.fillText("JUEGO TERMINADO", 160, 150);
  pincel.fillText("TU PUNTAJE: " + puntaje, 180, 200);
  pincel.fillText("NIVEL: " + selectNivel.value, xMensajeNivel, 250);
  pincel.font = "bold 20px Arial";
  pincel.fillText("Presiona el boton azul JUGAR para volver a jugar", 40, 300);
}

culebraInicial();
pintarSerpiente("ArrowRight");
mensajeInicarJuego();
pantalla.onkeydown = moverSerpiente;
botonJugar.onclick = jugar;

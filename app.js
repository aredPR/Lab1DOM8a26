'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

const btnCambiar = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

// Manejador del evento click del botón
btnCambiar.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';
    titulo.textContent = alt
        ? 'Haz sido troleado por JS'
        : 'Bienvenido a la aplicación de EJ';

    subtitulo.textContent = alt
        ? '¡Sorpresa!'
        : 'Esto es una aplicación sencilla de manipulacion del DOM';

    titulo.dataset.alt = alt ? '0' : '1';
    setEstado('Textos actualizados')
    
});
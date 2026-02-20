'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const buildCard = ({title, text, tags})=>{
    const article = document.createElement('article');
    article.className= 'card';
    article.dataset.tags = tags;
    article.innerHTML = `
    <h3 class="card-title"></h3>
    <p class="card-text">Agentes que pueden realizar tareas autónomas usando IA.</p>
    <div class="card-actions">
              <button class="btn small" type="button" data-action="like">👍 Like</button>
              <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
              <span class="badge" aria-label="likes">0</span>
            </div>
    `;
    article.querySelector('.card-title').textContent = title;
    article.querySelector('.card-text').textContent = text;
    return article;
};

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

const btnCambiar = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo =$('#subtitulo');

// Manejador del evento click del botón
btnCambiar.addEventListener('click', () => {
    const alt = titulo.dataset.alt ===  '0' ;

    titulo.textContent = alt
    ? 'Ha sido troleado por javascript'
    : 'Bienvenido a la aplicación de ejemplo';

    subtitulo.textContent = alt
    ? 'Este es un subtítulo alternativo'
    : 'Este es el subtítulo original';

    titulo.dataset.alt = alt ? '1': '0';
    setEstado('Textos actualiados');
});

// Manejador de evento maouseover para los artículos
const listaArticulos = $('#listaArticulos');

listaArticulos.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
        card.classList.add('is-highlight');
});

// Manejador de evento mouseout para los artículos
listaArticulos.addEventListener('mouseout', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
        card.classList.remove('is-highlight');
});

// Agregar elementos al DOM de forma dinámica
const btnAgregarCard = $('#btnAgregarCard');
const listaArticulosDiv = $('#listaArticulos');

btnAgregarCard.addEventListener('click', () => {
    const article = buildCard({
        title: 'Nueva Card',
        text: 'Este Card fue agregado dinámicamente al hacer click en el botón.',
        tags: 'nueva, dinámica'
    });

    listaArticulosDiv.prepend(article);
    setEstado('Nueva card agregada');
});

// Eliminar cards al hacer click en el botón eliminar
const btnLimpiar = $('#btnLimpiar');
btnLimpiar.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;
    cards.forEach(card => {
        if (card.dataset.seed === 'true') return;
        card.remove();
        removed++;
    });
    setEstado(`Se eliminaron ${removed} cards`);
});

// const likeButtons = document.querySelectorAll('#listaArticulos button[data-action="like"]');

const listaArticulos3 = $('#listaArticulos');

listaArticulos3.addEventListener('click', (e) => {
    //¿se hizo click en el boton de like? NOSE 
    const btn = e.target.closest('button[data-action="like"]');
    if (!btn) return;//No es un boton de like
    const card = btn.closest('.card');
    if (!card) return;//No se encontro la card padre santo
    hacerLike(card);
});

// likeButtons.forEach(btn => {
//     btn.addEventListener('click', () => {
//         const card = btn.closest('.card');
//         hacerLike(card);
//     });
// });

const hacerLike = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = parseInt(badge.textContent) || 0;
    badge.textContent = currentLikes + 1;
    setEstado('Like agregado');
};

// Boton de eliminar Like segun miguel 

const eliminarLike = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = parseInt(badge.textContent);
    if (currentLikes > 0 ) badge.textContent = currentLikes -1;
    else (currentLikes < 0 )
    setEstado('Like Eliminado');
};

const listaArticulos4 = $('#listaArticulos');

listaArticulos4.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action="remove"]');
    if (!btn) return;//No es un boton de like
    const card = btn.closest('.card');
    if (!card) return;//No se encontro la card padre santo
    eliminarLike(card);
});

//filtrar cards
const filtro = $('#filtro');

const filterstate = {q: '', tag: ""};


// unir titulo  y texto de cada card y va a buscar que lo que el
// usuario escribio en el filtro este en las cards
const matchText = (card, q) => {
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? '';
    const haystack = (title + ' ' + text).toLowerCase();
    return haystack.includes(q);
};

const matchTag = (card, tag) => {
    if (!tag) return true; // Si no hay tag, coinciden todas las cards
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okState = filterstate.q
            ? matchText(card, filterstate.q)
            : true;
        const okTag = matchTag(card, filterstate.tag);
        card.hidden = !(okText && okTag);
    });
    const parts  = [];
    if (filterstate.q) parts.push(`Texto: "${filterstate.q}"`);
    if (filterstate.tag) parts.push(`Tag: "${filterstate.tag}"`);
    setEstado(parts.length > 0 
        ? `Filtro aplicado: ${parts.join(', ')}` 
        : 'Filtro vacio');
};

// Evento input: filtrar mientras se escribe en la caja de texto 
filtro.addEventListener('input', () =>{
    //q: Lo que el usuario escribe en el input
    const q = filtro.value.trim().toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach((card) => {
        const ok = q === '' ? true :  matchText(card, q);
        card.hidden = !ok;
    });

setEstado(q === '' ? 'Filtro vacio' : `Filtro aplicado: "${q}"`);

});

//Filtrar por tags
const chips = $('#chips');
chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return; // No se hizo click en una chip, salir
    const tag = (chip.dataset.tag || '').toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach((card) => {
        const tags = (card.dataset.tags || '').toLowerCase();
        card.hidden = !tags.includes(tag);
    });
    setEstado(`Filtrado por tag: "${tag}"`);
});
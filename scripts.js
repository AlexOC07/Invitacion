'use strict';
// ==========================================
// DATOS PRINCIPALES DE LA INVITACION
// ==========================================
const CONFIG = {
    whatsapp: '59167525973',
    graduado: 'Kevin Cristian Guzman Javier',
    carrera: 'Licenciado en Contaduría Pública',
    fecha: '2026-10-23T09:00:00-04:00',
    direccion: 'Calle Topater N.º 141'
};
// ==========================================
// ELEMENTOS DEL DOCUMENTO
// ==========================================
const $ = (selector) => document.querySelector(selector);
const portada = $('#portada');
const invitacion = $('#invitacion');
const botonAbrir = $('#abrirInvitacion');
const botonMusica = $('#botonMusica');
const iconoMusica = $('#iconoMusica');
const textoMusica = $('#textoMusica');
const botonWhatsApp = $('#botonWhatsApp');
const fechaEvento = new Date(CONFIG.fecha).getTime();
let invitacionAbierta = false;
let temporizador = null;
// ==========================================
// ABRIR LA INVITACION
// ==========================================
function abrirInvitacion() {
    if (invitacionAbierta) {
        return;
    }
    invitacionAbierta = true;
    portada.classList.add('cerrando');
    setTimeout(() => {
        portada.style.display = 'none';
        invitacion.classList.remove('oculto');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 850);
}
botonAbrir.addEventListener('click', abrirInvitacion);
// ==========================================
// PARTICULAS ROJAS
// ==========================================
const canvas = $('#particulas');
const ctx = canvas.getContext('2d');
let particulas = [];
let ancho = 0;
let alto = 0;
let escala = 1;
let animacionParticulas = null;
const movimientoReducido = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
);
function ajustarCanvas() {
    escala = Math.min(window.devicePixelRatio || 1, 2);
    ancho = window.innerWidth;
    alto = window.innerHeight;
    canvas.width = Math.floor(ancho * escala);
    canvas.height = Math.floor(alto * escala);
    canvas.style.width = `${ancho}px`;
    canvas.style.height = `${alto}px`;
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    crearParticulas();
}
function crearParticulas() {
    const cantidad = movimientoReducido.matches
        ? 12
        : Math.min(95, Math.floor((ancho * alto) / 11000));
    particulas = [];
    for (let i = 0; i < cantidad; i++) {
        particulas.push({
            x: Math.random() * ancho,
            y: Math.random() * alto,
            radio: Math.random() * 1.8 + 0.4,
            velocidad: Math.random() * 0.35 + 0.08,
            transparencia: Math.random() * 0.65 + 0.2,
            fase: Math.random() * Math.PI * 2
        });
    }
}
function dibujarParticulas(tiempo = 0) {
    ctx.clearRect(0, 0, ancho, alto);
    particulas.forEach((p) => {
        const brillo = movimientoReducido.matches
            ? 1
            : 0.7 + Math.sin(tiempo / 900 + p.fase) * 0.3;
        ctx.beginPath();
        ctx.arc(
            p.x,
            p.y,
            p.radio,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 65, 90, ${
            p.transparencia * brillo
        })`;
        ctx.fill();
        if (!movimientoReducido.matches) {
            p.y -= p.velocidad;
            p.x += Math.sin(
                tiempo / 2500 + p.fase
            ) * 0.15;
            if (p.y < -5) {
                p.y = alto + 5;
                p.x = Math.random() * ancho;
            }
            if (p.x < 0) p.x = ancho;
            if (p.x > ancho) p.x = 0;
        }
    });
    animacionParticulas = null;
    if (!movimientoReducido.matches) {
        animacionParticulas = requestAnimationFrame(
            dibujarParticulas
        );
    }
}
function iniciarAnimacionParticulas() {
    if (animacionParticulas !== null) {
        cancelAnimationFrame(animacionParticulas);
        animacionParticulas = null;
    }
    if (movimientoReducido.matches) {
        dibujarParticulas();
    } else {
        animacionParticulas = requestAnimationFrame(
            dibujarParticulas
        );
    }
}
window.addEventListener('resize', () => {
    ajustarCanvas();
    iniciarAnimacionParticulas();
});
movimientoReducido.addEventListener('change', () => {
    ajustarCanvas();
    iniciarAnimacionParticulas();
});
ajustarCanvas();
iniciarAnimacionParticulas();
// ==========================================
// CUENTA REGRESIVA
// ==========================================
function actualizarCuenta() {
    const diferencia = fechaEvento - Date.now();
    const estado = $('#estadoCuenta');
    if (diferencia <= 0) {
        $('#dias').textContent = '00';
        $('#horas').textContent = '00';
        $('#minutos').textContent = '00';
        $('#segundos').textContent = '00';
        if (diferencia > -24 * 60 * 60 * 1000) {
            estado.textContent =
                '¡Hoy celebramos este gran logro!';
        } else {
            estado.textContent =
                'Gracias por ser parte de esta ocasión especial.';
        }
        return;
    }
    const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );
    const horas = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
    );
    const minutos = Math.floor(
        (diferencia / (1000 * 60)) % 60
    );
    const segundos = Math.floor(
        (diferencia / 1000) % 60
    );
    $('#dias').textContent = String(dias).padStart(2, '0');
    $('#horas').textContent = String(horas).padStart(2, '0');
    $('#minutos').textContent = String(minutos).padStart(2, '0');
    $('#segundos').textContent = String(segundos).padStart(2, '0');
    estado.textContent =
        'Cada segundo nos acerca a un día inolvidable.';
}
actualizarCuenta();
temporizador = setInterval(actualizarCuenta, 1000);
//* ==========================================*
//* MUSICA DE FONDO CON ARCHIVO MP3 *
//* ==========================================*
const musicaFondo = $('#musicaFondo');
let musicaActiva = false;
function actualizarBotonMusica(activa) {
    botonMusica.classList.toggle('activa', activa);
    botonMusica.setAttribute(
        'aria-pressed',
        String(activa)
    );
    botonMusica.setAttribute(
        'aria-label',
        activa ? 'Desactivar música' : 'Activar música'
    );
    iconoMusica.textContent = activa ? '♫' : '♪';
    textoMusica.textContent = activa
        ? 'Desactivar música'
        : 'Activar música';
}
async function iniciarMusica() {
    if (!musicaFondo) {
        console.error('No se encontró el reproductor de música.');
        return;
    }
    try {
        musicaFondo.volume = 0.35;
        await musicaFondo.play();
        musicaActiva = true;
        actualizarBotonMusica(true);
    } catch (error) {
        musicaActiva = false;
        actualizarBotonMusica(false);
        console.error(
            'No se pudo reproducir la música:',
            error
        );
        alert(
            'No se pudo reproducir la canción. ' +
            'Comprueba que musica.mp3 esté en la carpeta ' +
            'de la invitación.'
        );
    }
}
function detenerMusica() {
    musicaFondo.pause();
    musicaActiva = false;
    actualizarBotonMusica(false);
}
botonMusica.addEventListener('click', () => {
    if (musicaActiva) {
        detenerMusica();
    } else {
        iniciarMusica();
    }
});
actualizarBotonMusica(false);
// ==========================================
// CONFIRMACION POR WHATSAPP
// ==========================================
function prepararWhatsApp() {
    const mensaje =
        `¡Hola! Confirmo mi asistencia a la graduación de ` +
        `${CONFIG.graduado}, ${CONFIG.carrera}. ` +
        `El acto será el viernes 23 de octubre de 2026 a las 09:00 a. m. ` +
        `en el Salón Auditorio de la Carrera Ing. Comercial (UNSXX). ` +
        `También quisiera acompañarlos en la celebración posterior ` +
        `en el domicilio de la calle Topater N.º 141.`;
    const enlace =
        `https://wa.me/${CONFIG.whatsapp}?text=` +
        encodeURIComponent(mensaje);
    botonWhatsApp.href = enlace;
}
prepararWhatsApp();
// ==========================================
// FINALIZACION
// ==========================================
window.addEventListener('pagehide', () => {
    if (temporizador !== null) {
        clearInterval(temporizador);
    }
    if (animacionParticulas !== null) {
        cancelAnimationFrame(animacionParticulas);
    }
    if (contextoAudio && contextoAudio.state !== 'closed') {
        contextoAudio.close();
    }
});
console.log(
    'Invitación de graduación de Kevin preparada correctamente.'
);
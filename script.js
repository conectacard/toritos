// Lógica de BENEATH con Persistencia Local, Acuse de Lectura Gerencial y Control (Versión Toritos)

document.addEventListener("DOMContentLoaded", () => {
    limpiarContenidoExpirado();
    checarEstadoIdentidad();
    inicializarEventosTecladoGlobales();
});

// --- MOTOR DE AUTODESTRUCCIÓN A 72 HORAS ---
function limpiarContenidoExpirado() {
    const mensajesGuardados = JSON.parse(localStorage.getItem("beneath_mensajes_toritos_json")) || [];
    const ahora = Date.now();
    const tiempoLimite = 72 * 60 * 60 * 1000; // 72 horas en milisegundos

    const mensajesValidos = mensajesGuardados.filter(item => {
        return (ahora - item.timestamp) < tiempoLimite;
    });

    localStorage.setItem("beneath_mensajes_toritos_json", JSON.stringify(mensajesValidos));
}

function checarEstadoIdentidad() {
    const identidadGuardada = localStorage.getItem("beneath_identity_toritos");
    
    if (identidadGuardada) {
        // Verificar si el admin TORITOS expulsó a este usuario
        const expulsados = JSON.parse(localStorage.getItem("beneath_expulsados_toritos")) || [];
        if (expulsados.includes(identidadGuardada)) {
            alert("Tu acceso ha sido revocado por el administrador.");
            localStorage.removeItem("beneath_identity_toritos");
            localStorage.removeItem("beneath_pin_toritos");
            location.reload();
            return;
        }

        document.getElementById("setup-view").classList.add("hidden");
        document.getElementById("login-view").classList.remove("hidden");
        document.getElementById("display-identity").innerText = identidadGuardada;
        
        const loginPin = document.getElementById("login-pin");
        if (loginPin) loginPin.focus();
    } else {
        document.getElementById("setup-view").classList.remove("hidden");
        document.getElementById("login-view").classList.add("hidden");
        
        const inputIdentity = document.getElementById("input-identity");
        if (inputIdentity) inputIdentity.focus();
    }
}

function inicializarEventosTecladoGlobales() {
    const loginPin = document.getElementById("login-pin");
    if (loginPin) {
        loginPin.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                verificarPin();
            }
        });
    }

    const inputIdentity = document.getElementById("input-identity");
    const inputPin = document.getElementById("input-pin");
    
    const registrarConEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            guardarIdentidad();
        }
    };

    if (inputIdentity) inputIdentity.addEventListener("keypress", registrarConEnter);
    if (inputPin) inputPin.addEventListener("keypress", registrarConEnter);
}

function guardarIdentidad() {
    const nombre = document.getElementById("input-identity").value.trim().toUpperCase();
    const pin = document.getElementById("input-pin").value.trim();

    if (!nombre || pin.length !== 4) {
        alert("Por favor escribe una identidad válida y un PIN exacto de 4 dígitos.");
        return;
    }

    const palabrasBase = ["TIGER", "TORITOS", "CLOUD", "SECURE", "MORE", "NODE", "ZENITH", "AUDIT"];
    let fraseRescate = "";
    for (let i = 0; i < 4; i++) {
        fraseRescate += palabrasBase[Math.floor(Math.random() * palabrasBase.length)] + " ";
    }
    fraseRescate = fraseRescate.trim();

    localStorage.setItem("beneath_identity_toritos", nombre);
    localStorage.setItem("beneath_pin_toritos", pin);
    localStorage.setItem("beneath_recovery_toritos", fraseRescate);

    // Registrar en la lista general de miembros conocidos de toritos
    let miembros = JSON.parse(localStorage.getItem("beneath_miembros_toritos")) || ["TORITOS", "INTEGRANTE1", "INTEGRANTE2"];
    if (!miembros.includes(nombre)) {
        miembros.push(nombre);
        localStorage.setItem("beneath_miembros_toritos", JSON.stringify(miembros));
    }

    alert(`¡Identidad creada con éxito!\n\n[ FRASE DE RESCATE DE EMERGENCIA ]\nAnota estas 4 palabras:\n\n--> ${fraseRescate} <--`);

    location.reload();
}

function verificarPin() {
    const pinIngresado = document.getElementById("login-pin").value.trim();
    const pinReal = localStorage.getItem("beneath_pin_toritos");

    if (pinIngresado === pinReal) {
        otorgarAccesoExitoso();
    } else {
        alert("PIN incorrecto.");
        document.getElementById("login-pin").value = "";
    }
}

function simularBiometria() {
    const confirmacion = confirm("BENEATH solicita autenticación biométrica (Huella / FaceID). ¿Autorizar?");
    if (confirmacion) {
        otorgarAccesoExitoso();
    }
}

function mostrarSeccionRescate() {
    const box = document.getElementById("recovery-box");
    if (box) box.classList.toggle("hidden");
}

function verificarFraseRescate() {
    const fraseIngresada = document.getElementById("input-recovery-phrase").value.trim().toUpperCase();
    const fraseReal = localStorage.getItem("beneath_recovery_toritos");

    if (fraseIngresada === fraseReal) {
        alert("¡Frase verificada! Establece un nuevo PIN.");
        const nuevoPin = prompt("Introduce tu nuevo PIN de 4 dígitos:");
        if (nuevoPin && nuevoPin.length === 4) {
            localStorage.setItem("beneath_pin_toritos", nuevoPin);
            alert("PIN actualizado. Entrando...");
            otorgarAccesoExitoso();
        } else {
            alert("PIN no válido.");
        }
    } else {
        alert("Frase incorrecta.");
    }
}

function otorgarAccesoExitoso() {
    document.getElementById("login-view").classList.add("hidden");
    document.getElementById("main-view").classList.remove("hidden");
    
    const usuario = localStorage.getItem("beneath_identity_toritos");
    document.getElementById("logged-user").innerText = usuario;

    const badgeRole = document.getElementById("user-role-badge");
    const btnAudit = document.getElementById("btn-admin-audit");
    
    if (usuario === "TORITOS") {
        badgeRole.innerText = "ROL: ADMIN / DIRECTOR";
        badgeRole.className = "text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800 font-semibold uppercase";
        if (btnAudit) btnAudit.classList.remove("hidden");
    } else {
        badgeRole.innerText = "ROL: INTEGRANTE";
        badgeRole.className = "text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold uppercase";
        if (btnAudit) btnAudit.classList.add("hidden");
    }
}

function activarCortinaPrivacidad() {
    const cortina = document.getElementById("privacy-curtain");
    if (cortina) cortina.classList.remove("hidden");
}

function quitarCortinaPrivacidad() {
    const cortina = document.getElementById("privacy-curtain");
    if (cortina) cortina.classList.add("hidden");
}

function cerrarSesion() {
    location.reload();
}

function abrirChatGrupo(nombreGrupo) {
    document.getElementById("main-view").classList.add("hidden");
    document.getElementById("chat-view").classList.remove("hidden");
    
    registrarLecturaUsuarioActual();
    renderizarMensajesDesdeJSON();

    const input = document.getElementById("input-mensaje");
    if (input) {
        input.focus();
        input.removeEventListener("keypress", manejarEnterChat);
        input.addEventListener("keypress", manejarEnterChat);
    }
}

function volverAGrupos() {
    document.getElementById("chat-view").classList.add("hidden");
    document.getElementById("main-view").classList.remove("hidden");
}

function manejarEnterChat(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        enviarMensaje();
    }
}

function alternarPanelAuditoria() {
    const panel = document.getElementById("audit-panel");
    if (panel) {
        panel.classList.toggle("hidden");
        if (!panel.classList.contains("hidden")) {
            actualizarPanelGerencialAdmin();
        }
    }
}

// --- PANEL DE CONTROL GERENCIAL Y EXPULSIÓN (EXCLUSIVO TORITOS) ---
function actualizarPanelGerencialAdmin() {
    const panel = document.getElementById("audit-panel");
    let miembros = JSON.parse(localStorage.getItem("beneath_miembros_toritos")) || ["TORITOS", "INTEGRANTE1", "INTEGRANTE2"];
    let expulsados = JSON.parse(localStorage.getItem("beneath_expulsados_toritos")) || [];

    let htmlMiembros = `
        <div class="flex justify-between items-center border-b border-amber-900/40 pb-1 mb-2">
            <span class="font-bold text-amber-400 uppercase text-[10px]">Panel de Control Gerencial & Miembros</span>
            <span class="text-[9px] text-slate-400">Acceso Total</span>
        </div>
        <div class="space-y-1.5 text-[11px]">
    `;

    miembros.forEach(m => {
        let esExpulsado = expulsados.includes(m);
        let estadoBadge = esExpulsado ? '<span class="text-rose-400 font-semibold">🔴 Expulsado / Revocado</span>' : '<span class="text-emerald-400 font-semibold">🟢 Activo</span>';
        let botonAccion = '';

        if (m !== "TORITOS") {
            if (esExpulsado) {
                botonAccion = `<button onclick="readmitirMiembro('${m}')" class="px-2 py-0.5 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 rounded border border-emerald-800 text-[10px] cursor-pointer font-bold">Readmitir</button>`;
            } else {
                botonAccion = `<button onclick="expulsarMiembro('${m}')" class="px-2 py-0.5 bg-rose-950 text-rose-400 hover:bg-rose-900 rounded border border-rose-800 text-[10px] cursor-pointer font-bold">Expulsar</button>`;
            }
        } else {
            botonAccion = `<span class="text-[9px] text-amber-500 italic">Director</span>`;
        }

        htmlMiembros += `
            <div class="flex justify-between items-center bg-slate-900/80 p-2 rounded border border-slate-800">
                <div>
                    <span class="text-slate-200 font-bold uppercase">${m}</span>
                    <div class="text-[9px]">${estadoBadge}</div>
                </div>
                <div>${botonAccion}</div>
            </div>
        `;
    });

    htmlMiembros += `</div>`;
    panel.innerHTML = htmlMiembros;
}

function expulsarMiembro(nombreMiembro) {
    if (confirm(`¿Estás seguro de expulsar a ${nombreMiembro}? Su sesión se cerrará de inmediato y no podrá acceder.`)) {
        let expulsados = JSON.parse(localStorage.getItem("beneath_expulsados_toritos")) || [];
        if (!expulsados.includes(nombreMiembro)) {
            expulsados.push(nombreMiembro);
            localStorage.setItem("beneath_expulsados_toritos", JSON.stringify(expulsados));
        }
        actualizarPanelGerencialAdmin();
    }
}

function readmitirMiembro(nombreMiembro) {
    let expulsados = JSON.parse(localStorage.getItem("beneath_expulsados_toritos")) || [];
    expulsados = expulsados.filter(item => item !== nombreMiembro);
    localStorage.setItem("beneath_expulsados_toritos", JSON.stringify(expulsados));
    actualizarPanelGerencialAdmin();
}

function obtenerHoraActual() {
    const ah = new Date();
    return ah.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- MOTOR DE ACUSE DE LECTURA GERENCIAL ---
function registrarLecturaUsuarioActual() {
    const usuarioActivo = localStorage.getItem("beneath_identity_toritos");
    if (!usuarioActivo) return;

    let mensajes = JSON.parse(localStorage.getItem("beneath_mensajes_toritos_json")) || [];
    const horaLectura = obtenerHoraActual();
    let huboCambios = false;

    mensajes.forEach(item => {
        if (!item.vistos) {
            item.vistos = {};
        }
        if (!item.vistos[usuarioActivo]) {
            item.vistos[usuarioActivo] = horaLectura;
            huboCambios = true;
        }
    });

    if (huboCambios) {
        localStorage.setItem("beneath_mensajes_toritos_json", JSON.stringify(mensajes));
    }
}

// --- SISTEMA DE PERSISTENCIA Y RENDERIZADO BASADO EN JSON ---
function guardarMensajeEnJSON(nuevoItem) {
    limpiarContenidoExpirado();
    let mensajes = JSON.parse(localStorage.getItem("beneath_mensajes_toritos_json")) || [];
    
    nuevoItem.vistos = {};
    nuevoItem.vistos[nuevoItem.usuario] = nuevoItem.hora;

    mensajes.push(nuevoItem);
    localStorage.setItem("beneath_mensajes_toritos_json", JSON.stringify(mensajes));
}

function renderizarMensajesDesdeJSON() {
    limpiarContenidoExpirado();
    const contenedorChat = document.getElementById("chat-messages");
    if (!contenedorChat) return;

    contenedorChat.innerHTML = "";
    let mensajes = JSON.parse(localStorage.getItem("beneath_mensajes_toritos_json")) || [];
    const usuarioActual = localStorage.getItem("beneath_identity_toritos");

    mensajes.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = item.esArchivo 
            ? "mensaje-card p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-900/50 space-y-1"
            : "mensaje-card p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1";

        let contenidoHtml = "";
        if (item.esArchivo) {
            contenidoHtml = `
                <p class="text-slate-200 text-xs flex items-center justify-between">
                    <span class="flex items-center gap-1.5 truncate">
                        <span>${item.icono}</span> 
                        <span class="font-semibold truncate max-w-[150px]">${item.nombreArchivo}</span>
                        <span class="text-[10px] text-slate-400">(${item.tamanoLegible})</span>
                    </span>
                    <a href="${item.dataUrl}" download="${item.nombreArchivo}" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded font-bold text-[10px] transition-colors flex items-center gap-1 shadow">
                        📥 Descargar
                    </a>
                </p>
            `;
        } else {
            if (item.texto.startsWith("http://") || item.texto.startsWith("https://")) {
                contenidoHtml = `<a href="${item.texto}" target="_blank" class="text-xs text-blue-400 underline flex items-center gap-1">🔗 <span>${item.texto}</span></a>`;
            } else {
                contenidoHtml = `<p class="text-slate-200 text-xs">${item.texto}</p>`;
            }
        }

        let htmlAuditoriaLectura = "";
        if (usuarioActual === "TORITOS") {
            let vistosObj = item.vistos || {};
            let listaVistosTextos = [];
            for (let miembro in vistosObj) {
                listaVistosTextos.push(`${miembro} (${vistosObj[miembro]})`);
            }
            let resumenLectura = listaVistosTextos.length > 0 ? listaVistosTextos.join(", ") : "Ninguno aún";
            
            htmlAuditoriaLectura = `
                <div class="pt-1.5 mt-1 border-t border-amber-900/30 text-[9px] text-amber-400/90 flex items-center gap-1">
                    <span>👁️ Auditoría Gerencial - Visto por:</span>
                    <span class="font-semibold text-slate-300">${resumenLectura}</span>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-emerald-400 uppercase">${item.usuario}</span>
                <div class="flex items-center gap-2">
                    <span class="text-[9px] text-slate-500">${item.hora}</span>
                    <button onclick="eliminarMensajePorIndex(${index})" class="text-[11px] text-rose-400 hover:text-rose-300 cursor-pointer font-bold px-1" title="Eliminar contenido">🗑️</button>
                </div>
            </div>
            ${contenidoHtml}
            ${htmlAuditoriaLectura}
            <div class="flex justify-between items-center pt-1 border-t border-slate-800/60 text-[9px]">
                <span class="text-amber-400/90">⏳ Expira en 72h (Autodestrucción)</span>
                <span class="text-slate-500">${item.esArchivo ? 'Archivo Seguro' : 'Transmitido'}</span>
            </div>
        `;

        contenedorChat.appendChild(div);
    });

    contenedorChat.scrollTop = contenedorChat.scrollHeight;
}

function eliminarMensajePorIndex(index) {
    let mensajes = JSON.parse(localStorage.getItem("beneath_mensajes_toritos_json")) || [];
    mensajes.splice(index, 1);
    localStorage.setItem("beneath_mensajes_toritos_json", JSON.stringify(mensajes));
    renderizarMensajesDesdeJSON();
}

function enviarMensaje() {
    const input = document.getElementById("input-mensaje");
    let texto = input.value.trim();
    const usuarioActivo = localStorage.getItem("beneath_identity_toritos") || "TORITOS";

    if (!texto) return;

    const nuevoItem = {
        usuario: usuarioActivo,
        texto: texto,
        esArchivo: false,
        timestamp: Date.now(),
        hora: obtenerHoraActual()
    };

    guardarMensajeEnJSON(nuevoItem);
    input.value = "";
    renderizarMensajesDesdeJSON();
}

// --- DESCARGA REAL DE ARCHIVOS (BASE64) ---
function manejarArchivoSeleccionado(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function(e) {
        const base64Data = e.target.result;
        const usuarioActivo = localStorage.getItem("beneath_identity_toritos") || "TORITOS";

        const tamanoKB = (archivo.size / 1024).toFixed(1);
        const tamanoLegible = tamanoKB > 1024 ? (tamanoKB / 1024).toFixed(1) + " MB" : tamanoKB + " KB";

        let icono = "📄";
        if (archivo.type.includes("image")) icono = "🖼️";
        else if (archivo.type.includes("pdf")) icono = "📕";
        else if (archivo.type.includes("word") || archivo.name.endsWith(".docx")) icono = "📝";

        const nuevoItem = {
            usuario: usuarioActivo,
            esArchivo: true,
            nombreArchivo: archivo.name,
            tamanoLegible: tamanoLegible,
            icono: icono,
            dataUrl: base64Data,
            timestamp: Date.now(),
            hora: obtenerHoraActual()
        };

        guardarMensajeEnJSON(nuevoItem);
        event.target.value = "";
        renderizarMensajesDesdeJSON();
    };

    lector.readAsDataURL(archivo);
}
// Stato del gioco
const gameState = {
    currentLevel: 0,
    isGameOver: false
};

// Riferimenti al DOM
const container = document.getElementById('game-container');

// Inizializzazione
document.addEventListener('DOMContentLoaded', () => {
    // Gestione pulsante start iniziale
    const startBtn = document.getElementById('start-btn');
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            loadLevel(1);
        });
    }
});

// Funzione principale per cambiare livello
function loadLevel(levelNumber) {
    gameState.currentLevel = levelNumber;
    container.innerHTML = ''; // Pulisce lo schermo

    switch(levelNumber) {
        case 1:
            initLevel1();
            break;
        case 2:
            initLevel2();
            break;
        case 3:
            container.innerHTML = '<h2>Livello 3: In costruzione...</h2>';
            // initLevel3();
            break;
        case 99:
            initFinalScreen();
            break;
        default:
            console.error("Livello inesistente");
    }
}

// --- LIVELLO 1: IL MEMORY (Placeholder) ---
function initLevel1() {
    // Qui costruiremo la griglia del memory
    container.innerHTML = `
        <h2>Livello 1: Sincronizzazione</h2>
        <p>Trova le coppie per stabilizzare il segnale.</p>
        <div id="memory-board" style="padding: 20px; border: 1px dashed #444; margin-bottom: 20px;">
            [QUI ANDRÀ LA GRIGLIA DI GIOCO]
        </div>
        <button onclick="loadLevel(2)">Simula Vittoria Livello 1</button>
    `;
}

// --- LIVELLO 2: VIDEO & DOMANDA (Placeholder) ---
function initLevel2() {
    container.innerHTML = `
        <h2>Livello 2: Analisi Visiva</h2>
        <p>Osserva il filmato.</p>
        <div style="background: #000; height: 200px; display: flex; align-items:center; justify-content:center; margin-bottom: 20px;">
            [QUI ANDRÀ IL VIDEO]
        </div>
        <input type="text" placeholder="Risposta..." style="background:transparent; border:1px solid #555; color:white; padding:10px; margin-bottom:10px;">
        <br>
        <button onclick="loadLevel(3)">Invia Risposta</button>
    `;
}

// --- SCHERMATA FINALE ---
function initFinalScreen() {
    container.innerHTML = `
        <h2>Sincronizzazione Completa</h2>
        <p>Inserisci la chiave di accesso finale.</p>
        <input type="text" id="final-key" placeholder="KEYWORD">
        <button id="unlock-btn">SBLOCCA</button>
    `;
}

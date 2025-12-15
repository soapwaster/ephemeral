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

// --- LOGICA MEMORY ---
let hasFlippedCard = false;
let lockBoard = false; // Blocca click mentre due carte si stanno confrontando
let firstCard, secondCard;
let matchesFound = 0;
const totalPairs = 3; // 6 carte totali = 3 coppie

function initLevel1() {
    container.innerHTML = `
        <h2>Livello 1: Sincronizzazione</h2>
        <p>Trova le coppie per stabilizzare il segnale.</p>
        <div class="memory-grid" id="memory-board"></div>
        <div id="level-feedback" class="hidden">Segnale Stabilizzato...</div>
    `;

    const board = document.getElementById('memory-board');

    // --- CONFIGURAZIONE IMMAGINI ---
    // Puoi mettere qui Emoji, Testo, o tag HTML <img>
    // Esempio futuro: '<img src="img/occhio.png">'
    const items = ['👁️', '🧬', '🔮']; 
    
    // Duplichiamo gli elementi per creare le coppie (3x2 = 6)
    const deck = [...items, ...items];
    
    // Mischiamo il mazzo (Algoritmo Fisher-Yates)
    deck.sort(() => 0.5 - Math.random());

    // Creiamo l'HTML per ogni carta
    deck.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.value = item; // Usiamo questo per verificare la corrispondenza

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${item}</div>
            </div>
        `;

        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });

    // Reset variabili
    matchesFound = 0;
    hasFlippedCard = false;
    lockBoard = false;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; // Evita doppio click sulla stessa carta

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // Prima carta cliccata
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Seconda carta cliccata
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    // Controlla se il valore (dataset) è uguale
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    // Le carte corrispondono
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    // Rimuovi i listener per evitare interazioni future
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    
    matchesFound++;
    if (matchesFound === totalPairs) {
        setTimeout(levelOneComplete, 1000);
    }
}

function unflipCards() {
    lockBoard = true; // Blocca tutto finché l'animazione non finisce

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000); // 1 secondo di attesa prima di rigirarle
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function levelOneComplete() {
    const feedback = document.getElementById('level-feedback');
    feedback.classList.remove('hidden');
    feedback.style.color = '#4a90e2';
    
    setTimeout(() => {
        alert("Sincronizzazione completata. Accesso al livello 2 consentito.");
        loadLevel(2); // Passa al prossimo livello
    }, 1500);
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

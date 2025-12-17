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
            initLevel3();
            break;
        case 2:
            initLevel2();
            break;
        case 3:
            initLevel3();
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

// --- LIVELLO 2: ATTENZIONE SELETTIVA ---
const LEVEL2_DURATION_SECONDS = 38; // Definiamo i secondi di riproduzione

function initLevel2() {
    // ID del video YouTube (Invisible Gorilla)
    const videoId = "vJG698U2Mvo"; 

    // Variabile per tenere traccia dello stato
    let videoStopped = false; 

    container.innerHTML = `
        <h2>Livello 2: Attenzione Selettiva</h2>
        <p id="instruction-text">Osserva attentamente il video.<br>Conta quanti passaggi fa la squadra con la maglietta <strong>BIANCA</strong>.</p>
        
        <div class="video-wrapper">
            <iframe id="game-video" 
                src="https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0&autoplay=1&start=5" 
                title="Selective Attention Test" 
                frameborder="0" 
                allow="autoplay; encrypted-media; gyroscope;" 
                allowfullscreen>
            </iframe>
        </div>

        <div id="interaction-area">
            <p>Video in riproduzione...</p>
            <button id="show-q-btn" class="btn-glitch" disabled>Attendere</button>
        </div>
    `;

    const interactionArea = document.getElementById('interaction-area');
    const iframe = document.getElementById('game-video');
    const questionButton = document.getElementById('show-q-btn');

    // Funzione che scatta dopo 40 secondi
    setTimeout(() => {
        if (!videoStopped) {
            videoStopped = true;
            
            // 1. Ferma il video ricaricando l'iframe senza autoplay
            // Questo blocca di fatto la riproduzione.
            iframe.src = `https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1&rel=0`;

            // 2. Nasconde l'iframe (opzionale, ma pulito)
            iframe.style.opacity = '0.5'; 

            // 3. Abilita l'utente a procedere
            questionButton.disabled = false;
            questionButton.textContent = 'Inserisci Risposta';
            
            interactionArea.querySelector('p').textContent = 'Tempo scaduto.';
            
            questionButton.onclick = showQuestionLevel2; // Collega la funzione
        }
    }, LEVEL2_DURATION_SECONDS * 1000); // Converte i secondi in millisecondi
}

// Le altre funzioni (showQuestionLevel2, revealLevel2, replayAndAdvance, finishLevel2)
// rimangono INVARIATE, ma la funzione showQuestionLevel2 viene ora
// attivata dal click del bottone dopo che il timer è scaduto.

function showQuestionLevel2() {
    const interactionArea = document.getElementById('interaction-area');
    
    interactionArea.innerHTML = `
        <p>Quanti passaggi hanno fatto i bianchi?</p>
        <div style="display:flex; justify-content:center; align-items:center; gap:10px;">
            <input type="number" id="video-answer" class="input-void" placeholder="00">
            <button onclick="revealLevel2()" style="padding: 10px 20px;">CONFERMA</button>
        </div>
    `;
}

function revealLevel2() {
    // Non ci interessa cosa ha scritto l'utente, la logica è sempre la stessa.
    // Nel video del gorilla la risposta è 16, ma l'obiettivo è il gorilla.
    
    const interactionArea = document.getElementById('interaction-area');
    const instructions = document.getElementById('instruction-text');
    
    // Cambiamo istruzioni
    instructions.innerHTML = "La tua memoria ti inganna.";
    instructions.style.color = "var(--error-color)";

    interactionArea.innerHTML = `
        <div class="revelation-text">
            <p>La risposta corretta è <strong>16</strong>.</p>
            <br>
            <p><strong>Ma hai visto il GORILLA</strong>?</p>
        </div>
        <br>
        <button onclick="replayAndAdvance()">Riguarda il video (Cerca il Gorilla)</button>
    `;
}

function replayAndAdvance() {
    // Ricarichiamo l'iframe per far ripartire il video da zero
    // E cambiamo il pulsante per andare al prossimo livello
    const iframe = document.getElementById('game-video');
    const currentSrc = iframe.src;
    iframe.src = currentSrc; // Hack per riavviare il video iframe

    const interactionArea = document.getElementById('interaction-area');
    
    interactionArea.innerHTML = `
        <p>Ora lo vedi, vero?</p>
        <button class="btn-glitch" onclick="finishLevel2()">Procedi al Livello 3</button>
    `;
}

function finishLevel2() {
    // Simulazione transizione
    container.innerHTML = "<h2>Analisi Completata...</h2>";
    setTimeout(() => {
        loadLevel(3);
    }, 1500);
}

// --- LIVELLO 3: VITA LIQUIDA ---

function initLevel3() {
    container.innerHTML = `
        <div id="level3-container">
            <h2 id="l3-title" style="display:none">Accesso Memoria Profonda...</h2>
            <img id="memory-img" class="memory-image" src="" alt="Ricordo" style="display:none;">
            <p id="memory-txt" class="memory-text"></p>
        </div>
    `;

    startImageSequence();
}

function startImageSequence() {
    const imgElement = document.getElementById('memory-img');
    imgElement.style.display = 'block';

    // --- CONFIGURAZIONE FOTO ---
    // Inserisci qui i link alle tue 10 foto. 
    // Ho messo dei placeholder di 'picsum' per ora.
    const images = [
        'images/i0.jpeg',
        'images/i3.jpeg',
        'images/i4.jpeg',
        'images/i5.jpeg',
        'images/i6.jpeg',
        'images/i7.jpeg',
        'images/i8.jpeg',
        'images/i9.jpeg',
        'images/i10.jpeg',
        'images/i2.jpeg',
    ];

    let index = 0;

    // Funzione ricorsiva per mostrare le immagini
    function showNextImage() {
        if (index >= images.length) {
            // Immagini finite, nascondi elemento e passa ai testi
            imgElement.style.display = 'none';
            startTextSequence();
            return;
        }

        // Imposta la sorgente
        imgElement.src = images[index];
        
        // FADE IN
        setTimeout(() => {
            imgElement.classList.add('visible');
        }, 100); // Piccolo ritardo per permettere al browser di renderizzare

        // FADE OUT (dopo 1.8s, così a 2.0s è sparita ed è pronta la prossima)
        setTimeout(() => {
            imgElement.classList.remove('visible');
        }, 1000);

        // NEXT STEP (dopo 2s esatti)
        setTimeout(() => {
            index++;
            showNextImage();
        }, 1300);
    }

    // Avvia il ciclo
    showNextImage();
}

function startTextSequence() {
    const txtElement = document.getElementById('memory-txt');

    // --- CONFIGURAZIONE DOMANDE ---
    const messages = [
        "Ti ricordi che bella la vacanza in Cina?",
        "Hai presente la stella dell'albero di Natale?",
        "Come si chiamava quel posto dove hai comprato le scarpe?"
    ];

    let index = 0;

    function showNextText() {
        if (index >= messages.length) {
            // Testi finiti, mostra il finale
            showFinalInputLevel3();
            return;
        }

        txtElement.textContent = messages[index];

        // FADE IN
        setTimeout(() => {
            txtElement.classList.add('visible');
        }, 100);

        // FADE OUT (dopo 2.5s)
        setTimeout(() => {
            txtElement.classList.remove('visible');
        }, 2500);

        // NEXT STEP (dopo 3s)
        setTimeout(() => {
            index++;
            showNextText();
        }, 3000);
    }

    showNextText();
}

function showFinalInputLevel3() {
    const levelContainer = document.getElementById('level3-container');
    
    // Pulisce il contenitore precedente
    levelContainer.innerHTML = '';
    
    // Crea la schermata finale del livello
    const finalDiv = document.createElement('div');
    finalDiv.className = 'final-message-container';
    
    finalDiv.innerHTML = `
        <p class="final-quote">"La vita liquida scivola tra le curve del cervello. Solidifichiamola."</p>
        <p>Mandami un messaggio con il nome del paese dove hai fatto aperitivo alle 11:00</p>
        <p id="error-msg" style="color:var(--error-color); display:none; margin-top:10px;">Errore di connessione neurale.</p>
    `;

    levelContainer.appendChild(finalDiv);
}

function checkFinalKeyword() {
    const input = document.getElementById('final-keyword-input').value.toLowerCase().trim();
    const errorMsg = document.getElementById('error-msg');

    // --- CONFIGURAZIONE RISPOSTA ESATTA ---
    // Scegli tu la parola che l'utente deve indovinare.
    // Esempio: "cane", "nulla", "tempo", oppure la risposta alla domanda delle scarpe.
    const correctAnswers = ["cane", "gatto", "test"]; 

    if (correctAnswers.includes(input)) {
        // SUCCESSO
        loadLevel(99); // Vai alla schermata finale del gioco (definita nel primo script)
    } else {
        // ERRORE
        errorMsg.style.display = 'block';
        errorMsg.textContent = "Dato non corrispondente. Riprova.";
        
        // Scuote l'input (piccolo tocco di classe)
        const inputField = document.getElementById('final-keyword-input');
        inputField.style.animation = "shake 0.5s";
        setTimeout(() => { inputField.style.animation = ""; }, 500);
    }
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



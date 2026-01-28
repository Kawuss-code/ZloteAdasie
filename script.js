let voteIsBeingSent = false;

const NOMINEES = {
    nauczyciel: ["Pani Kowalska", "Pan Nowak", "Pani Wiśniewska"],
    wycieczka: ["Wycieczka do zoo", "Wycieczka do kina", "Wycieczka w góry"],
    przypal: ["Janek", "Kasia", "Marek"],
    przewodniczacy: ["Anna", "Tomek", "Piotr"],
    nieobecnosci: ["Ola", "Kacper", "Bartek"],
    duo: ["Marta & Ania", "Jan & Tomek", "Kasia & Ola"],
    glow_up: ["Monika", "Paweł", "Natalia"],
    wypowiedz: ["Adam", "Klaudia", "Łukasz"],
    osiagniecia: ["Asia", "Marcin", "Ewa"],
    sciagajacy: ["Filip", "Daria", "Michał"],
    osobowosc: ["Karolina", "Damian", "Patryk"],
    aura: ["Laura", "Kamil", "Natalia"],
    parkowanie: ["Piotr", "Szymon", "Mateusz"],
    sportowiec: ["Oliwia", "Robert", "Julia"],
    inteligent: ["Michał", "Anna", "Kacper"]
};

const CATEGORY_ICONS = {
    nauczyciel: "🧑‍🏫",
    wycieczka: "🚌",
    przypal: "🔥",
    przewodniczacy: "👑",
    nieobecnosci: "🚫",
    duo: "👯",
    glow_up: "💄",
    wypowiedz: "🗣️",
    osiagniecia: "🏆",
    sciagajacy: "📄",
    osobowosc: "😎",
    aura: "✨",
    parkowanie: "🅿️",
    sportowiec: "🏅",
    inteligent: "🧠"
};

const CATEGORY_NAMES = {
    nauczyciel: "Nauczyciel",
    wycieczka: "Wycieczka",
    przypal: "Przypał",
    przewodniczacy: "Przewodniczący",
    nieobecnosci: "Nieobecności",
    duo: "Duo",
    glow_up: "Glow Up",
    wypowiedz: "Wypowiedź",
    osiagniecia: "Osiągnięcia",
    sciagajacy: "Ściągający",
    osobowosc: "Osobowość",
    aura: "Aura",
    parkowanie: "Parkowanie",
    sportowiec: "Sportowiec",
    inteligent: "Inteligent"
};

let currentVoteStep = 0;
let voteData = {};

// INICJALIZACJA
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initNominees();
    initVoting();
    checkIfAlreadyVoted();
});

// NAWIGACJA
function initNavigation() {
    const navButtons = document.querySelectorAll('button[data-tab]');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.getAttribute('data-tab'));
        });
    });
}


function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    if (tabName != "home") {
        document.getElementById("info-box").classList.remove('show-info');
        document.getElementById("info-box").classList.add('hide-info');
    }

    if (tabName == "home") {
        document.getElementById("info-box").classList.remove('hide-info');
        document.getElementById("info-box").classList.add('show-info');
    }
        
    if (tabName === 'vote') {
        checkIfAlreadyVoted();
    }
}

// NOMINOWANI
function initNominees() {
    const container = document.getElementById('category-buttons');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.keys(NOMINEES).forEach(category => {
        const button = document.createElement('button');
        button.innerHTML = `${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}`;
        button.addEventListener('click', () => showNominees(category));
        container.appendChild(button);
    });
    
    // Inicjalizuj przycisk "Wróć" z event listenerem
    setTimeout(() => {
        const backBtn = document.getElementById('back-to-categories');
        if (backBtn) {
            backBtn.onclick = function(e) {
                e.preventDefault();
                backToCategories();
            };
        }
    }, 100);
}

function showNominees(category) {
    const buttonsContainer = document.getElementById('category-buttons');
    const listContainer = document.getElementById('nominee-list');
    const title = document.getElementById('category-title');
    const list = document.getElementById('nominees-spec');
    
    if (!buttonsContainer || !listContainer || !title || !list) return;
    
    buttonsContainer.style.display = 'none';
    listContainer.style.display = 'block';
    
    title.innerHTML = `${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}`;
    
    list.innerHTML = '';
    NOMINEES[category].forEach(nominee => {
        const li = document.createElement('li');
        li.textContent = nominee;
        list.appendChild(li);
    });

    const but = document.createElement('button');
    but.id = "back-to-categories";
    but.textContent = "⬅️ Wróć do kategorii";
    list.appendChild(but);
    
    // Upewnij się, że przycisk "Wróć" ma event listener
    const backBtn = document.getElementById('back-to-categories');
    if (backBtn) {
        backBtn.onclick = function(e) {
            e.preventDefault();
            backToCategories();
        };
    }
}

function backToCategories() {
    const buttonsContainer = document.getElementById('category-buttons');
    const listContainer = document.getElementById('nominee-list');
    
    if (buttonsContainer) buttonsContainer.style.display = '';
    if (listContainer) listContainer.style.display = 'none';
}

// GŁOSOWANIE
function initVoting() {
    const startBtn = document.getElementById('start-voting-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startVote);
    }
}

function checkIfAlreadyVoted() {
    const hasVoted = sessionStorage.getItem('zlote_adasie_voted');
    const voteStart = document.getElementById('vote-start');
    const voteForm = document.getElementById('vote-form');
    const voteBlocked = document.getElementById('vote-blocked');
    const voteSuccess = document.getElementById('vote-success');
    
    if (hasVoted) {
        if (voteStart) voteStart.style.display = 'none';
        if (voteForm) voteForm.style.display = 'none';
        if (voteBlocked) voteBlocked.style.display = 'block';
        if (voteSuccess) voteSuccess.style.display = 'none';
    } else {
        if (voteStart) voteStart.style.display = 'block';
        if (voteForm) voteForm.style.display = 'none';
        if (voteBlocked) voteBlocked.style.display = 'none';
        if (voteSuccess) voteSuccess.style.display = 'none';
    }
}

function startVote() {
    if (sessionStorage.getItem('zlote_adasie_voted')) {
        alert('Już oddałeś głos!');
        return;
    }
    
    currentVoteStep = 0;
    voteData = {};
    
    const voteStart = document.getElementById('vote-start');
    const voteForm = document.getElementById('vote-form');
    
    if (voteStart) voteStart.style.display = 'none';
    if (voteForm) voteForm.style.display = 'block';
    
    showVoteStep();
}

function showVoteStep() {
    const container = document.getElementById('vote-steps');
    if (!container) return;
    
    container.innerHTML = '';
    const categories = Object.keys(NOMINEES);
    
    // Krok 0: Imię i nazwisko
    if (currentVoteStep === 0) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'vote-step';
        stepDiv.innerHTML = `
            <h3>Podaj swoje imię i nazwisko</h3>
            <input type="text" id="fullname-input" placeholder="Imię i nazwisko" required>
            <br>
            <button type="button" id="next-step-0">Dalej ➡️</button>
        `;
        container.appendChild(stepDiv);
        
        const nextBtn = document.getElementById('next-step-0');
        if (nextBtn) {
            nextBtn.addEventListener('click', nextVoteStep);
        }
        return;
    }
    
    // Kroki 1-15: Kategorie
    if (currentVoteStep <= categories.length) {
        const categoryIndex = currentVoteStep - 1;
        const category = categories[categoryIndex];
        
        const stepDiv = document.createElement('div');
        stepDiv.className = 'vote-step';
        
        const progress = `Krok ${currentVoteStep} z ${categories.length}`;
        
        stepDiv.innerHTML = `
            <p class="progress-info">${progress}</p>
            <h3>${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}</h3>
            <div class="nominee-buttons" id="nominee-buttons-${category}"></div>
            <br>
            <button type="button" id="next-step-${currentVoteStep}" disabled>Dalej ➡️</button>
        `;
        container.appendChild(stepDiv);
        
        // Dodaj przyciski z kandydatami
        const buttonsContainer = document.getElementById(`nominee-buttons-${category}`);
        NOMINEES[category].forEach(nominee => {
            const btn = document.createElement('button');
            btn.className = 'nominee-btn';
            btn.textContent = nominee;
            btn.onclick = () => selectNominee(category, nominee, btn);
            buttonsContainer.appendChild(btn);
        });
        
        const nextBtn = document.getElementById(`next-step-${currentVoteStep}`);
        if (nextBtn) {
            nextBtn.addEventListener('click', nextVoteStep);
        }
        return;
    }
    
    // Ostatni krok: Wyślij
    if (currentVoteStep > categories.length) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'vote-step';
        stepDiv.innerHTML = `
            <h3>✅ Gotowe!</h3>
            <p>Sprawdź swoje odpowiedzi i wyślij głos.</p>
            <button type="button" id="submit-vote-btn" style="background:#4CAF50; border-color:#4CAF50;">
                Wyślij głos 🗳️
            </button>
        `;
        container.appendChild(stepDiv);
        
        const submitBtn = document.getElementById('submit-vote-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitVote);
        }
    }
}

function selectNominee(category, nominee, buttonElement) {
    // Usuń zaznaczenie z innych przycisków
    const allButtons = buttonElement.parentElement.querySelectorAll('.nominee-btn');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Zaznacz wybrany przycisk
    buttonElement.classList.add('selected');
    
    // Zapisz wybór
    voteData[category] = nominee;
    console.log('Zapisano:', category, '=', nominee);
    console.log('Wszystkie dane:', voteData);
    
    // Odblokuj przycisk "Dalej"
    const nextBtn = document.getElementById(`next-step-${currentVoteStep}`);
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function nextVoteStep() {
    const categories = Object.keys(NOMINEES);
    
    // Walidacja kroku 0 (imię i nazwisko)
    if (currentVoteStep === 0) {
        const fullnameInput = document.getElementById('fullname-input');
        if (!fullnameInput) return;
        
        const fullname = fullnameInput.value.trim();
        if (!fullname) {
            alert('Podaj imię i nazwisko!');
            return;
        }
        voteData.fullname = fullname;
    }
    
    // Walidacja kroków kategorii
    if (currentVoteStep > 0 && currentVoteStep <= categories.length) {
        const categoryIndex = currentVoteStep - 1;
        const category = categories[categoryIndex];
        
        if (!voteData[category]) {
            alert('Wybierz opcję przed przejściem dalej!');
            return;
        }
    }
    
    currentVoteStep++;
    showVoteStep();
}

async function submitVote() {
    // 🔒 Blokada przed wielokrotnym klikaniem
    if (voteIsBeingSent) {
        console.log("Już wysyłasz głos — ignoruję klik");
        return;
    }

    if (sessionStorage.getItem('zlote_adasie_voted')) {
        alert('Już oddałeś głos!');
        return;
    }

    voteIsBeingSent = true; // 🔒 BLOKADA LOGICZNA

    const submitBtn = document.getElementById("submit-vote-btn");
    if (submitBtn) {
        submitBtn.disabled = true;           // 🔒 BLOKADA FIZYCZNA
        submitBtn.textContent = "⏳ Wysyłanie...";
        submitBtn.style.opacity = "0.6";
    }

    try {
        console.log('Wysyłane dane:', voteData);

        const formData = new FormData();
        formData.append('fullname', voteData.fullname || '');
        formData.append('nauczyciel', voteData.nauczyciel || '');
        formData.append('wycieczka', voteData.wycieczka || '');
        formData.append('przypal', voteData.przypal || '');
        formData.append('przewodniczacy', voteData.przewodniczacy || '');
        formData.append('nieobecnosci', voteData.nieobecnosci || '');
        formData.append('duo', voteData.duo || '');
        formData.append('glow_up', voteData.glow_up || '');
        formData.append('wypowiedz', voteData.wypowiedz || '');
        formData.append('osiagniecia', voteData.osiagniecia || '');
        formData.append('sciagajacy', voteData.sciagajacy || '');
        formData.append('osobowosc', voteData.osobowosc || '');
        formData.append('aura', voteData.aura || '');
        formData.append('parkowanie', voteData.parkowanie || '');
        formData.append('sportowiec', voteData.sportowiec || '');
        formData.append('inteligent', voteData.inteligent || '');

        console.log('Wysyłam request...');

        await fetch("https://script.google.com/macros/s/AKfycbzD4enAz0jz9KMDiznBnO0ucAmkFOPbeh0Sr-kyRcVG_qOs7i6T4UtX_qfmBl9nV_ew/exec", {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });

        console.log('Request wysłany');

        // Zapis że już zagłosował
        sessionStorage.setItem('zlote_adasie_voted', 'true');

        const voteForm = document.getElementById('vote-form');
        const voteSuccess = document.getElementById('vote-success');

        if (voteForm) voteForm.style.display = 'none';
        if (voteSuccess) voteSuccess.style.display = 'block';

        if (submitBtn) {
            submitBtn.textContent = "✅ Głos wysłany!";
        }

    } catch (error) {
        console.error('Błąd:', error);
        alert('Nie udało się wysłać głosu. Sprawdź połączenie z internetem.');

        // ❗ W razie błędu można odblokować
        voteIsBeingSent = false;
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Wyślij głos 🗳️";
        }
    }
}

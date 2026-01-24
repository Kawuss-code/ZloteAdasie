// ======================
// DANE APLIKACJI
// ======================

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

const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwxYO2egn93Q4zcbczjwfCd-vLI_rOSl84ugHJG8_YLJwKUC8NickjJC-EvyeYS5eUT/exec";

let currentVoteStep = 0;
let voteData = {};

// ======================
// INICJALIZACJA
// ======================

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initNominees();
    initVoting();
    checkIfAlreadyVoted();
});

// ======================
// NAWIGACJA (ZAKŁADKI)
// ======================

function initNavigation() {
    const navButtons = document.querySelectorAll('nav button[data-tab]');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Ukryj wszystkie zakładki
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Pokaż wybraną zakładkę
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Sprawdź stan głosowania
    if (tabName === 'vote') {
        checkIfAlreadyVoted();
    }
}

// ======================
// NOMINOWANI
// ======================

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
    
    // Przycisk "Wróć"
    const backBtn = document.getElementById('back-to-categories');
    if (backBtn) {
        backBtn.addEventListener('click', backToCategories);
    }
}

function showNominees(category) {
    const buttonsContainer = document.getElementById('category-buttons');
    const listContainer = document.getElementById('nominee-list');
    const title = document.getElementById('category-title');
    const list = document.getElementById('nominees');
    
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
}

function backToCategories() {
    const buttonsContainer = document.getElementById('category-buttons');
    const listContainer = document.getElementById('nominee-list');
    
    if (buttonsContainer) buttonsContainer.style.display = 'grid';
    if (listContainer) listContainer.style.display = 'none';
}

// ======================
// GŁOSOWANIE
// ======================

function initVoting() {
    const startBtn = document.getElementById('start-voting-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startVote);
    }
}

function checkIfAlreadyVoted() {
    const voteStart = document.getElementById('vote-start');
    const voteForm = document.getElementById('vote-form');
    const voteBlocked = document.getElementById('vote-blocked');
    const voteSuccess = document.getElementById('vote-success');
    
    if (localStorage.getItem('zlote_adasie_voted')) {
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
    if (localStorage.getItem('zlote_adasie_voted')) {
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
        
        // Event listener dla przycisku
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
            <p style="opacity:0.7;">${progress}</p>
            <h3>${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}</h3>
            <select id="vote-select-${category}" required>
                <option value="">-- Wybierz --</option>
                ${NOMINEES[category].map(n => `<option value="${n}">${n}</option>`).join('')}
            </select>
            <br>
            <button type="button" id="next-step-${currentVoteStep}">Dalej ➡️</button>
        `;
        container.appendChild(stepDiv);
        
        // Event listener dla przycisku
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
        
        // Event listener dla przycisku wyślij
        const submitBtn = document.getElementById('submit-vote-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitVote);
        }
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
        const select = document.getElementById(`vote-select-${category}`);
        
        if (!select || !select.value) {
            alert('Wybierz opcję przed przejściem dalej!');
            return;
        }
        
        voteData[category] = select.value;
    }
    
    currentVoteStep++;
    showVoteStep();
}

async function submitVote() {
    if (localStorage.getItem('zlote_adasie_voted')) {
        alert('Już oddałeś głos!');
        return;
    }
    
    try {
        // Przygotuj dane do wysłania
        const formData = new FormData();
        Object.keys(voteData).forEach(key => {
            formData.append(key, voteData[key]);
        });
        
        // Wyślij do Google Sheets
        const response = await fetch("https://script.google.com/macros/s/AKfycbwxYO2egn93Q4zcbczjwfCd-vLI_rOSl84ugHJG8_YLJwKUC8NickjJC-EvyeYS5eUT/exec", {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            localStorage.setItem('zlote_adasie_voted', 'true');
            
            const voteForm = document.getElementById('vote-form');
            const voteSuccess = document.getElementById('vote-success');
            
            if (voteForm) voteForm.style.display = 'none';
            if (voteSuccess) voteSuccess.style.display = 'block';
        } else {
            alert('Wystąpił błąd podczas wysyłania głosu. Spróbuj ponownie.');
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Nie udało się wysłać głosu. Sprawdź połączenie z internetem.');
    }
}

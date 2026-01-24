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
// ZAKŁADKI
// ======================

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    if (tabName === 'vote') {
        checkIfAlreadyVoted();
    }
}

// ======================
// NOMINOWANI
// ======================

function initNominees() {
    const container = document.getElementById('category-buttons');
    container.innerHTML = '';
    
    Object.keys(NOMINEES).forEach(category => {
        const button = document.createElement('button');
        button.innerHTML = `${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}`;
        button.onclick = () => showNominees(category);
        container.appendChild(button);
    });
}

function showNominees(category) {
    document.getElementById('category-buttons').style.display = 'none';
    document.getElementById('nominee-list').style.display = 'block';
    
    const title = document.getElementById('category-title');
    title.innerHTML = `${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}`;
    
    const list = document.getElementById('nominees');
    list.innerHTML = '';
    
    NOMINEES[category].forEach(nominee => {
        const li = document.createElement('li');
        li.textContent = nominee;
        list.appendChild(li);
    });
}

function backToCategories() {
    document.getElementById('category-buttons').style.display = 'grid';
    document.getElementById('nominee-list').style.display = 'none';
}

// ======================
// GŁOSOWANIE
// ======================

function checkIfAlreadyVoted() {
    if (localStorage.getItem('zlote_adasie_voted')) {
        document.getElementById('vote-start').style.display = 'none';
        document.getElementById('vote-form').style.display = 'none';
        document.getElementById('vote-blocked').style.display = 'block';
        document.getElementById('vote-success').style.display = 'none';
    } else {
        document.getElementById('vote-start').style.display = 'block';
        document.getElementById('vote-form').style.display = 'none';
        document.getElementById('vote-blocked').style.display = 'none';
        document.getElementById('vote-success').style.display = 'none';
    }
}

function startVote() {
    if (localStorage.getItem('zlote_adasie_voted')) {
        alert('Już oddałeś głos!');
        return;
    }
    
    currentVoteStep = 0;
    voteData = {};
    
    document.getElementById('vote-start').style.display = 'none';
    document.getElementById('vote-form').style.display = 'block';
    
    showVoteStep();
}

function showVoteStep() {
    const container = document.getElementById('vote-steps');
    container.innerHTML = '';
    
    const categories = Object.keys(NOMINEES);
    
    // Krok 0: Imię i nazwisko
    if (currentVoteStep === 0) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'vote-step';
        stepDiv.innerHTML = `
            <h3>Podaj swoje imię i nazwisko</h3>
            <input type="text" id="fullname" placeholder="Imię i nazwisko" required>
            <br>
            <button type="button" onclick="nextVoteStep()">Dalej ➡️</button>
        `;
        container.appendChild(stepDiv);
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
            <button type="button" onclick="nextVoteStep()">Dalej ➡️</button>
        `;
        container.appendChild(stepDiv);
        return;
    }
    
    // Ostatni krok: Wyślij
    if (currentVoteStep > categories.length) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'vote-step';
        stepDiv.innerHTML = `
            <h3>✅ Gotowe!</h3>
            <p>Sprawdź swoje odpowiedzi i wyślij głos.</p>
            <button type="button" onclick="submitVote()" style="background:#4CAF50; border-color:#4CAF50;">
                Wyślij głos 🗳️
            </button>
        `;
        container.appendChild(stepDiv);
    }
}

function nextVoteStep() {
    const categories = Object.keys(NOMINEES);
    
    // Walidacja kroku 0
    if (currentVoteStep === 0) {
        const fullname = document.getElementById('fullname').value.trim();
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
        
        if (!select.value) {
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
            document.getElementById('vote-form').style.display = 'none';
            document.getElementById('vote-success').style.display = 'block';
        } else {
            alert('Wystąpił błąd podczas wysyłania głosu. Spróbuj ponownie.');
        }
    } catch (error) {
        console.error('Błąd:', error);
        alert('Nie udało się wysłać głosu. Sprawdź połączenie z internetem.');
    }
}

// ======================
// INICJALIZACJA
// ======================

document.addEventListener('DOMContentLoaded', function() {
    initNominees();
    checkIfAlreadyVoted();
});

let voteIsBeingSent = false;

const NOMINEES = {
    nauczyciel: [
        "Monika Twardowska Święs",
        "Tomasz Bulzak",
        "Aleksander Jarmoliński",
        "Beata Borkowska",
        "Ewa Młynarczyk",
        "Anna Gaborek"
    ],

    wycieczka: [
        "Obóz biologiczny",
        "Praga",
        "Chorwacja",
        "Zwierzyniec",
        "Wiedeń"
    ],

    przypal: [
        "Alkomat w Zwierzyńcu",
        "Ucieczka przed Panem Profesorem w toalecie",
        "Rozwalony kibel"
    ],

    przewodniczacy: [
        "Kasia Bulzak",
        "Oliwia Śliwa",
        "Janek Gurgul",
        "Kamil Szczapa",
        "Jagoda Talar",
        "Gabrysia Leśniak"
    ],

    nieobecnosci: [
        "Anna Leszko",
        "Wiktor Szabla",
        "Nicola Hojnor",
        "Kamil Szczapa",
        "Piotr Bugajski",
        "Julka Kroczek"
    ],

    duo: [
        "Wiktor Pater i Wiktor Szabla",
        "Oliwia Śliwa i Kasia Bulzak",
        "Karol Jasirkowski i Cyprian Bieda",
        "Ignacy Grzegorzek i Błażej Dyrek",
        "Gabrys i Marcel Leśniak",
        "Kroczek i Halota"
    ],

    glow_up: [
        "Wiktor Pater",
        "Matylda Marańska",
        "Cyprian Bieda",
        "Zosia Dyrek",
        "Alicja Kościsz",
        "Maciek Tabak"
    ],

    wypowiedz: [
        "Pani Lorek do Kasi Dominik - \"Monika, dostałam twoje zwolnienie\" / \"Proszę pani ale ja jestem Kasia\" / \"ja widzę że jesteś w klasie\"",
        "Wiktor Pater - \"Prosze pani bo ja sie pawełków najadłem\"",
        "Aleksander Jarmoliński - \"Uciekaj mi stąd!\"",
        "Beata Bo*ska - \"Wy wszyscy macie autyzm\"",
        "Piotr Bugajski - \"P. Twardowska Piotrek odloz telefon .Piotrek nie moge rozmawiam z klientem\"",
        "Maciek Tabak - \"a do szescianu to a**6\""
    ],

    osiagniecia: [
        "Weronika Kowalczyk",
        "Dawid Kośinski",
        "Zosia Dyrek",
        "Tosia Wąchala",
        "Marcel i Gabrys Leśniak"
    ],

    sciagajacy: [
        "Oliwia Śliwa",
        "Janek Gurgul",
        "Gosia Gryzło",
        "Bartek Olech",
        "Jagoda Talar",
        "Patryk Homoncik"
    ],

    osobowosc: [
        "Kasia Bulzak",
        "Weronika Kowalczyk",
        "Adam Szyszka",
        "Michał Litwinski",
        "Alicja Kościsz",
        "Kasia Mikołajczyk"
    ],

    styl: [
        "Gosia Gryzło",
        "Matylda Marańska",
        "Szymon Respekta",
        "Michał Litwinski",
        "Asia Rusnarczyk",
        "Madzia Wrobel"
    ],

    kierowca: [
        "Wiktoria Pietryga",
        "Daria Parużnik",
        "Adam Szyszka",
        "Michał Litwinski",
        "Karolina Stanek",
        "Jagoda Talar"
    ],

    sportowiec: [
        "Amelka Pakosińska",
        "Oliwia Śliwa",
        "Olaf Piętka",
        "Julka Gumulak",
        "Marcel i Gabrys Leśniak"
    ]
};

const VOTE_CATEGORIES = [
    'nauczyciel',
    'wycieczka',
    'przypal',
    'przewodniczacy',
    'nieobecnosci',
    'duo',
    'glow_up',
    'wypowiedz',
    'osiagniecia',
    'sciagajacy',
    'osobowosc',
    'styl',
    'kierowca',
    'sportowiec'
];


const CATEGORY_ICONS = {
    nauczyciel: "🧑‍🏫",
    wycieczka: "🚌",
    przypal: "🔥",
    przewodniczacy: "👑",
    nieobecnosci: "🚫",
    duo: "👯",
    glow_up: "✨",
    wypowiedz: "🗣️",
    osiagniecia: "🏆",
    sciagajacy: "📄",
    osobowosc: "😎",
    styl: "👗",
    kierowca: "🚗",
    sportowiec: "🏅"
};


const CATEGORY_NAMES = {
    nauczyciel: "Ulubiony nauczyciel",
    wycieczka: "Najlepsza wycieczka",
    przypal: "Najmocniejszy przypał",
    przewodniczacy: "Najlepszy przewodniczący",
    nieobecnosci: "Najwięcej nieobecności",
    duo: "Najlepsze duo",
    glow_up: "Największy glow up",
    wypowiedz: "Najlepsza wypowiedź",
    osiagniecia: "Największe osiągnięcia",
    sciagajacy: "Najlepszy ściągający",
    osobowosc: "Najlepsza osobowość",
    styl: "Najlepszy styl",
    kierowca: "Najlepszy kierowca",
    sportowiec: "Najlepszy sportowiec"
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

    // Krok 0: Imię i nazwisko
    if (currentVoteStep === 0) {
        container.innerHTML = `
            <div class="vote-step">
                <h3>Podaj swoje imię i nazwisko</h3>
                <input type="text" id="fullname-input" placeholder="Imię i nazwisko" required>
                <br>
                <button type="button" id="next-step-0">Dalej ➡️</button>
            </div>
        `;
        document.getElementById('next-step-0').addEventListener('click', nextVoteStep);
        return;
    }

    // Kategoria głosowania
    const categoryIndex = currentVoteStep - 1;
    if (categoryIndex < VOTE_CATEGORIES.length) {
        const category = VOTE_CATEGORIES[categoryIndex];
        const nominees = NOMINEES[category];

        container.innerHTML = `
            <div class="vote-step">
                <p class="progress-info">Krok ${currentVoteStep} z ${VOTE_CATEGORIES.length}</p>
                <h3>${CATEGORY_ICONS[category]} ${CATEGORY_NAMES[category]}</h3>
                <div class="nominee-buttons" id="nominee-buttons-${category}"></div>
                <br>
                <button type="button" id="next-step-${currentVoteStep}" disabled>Dalej ➡️</button>
            </div>
        `;

        const buttonsContainer = document.getElementById(`nominee-buttons-${category}`);
        nominees.forEach(nominee => {
            const btn = document.createElement('button');
            btn.className = 'nominee-btn';
            btn.textContent = nominee;
            btn.onclick = () => selectNominee(category, nominee, btn);
            buttonsContainer.appendChild(btn);
        });

        document.getElementById(`next-step-${currentVoteStep}`).addEventListener('click', nextVoteStep);
        return;
    }

    // Ostatni krok: Wyślij
    if (categoryIndex >= VOTE_CATEGORIES.length) {
        container.innerHTML = `
            <div class="vote-step">
                <h3>✅ Gotowe!</h3>
                <p>Sprawdź swoje odpowiedzi i wyślij głos.</p>
                <button type="button" id="submit-vote-btn" style="background:#4CAF50; border-color:#4CAF50;">
                    Wyślij głos 🗳️
                </button>
            </div>
        `;
        document.getElementById('submit-vote-btn').addEventListener('click', submitVote);
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
    // Krok 0: zapis imienia i nazwiska
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

    // Kategorie
    const categoryIndex = currentVoteStep - 1;
    if (categoryIndex >= 0 && categoryIndex < VOTE_CATEGORIES.length) {
        const category = VOTE_CATEGORIES[categoryIndex];
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
        formData.append('styl', voteData.styl || '');
        formData.append('kierowca', voteData.kierowca || '');
        formData.append('sportowiec', voteData.sportowiec || '');

        console.log("STYL:", voteData.styl);
        console.log("KIEROWCA:", voteData.kierowca);


        console.log('Wysyłam request...');

        await fetch("https://script.google.com/macros/s/AKfycbyjNK7EzBL4-5YgS9U9AjoBLxasz4URCKPgso7sD8vD5cHG7eSICA2y9PGxpf5W8CR_/exec", {
            method: 'POST',
            // mode: 'no-cors',
            body: formData
        });

        console.log('Request wysłany');

        // Zapis że już zagłosował
        sessionStorage.setItem('zlote_adasie_voted', 'true');

        const voteForm = document.getElementById('vote-form');
        const voteSuccess = document.getElementById('vote-success');

        if (voteForm) voteForm.style.display = 'none';
        if (voteSuccess) voteSuccess.style.display = 'block';

        showVoteSummary();

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

function showVoteSummary() {
    const summaryDiv = document.getElementById("vote-summary");
    if (!summaryDiv) return;

    let html = `
        <h3>📄 Twoje odpowiedzi</h3>
        <p><strong>Imię i nazwisko:</strong> ${voteData.fullname}</p>
        <ul>
    `;

    const categories = Object.keys(NOMINEES);

    categories.forEach(cat => {
        html += `
            <li>
                <strong>${CATEGORY_ICONS[cat]} ${CATEGORY_NAMES[cat]}:</strong><br>
                ${voteData[cat] || "-"}
            </li>
        `;
    });

    html += `
        </ul>
        <p style="margin-top:20px; opacity:0.7;">📸 Możesz zrobić screena tego potwierdzenia</p>
    `;

    summaryDiv.innerHTML = html;
    summaryDiv.style.display = "block";
}

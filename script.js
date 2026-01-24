// === ZAKŁADKI ===
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    if (tabId === "vote") {
        checkVoteBlock();
    }
}

// === NOMINOWANI ===
const categories = {
    best: {
        name: "🏆 Najlepszy Adasiu",
        nominees: ["Adasiu Wielki", "Adasiu Legendarny", "Adasiu Turbo"]
    },
    funny: {
        name: "😂 Najśmieszniejszy",
        nominees: ["Adasiu Mem", "Adasiu Śmieszek", "Adasiu Komik"]
    }
};

function showNominees(key) {
    const cat = categories[key];

    document.getElementById("nomineeCategories").style.display = "none";
    document.getElementById("nomineeResults").classList.remove("hidden");

    document.getElementById("nomineeCategoryTitle").innerText = cat.name;

    const list = document.getElementById("nomineeList");
    list.innerHTML = "";
    cat.nominees.forEach(n => {
        const li = document.createElement("li");
        li.innerText = n;
        list.appendChild(li);
    });
}

function backToNomineeCategories() {
    document.getElementById("nomineeCategories").style.display = "flex";
    document.getElementById("nomineeResults").classList.add("hidden");
}

// === BLOKADA 1 GŁOS ===
function checkVoteBlock() {
    if (localStorage.getItem("zlote_adasie_voted")) {
        document.getElementById("voteStart").classList.add("hidden");
        document.getElementById("voteForm").classList.add("hidden");
        document.getElementById("vote-finish").classList.remove("hidden");
        document.getElementById("vote-finish").innerHTML = `
            <h3>❌ Już oddałeś głos</h3>
            <p>Można głosować tylko raz.</p>
        `;
        return true;
    }
    return false;
}

// === WIZARD ===
function startVoting() {
    if (checkVoteBlock()) return;

    document.getElementById("voteStart").classList.add("hidden");
    document.getElementById("voteForm").classList.remove("hidden");
    document.getElementById("step1").classList.remove("hidden");
    document.getElementById("step2").classList.add("hidden");
}

function goToStep2() {
    const fullname = document.querySelector('input[name="fullname"]').value.trim();

    if (!fullname) {
        alert("Podaj imię i nazwisko!");
        return;
    }

    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.remove("hidden");
}

// === SUBMIT DO GOOGLE SHEETS ===
document.getElementById("voteForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    if (localStorage.getItem("zlote_adasie_voted")) return;

    const formData = new FormData(this); // THIS = formularz

    try {
        const res = await fetch("https://script.google.com/macros/s/AKfycbwxYO2egn93Q4zcbczjwfCd-vLI_rOSl84ugHJG8_YLJwKUC8NickjJC-EvyeYS5eUT/exec", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            localStorage.setItem("zlote_adasie_voted", "true");
            document.getElementById("voteForm").classList.add("hidden");
            document.getElementById("vote-finish").classList.remove("hidden");
        } else {
            alert("Błąd przy zapisie głosu");
        }
    } catch (err) {
        alert("Błąd połączenia z serwerem");
        console.error(err);
    }
});




// === TABY ===
function showTab(tabId){
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(tabId==='vote') checkVoteBlock();
}

// === NOMINOWANI ===
const nomineesData = {
    nauczyciel:["Pani Kowalska","Pan Nowak","Pani Wiśniewska"],
    wycieczka:["Wycieczka do zoo","Wycieczka do kina","Wycieczka w góry"],
    przypal:["Janek","Kasia","Marek"],
    przewodniczacy:["Anna","Tomek","Piotr"],
    nieobecnosci:["Ola","Kacper","Bartek"],
    duo:["Marta & Ania","Jan & Tomek","Kasia & Ola"],
    glow_up:["Monika","Paweł","Natalia"],
    wypowiedz:["Adam","Klaudia","Łukasz"],
    osiagniecia:["Asia","Marcin","Ewa"],
    sciagajacy:["Filip","Daria","Michał"],
    osobowosc:["Karolina","Damian","Patryk"],
    aura:["Laura","Kamil","Natalia"],
    parkowanie:["Piotr","Szymon","Mateusz"],
    sportowiec:["Oliwia","Robert","Julia"],
    inteligent:["Michał","Anna","Kacper"]
};

function showNominees(category){
    document.getElementById("nomineeCategories").style.display = "none";
    document.getElementById("nomineeResults").classList.remove("hidden");
    document.getElementById("nomineeCategoryTitle").innerText = category;
    const list = document.getElementById("nomineeList");
    list.innerHTML = "";
    nomineesData[category].forEach(n=>{
        const li=document.createElement("li");
        li.innerText = n;
        list.appendChild(li);
    });
}

function backToNomineeCategories(){
    document.getElementById("nomineeCategories").style.display = "flex";
    document.getElementById("nomineeResults").classList.add("hidden");
}

// === BLOKADA 1 GŁOS ===
function checkVoteBlock(){
    if(localStorage.getItem("zlote_adasie_voted")){
        document.getElementById("voteStart").classList.add("hidden");
        document.getElementById("voteForm").classList.add("hidden");
        document.getElementById("vote-finish").classList.remove("hidden");
        document.getElementById("vote-finish").innerHTML='<h3>❌ Już oddałeś głos</h3><p>Można głosować tylko raz.</p>';
        return true;
    }
    return false;
}

// === WIZARD GŁOSOWANIA ===
const categories = ["nauczyciel","wycieczka","przypal","przewodniczacy","nieobecnosci","duo",
"glow_up","wypowiedz","osiagniecia","sciagajacy","osobowosc","aura","parkowanie","sportowiec","inteligent"];

let currentStep = 0;

function startVoting(){
    if(checkVoteBlock()) return;
    document.getElementById("voteStart").classList.add("hidden");
    document.getElementById("voteForm").classList.remove("hidden");
    document.getElementById("step0").classList.add("active");
    currentStep = 0;
}

// Funkcja do przejścia do następnego kroku
function nextStep(){
    const step0Input = document.querySelector('#step0 input[name="fullname"]');
    if(!step0Input.value.trim()){
        alert("Podaj imię i nazwisko!");
        return;
    }
    document.getElementById("step0").classList.remove("active");
    currentStep = 0;
    generateStep(currentStep);
}


function generateStep(step){
    const container = document.getElementById("stepContainer");
    container.innerHTML = "";
    if(step >= categories.length){
        const btn = document.createElement("button");
        btn.type="submit";
        btn.innerText="✅ Wyślij głos";
        container.appendChild(btn);
        return;
    }
    const cat = categories[step];
    const h3 = document.createElement("h3");
    h3.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
    container.appendChild(h3);

    const select = document.createElement("select");
    select.name = cat;
    select.required = true;
    const empty = document.createElement("option");
    empty.value = ""; empty.innerText = "-- Wybierz --";
    select.appendChild(empty);

    nomineesData[cat].forEach(n=>{
        const opt=document.createElement("option");
        opt.value=n; opt.innerText=n;
        select.appendChild(opt);
    });

    container.appendChild(select);

    const btn = document.createElement("button");
    btn.type="button"; btn.innerText="➡️ Dalej";
    btn.onclick=function(){ 
        currentStep++; 
        generateStep(currentStep); 
    };
    container.appendChild(btn);
}

// === SUBMIT DO GOOGLE SHEETS ===
document.getElementById("voteForm").addEventListener("submit", async function(e){
    e.preventDefault();
    if(checkVoteBlock()) return;

    const formData = new FormData(this);
    try{
        const res = await fetch("https://script.google.com/macros/s/AKfycbwxYO2egn93Q4zcbczjwfCd-vLI_rOSl84ugHJG8_YLJwKUC8NickjJC-EvyeYS5eUT/exec",{
            method:"POST",
            body: formData
        });
        if(res.ok){
            localStorage.setItem("zlote_adasie_voted","true");
            document.getElementById("voteForm").classList.add("hidden");
            document.getElementById("vote-finish").classList.remove("hidden");
        }else{
            alert("Błąd przy zapisie głosu");
        }
    }catch(err){
        alert("Błąd połączenia z serwerem");
        console.error(err);
    }
});

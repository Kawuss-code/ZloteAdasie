window.addEventListener("DOMContentLoaded", () => {

// === DANE NOMINOWANYCH ===
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

const categories = Object.keys(nomineesData);
let currentStep=0;
const votes={};

// === TABY ===
window.showTab = function(tabId){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// === NOMINOWANI ===
const nomineeCategoriesDiv=document.getElementById("nomineeCategories");
Object.keys(nomineesData).forEach(cat=>{
  let btn=document.createElement("button");
  btn.innerText=cat;
  btn.onclick=()=>showNominees(cat);
  nomineeCategoriesDiv.appendChild(btn);
});

function showNominees(category){
  document.getElementById("nomineeCategories").style.display="none";
  document.getElementById("nomineeResults").style.display="block";
  document.getElementById("nomineeCategoryTitle").innerText=category;
  let list=document.getElementById("nomineeList");
  list.innerHTML="";
  nomineesData[category].forEach(n=>{
    let li=document.createElement("li");
    li.innerText=n;
    list.appendChild(li);
  });
}

window.backToNomineeCategories = function(){
  document.getElementById("nomineeCategories").style.display="block";
  document.getElementById("nomineeResults").style.display="none";
}

// === BLOKADA 1 GŁOS ===
function checkVoteBlock(){
  if(localStorage.getItem("zlote_adasie_voted")){
    document.getElementById("voteStart").style.display="none";
    document.getElementById("voteForm").style.display="none";
    const finish = document.getElementById("vote-finish");
    finish.style.display="block";
    finish.innerHTML='<h3>❌ Już oddałeś głos</h3><p>Można głosować tylko raz.</p>';
    return true;
  }
  return false;
}
window.checkVoteBlock = checkVoteBlock;

// === GŁOSOWANIE ===
window.startVoting = function(){
  if(checkVoteBlock()) return;
  currentStep=0;
  votes.fullname="";
  document.getElementById("voteStart").style.display="none";
  document.getElementById("voteForm").style.display="block";
  document.getElementById("step0").style.display="block";
  document.getElementById("stepContainer").innerHTML="";
  document.getElementById("vote-finish").style.display="none";
}

window.nextStep = function(){
  let name=document.getElementById("fullname").value.trim();
  if(!name){alert("Podaj imię i nazwisko!"); return;}
  votes.fullname=name;
  document.getElementById("step0").style.display="none";
  showCategoryStep();
}

function showCategoryStep(){
  let container=document.getElementById("stepContainer");
  container.innerHTML="";
  if(currentStep>=categories.length){
    const finish=document.getElementById("vote-finish");
    finish.style.display="block";
    finish.innerHTML="<h3>🎉 Gratulacje! Zakończyłeś głosowanie!</h3>";
    submitVote();
    return;
  }
  let cat=categories[currentStep];
  let h3=document.createElement("h3");
  h3.innerText=cat;
  container.appendChild(h3);

  let optionsDiv=document.createElement("div");
  optionsDiv.className="vote-options";
  nomineesData[cat].forEach(n=>{
    let btn=document.createElement("button");
    btn.innerText=n;
    btn.onclick=()=>{
      votes[cat]=n;
      currentStep++;
      showCategoryStep();
    };
    optionsDiv.appendChild(btn);
  });
  container.appendChild(optionsDiv);

  if(currentStep>0){
    let backBtn=document.createElement("button");
    backBtn.innerText="⬅ Wróć";
    backBtn.onclick=()=>{
      currentStep--;
      showCategoryStep();
    };
    container.appendChild(backBtn);
  }
}

// === WYSLANIE DO GOOGLE SHEETS ===
function submitVote(){
  const formData = new FormData();
  Object.keys(votes).forEach(k => formData.append(k,votes[k]));

  // TU WKLEJ SWOJ URL Z APPS SCRIPT
  fetch("https://script.google.com/macros/s/AKfycbwxYO2egn93Q4zcbczjwfCd-vLI_rOSl84ugHJG8_YLJwKUC8NickjJC-EvyeYS5eUT/exec",{
    method:"POST",
    body: formData
  }).then(res=>{
    if(res.ok){
      localStorage.setItem("zlote_adasie_voted","true");
    }else{
      alert("Błąd przy zapisie głosu");
    }
  }).catch(err=>{
    alert("Błąd połączenia z serwerem");
    console.error(err);
  });
}

});

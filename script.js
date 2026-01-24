// Czekamy aż DOM będzie gotowy
window.addEventListener("DOMContentLoaded", () => {

const nomineesData = {
  nauczyciel:["Pani Kowalska","Pan Nowak","Pani Wiśniewska"],
  wycieczka:["Wycieczka do zoo","Wycieczka do kina","Wycieczka w góry"]
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

// === GŁOSOWANIE ===
window.startVoting = function(){
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
    let finish=document.getElementById("vote-finish");
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

// funkcja do wysyłania głosu
function submitVote(){
  console.log("Głos wysłany:",votes);
  // Tutaj możesz wstawić fetch do Google Sheets
}

});

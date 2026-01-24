window.addEventListener("DOMContentLoaded", () => {

  // === TABY ===
  function showTab(tabId){
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
      if(tabId==='vote') checkVoteBlock();
  }
  window.showTab = showTab; // żeby przycisk mógł wywołać

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

  const nomineeCategoriesDiv = document.getElementById("nomineeCategories");
  Object.keys(nomineesData).forEach(cat=>{
      const btn = document.createElement("button");
      btn.innerText = cat.replace("_"," ").replace(/\b\w/g,l=>l.toUpperCase());
      btn.onclick=()=>showNominees(cat);
      nomineeCategoriesDiv.appendChild(btn);
  });

  function showNominees(category){
      document.getElementById("nomineeCategories").style.display = "none";
      document.getElementById("nomineeResults").classList.remove("hidden");
      document.getElementById("nomineeCategoryTitle").innerText = category.replace("_"," ").replace(/\b\w/g,l=>l.toUpperCase());
      const list = document.getElementById("nomineeList");
      list.innerHTML = "";
      nomineesData[category].forEach(n=>{
          const li=document.createElement("li");
          li.innerText=n;
          list.appendChild(li);
      });
  }
  window.backToNomineeCategories = function(){
      document.getElementById("nomineeCategories").style.display = "flex";
      document.getElementById("nomineeResults").classList.add("hidden");
  }

  // === BLOKADA 1 GŁOS ===
  function checkVoteBlock(){
      if(localStorage.getItem("zlote_adasie_voted")){
          document.getElementById("voteStart").classList.add("hidden");
          document.getElementById("voteForm").classList.add("hidden");
          const finish = document.getElementById("vote-finish");
          finish.classList.remove("hidden");
          finish.innerHTML='<h3>❌ Już oddałeś głos</h3><p>Można głosować tylko raz.</p>';
          return true;
      }
      return false;
  }
  window.checkVoteBlock = checkVoteBlock;

  // === GŁOSOWANIE PRZY POMOCY GUZIKÓW ===
  const categories = Object.keys(nomineesData);
  let currentStep = 0;
  const votes = {};

  window.startVoting = function(){
      if(checkVoteBlock()) return;
      document.getElementById("voteStart").classList.add("hidden");
      document.getElementById("voteForm").classList.remove("hidden");
      currentStep = 0;
      votes.fullname = "";
      showStep0();
  }

  function showStep0(){
      document.getElementById("step0").classList.add("active");
      document.getElementById("stepContainer").innerHTML="";
  }
  window.nextStep = function(){
      const name = document.getElementById("fullname").value.trim();
      if(!name){
          alert("Podaj imię i nazwisko!");
          return;
      }
      votes.fullname = name;
      document.getElementById("step0").classList.remove("active");
      showCategoryStep();
  }

  function showCategoryStep(){
    const container = document.getElementById("stepContainer");
    container.innerHTML = "";
    container.classList.add("active"); // dodaj, żeby był widoczny


      if(currentStep >= categories.length){
          const finish = document.getElementById("vote-finish");
          finish.classList.remove("hidden");
          finish.innerHTML=`<h3>🎉 Gratulacje! Zakończyłeś głosowanie!</h3>
                            <p>Dziękujemy za Twój głos.</p>`;
          submitVote();
          return;
      }

      const cat = categories[currentStep];
      const h3 = document.createElement("h3");
      h3.innerText = cat.replace("_"," ").replace(/\b\w/g,l=>l.toUpperCase());
      container.appendChild(h3);

      const optionsDiv = document.createElement("div");
      optionsDiv.className = "vote-options";

      nomineesData[cat].forEach(n=>{
          const btn = document.createElement("button");
          btn.type="button";
          btn.innerText = n;
          btn.onclick=()=>{
              votes[cat]=n;
              currentStep++;
              showCategoryStep();
          };
          optionsDiv.appendChild(btn);
      });

      container.appendChild(optionsDiv);

      if(currentStep>0){
          const backBtn = document.createElement("button");
          backBtn.type="button";
          backBtn.innerText="⬅ Wróć";
          backBtn.onclick=()=>{
              currentStep--;
              showCategoryStep();
          };
          container.appendChild(backBtn);
      }
  }

  function submitVote(){
      const formData = new FormData();
      Object.keys(votes).forEach(k=>formData.append(k,votes[k]));

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

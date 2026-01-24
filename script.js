function showTab(tabId){
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(tabId==='vote') checkVoteBlock();
}

function checkVoteBlock(){
    if(localStorage.getItem('zlote_adasie_voted')){
        document.getElementById('voteStart').classList.add('hidden');
        document.getElementById('voteForm').classList.add('hidden');
        document.getElementById('vote-finish').classList.remove('hidden');
        document.getElementById('vote-finish').innerHTML = '<h3>❌ Już oddałeś głos</h3><p>Można głosować tylko raz.</p>';
        return true;
    }
    return false;
}

function startVoting(){
    if(checkVoteBlock()) return;
    document.getElementById('voteStart').classList.add('hidden');
    document.getElementById('voteForm').classList.remove('hidden');
}

document.getElementById('voteForm').addEventListener('submit', async function(e){
    e.preventDefault();
    if(checkVoteBlock()) return;

    const formData = new FormData(this);

    try{
        const res = await fetch('https://script.google.com/macros/s/AKfycbwxYO2egn93Q4zcbczjwfCd-vLI_rOSl84ugHJG8_YLJwKUC8NickjJC-EvyeYS5eUT/exec',{
            method:'POST',
            body: formData
        });
        if(res.ok){
            localStorage.setItem('zlote_adasie_voted','true');
            document.getElementById('voteForm').classList.add('hidden');
            document.getElementById('vote-finish').classList.remove('hidden');
        } else{
            alert('Błąd przy zapisie głosu');
        }
    }catch(err){
        alert('Błąd połączenia z serwerem');
        console.error(err);
    }
});

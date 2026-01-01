// STATE
let xp = parseInt(localStorage.getItem('work_xp')) || 0;
let balance = parseFloat(localStorage.getItem('work_bal')) || 0;
let history = JSON.parse(localStorage.getItem('work_hist')) || [];
let quests = JSON.parse(localStorage.getItem('work_quests')) || [
    {id: 1, title: "CRACK_THE_CODE_01", reward: 0.1}
];

// TAB SWITCHING
function showTab(tabId) {
    document.querySelectorAll('.v-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.v-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

function updateUI() {
    document.getElementById('nav-bal').innerText = balance.toFixed(2);
    document.getElementById('nav-xp').innerText = xp;
    renderQuests();
    renderLeaderboard();
    renderHistory();
}

function deployQuest() {
    const t = document.getElementById('qTitle').value;
    const r = document.getElementById('qRew').value;
    if(!t || !r) return;

    quests.unshift({ id: Date.now(), title: t.toUpperCase(), reward: parseFloat(r) });
    localStorage.setItem('work_quests', JSON.stringify(quests));
    
    document.getElementById('qTitle').value = "";
    document.getElementById('qRew').value = "";
    showTab('quests');
    updateUI();
}

function completeQuest(id, r, title) {
    xp += 100;
    balance += r;
    quests = quests.filter(q => q.id !== id);
    history.unshift({ task: title, amt: r });

    localStorage.setItem('work_xp', xp);
    localStorage.setItem('work_bal', balance);
    localStorage.setItem('work_quests', JSON.stringify(quests));
    localStorage.setItem('work_hist', JSON.stringify(history.slice(0, 5)));

    updateUI();
}

function renderQuests() {
    const feed = document.getElementById('quest-feed');
    feed.innerHTML = quests.map(q => `
        <div class="quest-item">
            <h4 style="margin:0">${q.title}</h4>
            <p class="code-comment">REWARD: ${q.reward} MATIC // STATUS: OPEN</p>
            <button class="vibe-btn" onclick="completeQuest(${q.id}, ${q.reward}, '${q.title}')">EXECUTE</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const board = document.getElementById('leaderboard');
    const all = [{ name: "YOU", xp: xp, isMe: true }, { name: "CYBER_P", xp: 1200 }, { name: "NULL_P", xp: 800 }].sort((a,b) => b.xp - a.xp);
    board.innerHTML = all.map((u, i) => `
        <tr style="border-bottom: 1px solid #222; ${u.isMe ? 'background:white; color:black;' : ''}">
            <td style="padding:15px">#${i+1}</td>
            <td>${u.name}</td>
            <td style="text-align:right; padding-right:15px">${u.xp} XP</td>
        </tr>
    `).join('');
}

function renderHistory() {
    const feed = document.getElementById('history-feed');
    feed.innerHTML = history.map(h => `
        <div class="history-item">
            <span>> ${h.task}</span>
            <span>+${h.amt}</span>
        </div>
    `).join('');
}

// MODAL CONTROLS
function openWithdraw() { document.getElementById('modal-bal').innerText = balance.toFixed(2); document.getElementById('v-modal').style.display = 'flex'; }
function closeWithdraw() { document.getElementById('withdraw-modal').style.display = 'none'; }
function processWithdraw() { 
    balance = 0; localStorage.setItem('work_bal', balance); 
    closeWithdraw(); updateUI(); alert("LIQUIDATION_COMPLETE"); 
}

updateUI();

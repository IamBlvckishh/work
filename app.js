// --- STATE MANAGEMENT ---
let xp = parseInt(localStorage.getItem('work_xp')) || 0;
let balance = parseFloat(localStorage.getItem('work_bal')) || 0;
let history = JSON.parse(localStorage.getItem('work_hist')) || [];
let totalPaid = parseFloat(localStorage.getItem('work_total_paid')) || 0;

const competitors = [
    { name: "OxMorpheus", xp: 1850 },
    { name: "NeoSwap", xp: 1200 },
    { name: "BlockMaster", xp: 600 }
];

// --- CORE FUNCTIONS ---
function updateUI() {
    document.getElementById('nav-bal').innerText = `${balance.toFixed(2)} MATIC`;
    document.getElementById('nav-xp').innerText = `${xp} XP`;
    document.getElementById('total-dist').innerText = totalPaid.toFixed(2);
    
    renderQuests();
    renderLeaderboard();
    renderHistory();
}

function deployQuest() {
    const t = document.getElementById('qTitle').value;
    const r = document.getElementById('qRew').value;
    if(!t || !r) return alert("Please enter a title and reward");

    const quests = JSON.parse(localStorage.getItem('work_quests')) || [];
    quests.unshift({ id: Date.now(), title: t, reward: parseFloat(r) });
    localStorage.setItem('work_quests', JSON.stringify(quests));
    
    document.getElementById('qTitle').value = "";
    document.getElementById('qRew').value = "";
    updateUI();
}

function completeQuest(id, r, title) {
    xp += 100;
    balance += r;
    totalPaid += r;

    const quests = JSON.parse(localStorage.getItem('work_quests')).filter(q => q.id !== id);
    history.unshift({ task: title, amt: r, time: new Date().toLocaleTimeString() });

    localStorage.setItem('work_xp', xp);
    localStorage.setItem('work_bal', balance);
    localStorage.setItem('work_total_paid', totalPaid);
    localStorage.setItem('work_quests', JSON.stringify(quests));
    localStorage.setItem('work_hist', JSON.stringify(history.slice(0, 5)));

    updateUI();
}

function renderQuests() {
    const feed = document.getElementById('quest-feed');
    const quests = JSON.parse(localStorage.getItem('work_quests')) || [];
    feed.innerHTML = quests.map(q => `
        <div class="quest-item">
            <div>
                <h4>${q.title}</h4>
                <span class="reward-tag">+100 XP | ${q.reward} MATIC</span>
            </div>
            <button style="width:auto" onclick="completeQuest(${q.id}, ${q.reward}, '${q.title}')">Claim</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const board = document.getElementById('leaderboard');
    const all = [...competitors, { name: "You", xp: xp, isMe: true }].sort((a,b) => b.xp - a.xp);
    board.innerHTML = all.map((u, i) => `
        <tr class="${u.isMe ? 'is-me' : ''}">
            <td>#${i+1}</td>
            <td>${u.name}</td>
            <td style="text-align:right">${u.xp} XP</td>
        </tr>
    `).join('');
}

function renderHistory() {
    const feed = document.getElementById('history-feed');
    feed.innerHTML = history.map(h => `
        <div class="history-item">
            <span>${h.task}</span>
            <span style="color:var(--success)">+${h.amt} MATIC</span>
        </div>
    `).join('');
}

// Initial Boot
if(!localStorage.getItem('work_quests')) {
    localStorage.setItem('work_quests', JSON.stringify([{id: 1, title: "Initial Onboarding", reward: 0.10}]));
}
updateUI();

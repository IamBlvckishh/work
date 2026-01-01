// --- STATE ---
let xp = parseInt(localStorage.getItem('work_xp')) || 0;
let balance = parseFloat(localStorage.getItem('work_bal')) || 0;
let history = JSON.parse(localStorage.getItem('work_hist')) || [];
let quests = JSON.parse(localStorage.getItem('work_quests')) || [
    {id: 1, title: "Initial Platform Review", reward: 0.25}
];

const competitors = [
    { name: "Alpha_User", xp: 1400 },
    { name: "Node_Runner", xp: 900 },
    { name: "Dev_Zero", xp: 550 }
];

// --- TAB LOGIC ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- CORE LOGIC ---
function updateUI() {
    document.getElementById('nav-bal').innerText = `${balance.toFixed(2)} MATIC`;
    document.getElementById('nav-xp').innerText = `${xp} XP`;
    
    renderQuests();
    renderLeaderboard();
    renderHistory();
}

function deployQuest() {
    const t = document.getElementById('qTitle').value;
    const r = document.getElementById('qRew').value;
    if(!t || !r) return alert("Missing info");

    quests.unshift({ id: Date.now(), title: t, reward: parseFloat(r) });
    localStorage.setItem('work_quests', JSON.stringify(quests));
    
    document.getElementById('qTitle').value = "";
    document.getElementById('qRew').value = "";
    showTab('quests'); // Auto-switch to quests after creating
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
    if(quests.length === 0) {
        feed.innerHTML = `<p style="text-align:center; color:#555;">No work available. Check back later.</p>`;
        return;
    }
    feed.innerHTML = quests.map(q => `
        <div class="quest-item">
            <div>
                <h4 style="margin:0">${q.title}</h4>
                <span style="color:#777; font-size:0.8rem">+100 XP | ${q.reward} MATIC</span>
            </div>
            <button class="btn-inline" onclick="completeQuest(${q.id}, ${q.reward}, '${q.title}')">Claim</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const board = document.getElementById('leaderboard');
    const all = [...competitors, { name: "You", xp: xp, isMe: true }].sort((a,b) => b.xp - a.xp);
    board.innerHTML = all.map((u, i) => `
        <tr style="${u.isMe ? 'color:white; font-weight:bold;' : 'color:#555;'}">
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
            <span style="color:white">+${h.amt} MATIC</span>
        </div>
    `).join('');
}

// Initial Boot
updateUI();

// --- STATE ---
let xp = parseInt(localStorage.getItem('work_xp')) || 0;
let balance = parseFloat(localStorage.getItem('work_bal')) || 0;
let history = JSON.parse(localStorage.getItem('work_hist')) || [];
let quests = JSON.parse(localStorage.getItem('work_quests')) || [
    {id: 1, title: "CLEAN_CODE_BOUNTY_01", reward: 0.5}
];

// --- NAVIGATION ---
function showTab(tabId) {
    document.querySelectorAll('.v-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.v-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId + '-tab').classList.add('active');
    event.currentTarget.classList.add('active');
}

function toggleActivity() {
    document.getElementById('activity-drawer').classList.toggle('active');
    renderHistory();
}

// --- CORE LOGIC ---
function updateUI() {
    document.getElementById('nav-bal').innerText = balance.toFixed(2);
    document.getElementById('nav-xp').innerText = xp;
    renderQuests();
    renderLeaderboard();
    renderHistory();
}

function triggerStatusAlert() {
    const indicator = document.getElementById('status-indicator');
    indicator.classList.add('alert-blink');
    setTimeout(() => indicator.classList.remove('alert-blink'), 3000);
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
    triggerStatusAlert();
}

function completeQuest(id, r, title) {
    xp += 100;
    balance += r;
    quests = quests.filter(q => q.id !== id);
    history.unshift({ task: title, amt: r, time: new Date().toLocaleTimeString() });

    localStorage.setItem('work_xp', xp);
    localStorage.setItem('work_bal', balance);
    localStorage.setItem('work_quests', JSON.stringify(quests));
    localStorage.setItem('work_hist', JSON.stringify(history.slice(0, 10)));

    updateUI();
    triggerStatusAlert();
}

// --- RENDERING ---
function renderQuests() {
    const feed = document.getElementById('quest-feed');
    feed.innerHTML = quests.map(q => `
        <div class="quest-item">
            <h4 style="margin:0">${q.title}</h4>
            <p class="code-comment">VAL: ${q.reward} MATIC // LVL: 1</p>
            <button class="vibe-btn" onclick="completeQuest(${q.id}, ${q.reward}, '${q.title}')">EXECUTE</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const board = document.getElementById('leaderboard');
    const all = [{ name: "YOU", xp: xp, isMe: true }, { name: "ROOT_USER", xp: 2100 }, { name: "GHOST_DEB", xp: 1400 }].sort((a,b) => b.xp - a.xp);
    board.innerHTML = all.map((u, i) => `
        <tr style="border-bottom: 1px solid #111; ${u.isMe ? 'background:white; color:black;' : ''}">
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
            <div style="display:flex; justify-content:space-between">
                <span>> ${h.task}</span>
                <span style="color:${h.amt < 0 ? 'red' : 'white'}">${h.amt > 0 ? '+' : ''}${h.amt}</span>
            </div>
            <p class="code-comment" style="margin:5px 0 0 0">${h.time}</p>
        </div>
    `).join('');
}

// --- WITHDRAW ---
function openWithdraw() { 
    if(balance <= 0) return alert("NO_FUNDS");
    document.getElementById('modal-bal').innerText = balance.toFixed(2);
    document.getElementById('withdraw-modal').style.display = 'flex'; 
}
function closeWithdraw() { document.getElementById('withdraw-modal').style.display = 'none'; }
function processWithdraw() {
    history.unshift({ task: "LIQUIDATION_EVENT", amt: -balance, time: new Date().toLocaleTimeString() });
    balance = 0;
    localStorage.setItem('work_bal', balance);
    localStorage.setItem('work_hist', JSON.stringify(history.slice(0, 10)));
    closeWithdraw();
    updateUI();
    triggerStatusAlert();
}

updateUI();

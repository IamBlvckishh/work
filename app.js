// --- STATE ---
let xp = parseInt(localStorage.getItem('work_xp')) || 0;
let balance = parseFloat(localStorage.getItem('work_bal')) || 0;
let history = JSON.parse(localStorage.getItem('work_hist')) || [];
let quests = JSON.parse(localStorage.getItem('work_quests')) || [
    {id: 1, title: "CLEAN_CODE_BOUNTY_01", reward: 0.5}
];

const competitors = [
    { name: "ZERO_COOL", xp: 5200, tier: "ELITE" },
    { name: "ACID_BURN", xp: 4800, tier: "ELITE" },
    { name: "PHREAK_99", xp: 3200, tier: "SENIOR" },
    { name: "CEREAL_K", xp: 1500, tier: "PRO" }
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
    updateUI();
    triggerStatusAlert();
    alert("BOUNTY_DEPLOYED");
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
            <p class="code-comment">VAL: ${q.reward} MATIC // STATUS: OPEN</p>
            <button class="vibe-btn" onclick="completeQuest(${q.id}, ${q.reward}, '${q.title}')">EXECUTE</button>
        </div>
    `).join('');
}

function renderLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    const spotlight = document.getElementById('user-spotlight');
    const all = [...competitors, { name: "YOU", xp: xp, isMe: true, tier: xp > 2000 ? "PRO" : "ROOKIE" }]
                .sort((a, b) => b.xp - a.xp);

    const maxXP = all[0].xp;
    
    list.innerHTML = all.map((u, i) => {
        const powerPercent = (u.xp / maxXP) * 100;
        const html = `
            <div class="rank-card ${u.isMe ? 'spotlight' : ''}">
                <div class="rank-num">#${i + 1}</div>
                <div class="rank-info">
                    <span>${u.name}</span><span class="tier-tag">${u.tier}</span>
                </div>
                <div class="rank-stat" style="text-align:right">
                    <span>${u.xp} XP</span>
                    <div class="power-bar-wrap"><div class="power-bar-fill" style="width: ${powerPercent}%"></div></div>
                </div>
            </div>`;
        if (u.isMe) spotlight.innerHTML = html;
        return html;
    }).join('');
}

function renderHistory() {
    const feed = document.getElementById('history-feed');
    feed.innerHTML = history.map(h => `
        <div class="history-item">
            <div style="display:flex; justify-content:space-between"><span>> ${h.task}</span><span style="color:${h.amt < 0 ? 'red' : 'white'}">${h.amt > 0 ? '+' : ''}${h.amt}</span></div>
            <p class="code-comment" style="margin-top:5px">${h.time}</p>
        </div>`).join('');
}

// --- WITHDRAW ---
function openWithdraw() { document.getElementById('modal-bal').innerText = balance.toFixed(2); document.getElementById('withdraw-modal').style.display = 'flex'; }
function closeWithdraw() { document.getElementById('withdraw-modal').style.display = 'none'; }
function processWithdraw() {
    if(balance <= 0) return;
    history.unshift({ task: "LIQUIDATION", amt: -balance, time: new Date().toLocaleTimeString() });
    balance = 0;
    localStorage.setItem('work_bal', balance);
    localStorage.setItem('work_hist', JSON.stringify(history.slice(0, 10)));
    closeWithdraw();
    updateUI();
    triggerStatusAlert();
}

updateUI();

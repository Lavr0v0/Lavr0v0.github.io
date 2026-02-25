import { GameEngine, API_BASE } from './engine.js';

const game = new GameEngine();
let currentEvent = null;
let currentExtraChoices = [];
let pendingAfterSequence = null; // 定时事件/金手指轮结束后的回调
let isAuthed = false; // 是否已通过密码验证

const ATTR_NAMES = {
    intelligence: '智力', health: '健康', charisma: '魅力',
    willpower: '意志', luck: '运气', familyWealth: '家境'
};

const STAT_NAMES = {
    ...ATTR_NAMES,
    stress: '压力', money: '金钱', socialSupport: '社交'
};

// ===== 传记日志 =====
function appendBioLog(age, text, type = 'narrative', milestone = null, choice = null) {
    const container = document.getElementById('bio-log-content');
    if (!container) return;

    const entry = document.createElement('div');
    entry.className = 'bio-log-entry';

    const dotClass = milestone ? 'milestone' : type;
    const milestoneTag = milestone
        ? `<span class="bio-milestone-tag">🏆 ${milestone}</span>`
        : '';
    const choiceText = choice
        ? `<div class="bio-choice">→ ${choice}</div>`
        : '';

    entry.innerHTML = `
        <span class="bio-log-age">${age}岁</span>
        <span class="bio-log-dot ${dotClass}"></span>
        <div class="bio-log-text">
            <div class="bio-event">${text}${milestoneTag}</div>
            ${choiceText}
        </div>`;

    container.appendChild(entry);
    // 自动滚动到底部
    requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
    });
}

function initStartScreen() {
    const container = document.querySelector('.attributes');
    const pointsEl = document.getElementById('points-left');
    const allocated = { ...game.state.attributes };
    const calcUsed = () => Object.values(allocated).reduce((s, v) => s + v, 0);

    for (const [key, name] of Object.entries(ATTR_NAMES)) {
        const div = document.createElement('div');
        div.className = 'attribute-item';
        div.innerHTML = `
            <span>${name}</span>
            <div>
                <button class="minus" data-attr="${key}">−</button>
                <span class="value">${allocated[key]}</span>
                <button class="plus" data-attr="${key}">+</button>
            </div>`;
        container.appendChild(div);
    }

    const updatePoints = () => { pointsEl.textContent = 30 - calcUsed(); };

    container.addEventListener('click', handleAttrClick);

    // ===== AI 提供商配置 =====
    const PROVIDERS = {
        deepseek: {
            name: 'DeepSeek',
            models: ['deepseek-chat', 'deepseek-reasoner'],
            endpoint: 'https://api.deepseek.com/chat/completions'
        },
        openai: {
            name: 'ChatGPT (OpenAI)',
            models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-5', 'gpt-5-mini', 'gpt-5.1', 'gpt-5.2', 'o3', 'o4-mini'],
            endpoint: 'https://api.openai.com/v1/chat/completions'
        },
        gemini: {
            name: 'Gemini (Google)',
            models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro', 'gemini-2.0-flash'],
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions'
        },
        qwen: {
            name: '通义千问 (Qwen)',
            models: ['qwen-plus', 'qwen-turbo', 'qwen-max', 'qwq-32b', 'qwen3-235b-a22b', 'qwen3-30b-a3b'],
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
        }
    };

    const providerSelect = document.getElementById('ai-provider');
    const modelSelect = document.getElementById('ai-model');
    const aiKeyInput = document.getElementById('ai-key-input');
    const aiHint = document.getElementById('ai-config-hint');
    const devModeBtn = document.getElementById('dev-mode-btn');
    const startBtn = document.getElementById('start-game');
    let useBuiltinKey = false;

    function updateModelOptions() {
        const provider = PROVIDERS[providerSelect.value];
        const customVal = modelSelect.dataset.custom || '';
        modelSelect.innerHTML = provider.models.map(m => `<option value="${m}">${m}</option>`).join('')
            + '<option value="__custom__">自定义模型...</option>';
        // 如果之前有自定义值且属于当前提供商，恢复
        if (customVal && !provider.models.includes(customVal)) {
            const opt = document.createElement('option');
            opt.value = customVal;
            opt.textContent = customVal;
            modelSelect.insertBefore(opt, modelSelect.lastElementChild);
            modelSelect.value = customVal;
        }
    }

    modelSelect.addEventListener('change', () => {
        if (modelSelect.value === '__custom__') {
            const custom = prompt('输入自定义模型名称：');
            if (custom && custom.trim()) {
                const val = custom.trim();
                modelSelect.dataset.custom = val;
                const opt = document.createElement('option');
                opt.value = val;
                opt.textContent = val;
                modelSelect.insertBefore(opt, modelSelect.lastElementChild);
                modelSelect.value = val;
            } else {
                // 取消，回到第一个
                modelSelect.selectedIndex = 0;
            }
        }
    });

    providerSelect.addEventListener('change', () => {
        updateModelOptions();
        if (useBuiltinKey) {
            // 切换提供商时退出开发者模式
            useBuiltinKey = false;
            aiKeyInput.disabled = false;
            aiKeyInput.value = '';
            aiKeyInput.placeholder = '输入你的 API Key';
            devModeBtn.classList.remove('active');
            aiHint.textContent = '选择 AI 提供商，填入你的 API Key';
            aiHint.style.color = '';
            startBtn.disabled = true;
            startBtn.style.opacity = '0.4';
        }
    });

    // 从 localStorage 恢复
    const savedProvider = localStorage.getItem('life-sim-provider');
    const savedModel = localStorage.getItem('life-sim-model');
    const savedKey = localStorage.getItem('life-sim-ai-key');
    if (savedProvider && PROVIDERS[savedProvider]) {
        providerSelect.value = savedProvider;
        updateModelOptions();
        if (savedModel) modelSelect.value = savedModel;
    }
    if (savedKey) {
        aiKeyInput.value = savedKey;
        aiHint.textContent = '已恢复上次的 API Key';
        aiHint.style.color = 'var(--success)';
        startBtn.disabled = false;
        startBtn.style.opacity = '1';
        isAuthed = true;
    }

    aiKeyInput.addEventListener('input', () => {
        useBuiltinKey = false;
        devModeBtn.classList.remove('active');
        if (aiKeyInput.value.trim()) {
            aiHint.textContent = '将使用你的 API Key';
            aiHint.style.color = 'var(--success)';
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            isAuthed = true;
        } else {
            aiHint.textContent = '选择 AI 提供商，填入你的 API Key';
            aiHint.style.color = '';
            startBtn.disabled = true;
            startBtn.style.opacity = '0.4';
            isAuthed = false;
        }
    });

    // 开发者模式
    devModeBtn.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'dev-overlay';
        overlay.innerHTML = `
            <div class="dev-dialog">
                <h3>开发者验证</h3>
                <input type="password" id="dev-code-input" placeholder="输入验证码" maxlength="6" autocomplete="off">
                <div class="dev-actions">
                    <button id="dev-cancel" class="dev-cancel-btn">取消</button>
                    <button id="dev-confirm">确认</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        const codeInput = document.getElementById('dev-code-input');
        codeInput.focus();
        document.getElementById('dev-cancel').addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        document.getElementById('dev-confirm').addEventListener('click', async () => {
            const code = codeInput.value;
            try {
                const res = await fetch(`${API_BASE}/api/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: code })
                });
                if (res.ok) {
                    useBuiltinKey = true;
                    isAuthed = true;
                    aiKeyInput.value = '';
                    aiKeyInput.placeholder = '开发者模式已激活';
                    aiKeyInput.disabled = true;
                    providerSelect.value = 'deepseek';
                    updateModelOptions();
                    aiHint.textContent = '✅ 使用内置 API Key';
                    aiHint.style.color = 'var(--success)';
                    devModeBtn.classList.add('active');
                    startBtn.disabled = false;
                    startBtn.style.opacity = '1';
                    overlay.remove();
                } else {
                    codeInput.style.borderColor = 'var(--danger)';
                    codeInput.value = '';
                    codeInput.placeholder = '验证码错误';
                }
            } catch {
                codeInput.style.borderColor = 'var(--danger)';
                codeInput.value = '';
                codeInput.placeholder = '服务器连接失败';
            }
        });
        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') document.getElementById('dev-confirm').click();
        });
    });

    // 难度选择
    let selectedDifficulty = 2;
    const diffHints = { 1: '命运眷顾，不容易死', 2: '正常的人生体验', 3: '命运多舛，步步惊心', 4: '地狱难度，九死一生' };
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDifficulty = parseInt(btn.dataset.diff);
            document.getElementById('difficulty-hint').textContent = diffHints[selectedDifficulty];
        });
    });

    // 内容尺度选择 — NSFW 隐藏，三击全年龄按钮解锁
    let selectedContentMode = 'sfw';
    let nsfwUnlocked = false;
    let sfwClickCount = 0;
    let sfwClickTimer = null;
    const contentHints = {
        sfw: '适合所有人的内容，情感描写含蓄隐晦',
        nsfw: '包含露骨的成人内容，未成年人请勿选择'
    };

    const sfwBtn = document.getElementById('sfw-btn');
    sfwBtn.addEventListener('click', () => {
        if (!nsfwUnlocked) {
            sfwClickCount++;
            clearTimeout(sfwClickTimer);
            sfwClickTimer = setTimeout(() => { sfwClickCount = 0; }, 800);
            if (sfwClickCount >= 3) {
                nsfwUnlocked = true;
                sfwClickCount = 0;
                // 展开 NSFW 选项
                const optionsDiv = document.querySelector('.content-mode-options');
                optionsDiv.classList.add('expanded');
                const nsfwBtn = document.createElement('button');
                nsfwBtn.className = 'content-btn';
                nsfwBtn.dataset.mode = 'nsfw';
                nsfwBtn.textContent = 'NSFW';
                optionsDiv.appendChild(nsfwBtn);
                nsfwBtn.addEventListener('click', () => {
                    document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
                    nsfwBtn.classList.add('active');
                    selectedContentMode = 'nsfw';
                    document.getElementById('content-mode-hint').textContent = contentHints.nsfw;
                });
                // 让全年龄按钮也能切回
                sfwBtn.addEventListener('click', () => {
                    document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
                    sfwBtn.classList.add('active');
                    selectedContentMode = 'sfw';
                    document.getElementById('content-mode-hint').textContent = contentHints.sfw;
                });
                document.getElementById('content-mode-hint').textContent = '已解锁 NSFW 模式';
            }
        } else {
            document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
            sfwBtn.classList.add('active');
            selectedContentMode = 'sfw';
            document.getElementById('content-mode-hint').textContent = contentHints.sfw;
        }
    });

    // 起始阶段选择
    let selectedStartAge = 0;
    const phaseHints = {
        0: '从出生开始完整体验',
        6: '跳过婴幼儿期，从小学开始',
        12: '跳过童年，从初中开始',
        15: '跳过初中，从高中开始',
        18: '跳过高中，从大学开始',
        22: '跳过学生时代，从工作开始'
    };
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.phase-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedStartAge = parseInt(btn.dataset.age);
            document.getElementById('phase-hint').textContent = phaseHints[selectedStartAge] || '';
        });
    });

    // 定时事件系统
    const scheduledEvents = [];
    const schedList = document.getElementById('scheduled-list');
    const schedAgeInput = document.getElementById('sched-age');
    const schedTextInput = document.getElementById('sched-text');

    function renderScheduledList() {
        if (!schedList) return;
        if (!scheduledEvents.length) {
            schedList.innerHTML = '';
            return;
        }
        schedList.innerHTML = scheduledEvents
            .sort((a, b) => a.age - b.age)
            .map((e, i) => `<div class="scheduled-item">
                <span class="sched-item-age">${e.age}岁</span>
                <span class="sched-item-text">${e.text}</span>
                <button class="sched-remove" data-idx="${i}">✕</button>
            </div>`).join('');
    }

    document.getElementById('sched-add-btn')?.addEventListener('click', () => {
        const age = parseInt(schedAgeInput?.value);
        const text = schedTextInput?.value.trim();
        if (isNaN(age) || age < 0 || age > 75) { alert('年龄需要在0-75之间'); return; }
        if (!text) { alert('请输入事件描述'); return; }
        scheduledEvents.push({ age, text });
        schedAgeInput.value = '';
        schedTextInput.value = '';
        renderScheduledList();
    });

    schedList?.addEventListener('click', (e) => {
        if (e.target.classList.contains('sched-remove')) {
            const idx = parseInt(e.target.dataset.idx);
            scheduledEvents.splice(idx, 1);
            renderScheduledList();
        }
    });

    document.getElementById('start-game').addEventListener('click', async () => {
        const name = document.getElementById('player-name').value.trim();
        const gender = document.getElementById('player-gender').value;
        const personality = document.getElementById('player-personality').value.trim();

        if (!name) { alert('请输入你的名字'); return; }
        if (!isAuthed) { alert('请先配置 AI 设置'); return; }
        if (!unlimitedMode && calcUsed() > 30) { alert('属性点超出30点！'); return; }

        // 发送 AI 配置到后端
        try {
            const provider = providerSelect.value;
            const model = modelSelect.value;
            const userKey = aiKeyInput.value.trim();
            const payload = useBuiltinKey
                ? { provider, model, apiKey: '__BUILTIN__' }
                : { provider, model, apiKey: userKey };
            const keyRes = await fetch(`${API_BASE}/api/set-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!keyRes.ok) throw new Error('设置失败');
            // 保存到 localStorage
            if (!useBuiltinKey && userKey) {
                localStorage.setItem('life-sim-ai-key', userKey);
                localStorage.setItem('life-sim-provider', provider);
                localStorage.setItem('life-sim-model', model);
            }
        } catch (err) {
            alert('AI 配置失败，请检查服务器是否运行');
            return;
        }

        const weirdness = 3; // 固定值，已移除奇异度滑块
        game.initializeGame(name, gender, personality || '普通', allocated, weirdness, selectedDifficulty, selectedContentMode);
        game.scheduledEvents = [...scheduledEvents];
        await game.loadFallbackEvents();

        // 如果选择了跳过阶段
        if (selectedStartAge > 0) {
            showScreen('game-screen');
            // 显示加载遮罩
            const overlay = document.createElement('div');
            overlay.className = 'skip-loading-overlay';
            overlay.innerHTML = `<div class="loading-spinner"></div><p>正在快速生成前 ${selectedStartAge} 年的人生...</p>`;
            document.body.appendChild(overlay);

            try {
                const skipData = await game.skipToAge(selectedStartAge);
                // 将摘要写入传记日志
                if (skipData && skipData.summary) {
                    for (const s of skipData.summary) {
                        const ageMatch = s.match(/^(\d+)岁[:：]/);
                        const age = ageMatch ? parseInt(ageMatch[1]) : 0;
                        const text = ageMatch ? s.replace(/^\d+岁[:：]\s*/, '') : s;
                        appendBioLog(age, text, 'narrative');
                    }
                } else {
                    appendBioLog(0, `${name}的前${selectedStartAge}年一笔带过。`, 'narrative');
                }
                appendBioLog(selectedStartAge, `从${selectedStartAge}岁开始，人生正式展开。`, 'narrative');
            } catch (e) {
                appendBioLog(0, `快速生成失败，直接从${selectedStartAge}岁开始。`, 'narrative');
            }

            overlay.remove();
            updateStatusBar();
            updateFocusPhaseUI();
            nextYear();
        } else {
            showScreen('game-screen');
            appendBioLog(0, `${name}出生了。${gender === '女' ? '她' : '他'}的人生故事从这里开始。`, 'narrative');
            updateFocusPhaseUI();
            nextYear();
        }
    });

    // 读档按钮
    const loadBtn = document.getElementById('load-game');
    if (loadBtn) {
        if (game.hasSave()) {
            loadBtn.style.display = 'block';
            loadBtn.addEventListener('click', async () => {
                if (game.loadGame()) {
                    await game.loadFallbackEvents();
                    showScreen('game-screen');
                    appendBioLog(game.state.age, '（读取存档，继续人生）', 'narrative');
                    updateStatusBar();
                    updateFocusPhaseUI();
                    nextYear();
                }
            });
        } else {
            loadBtn.style.display = 'none';
        }
    }

    // 🥚 彩蛋：点三下标题获得无限加点
    let titleClicks = 0;
    let titleClickTimer = null;
    let unlimitedMode = false;
    document.querySelector('#start-screen h1')?.addEventListener('click', () => {
        titleClicks++;
        clearTimeout(titleClickTimer);
        titleClickTimer = setTimeout(() => { titleClicks = 0; }, 800);
        if (titleClicks >= 3 && !unlimitedMode) {
            unlimitedMode = true;
            titleClicks = 0;
            pointsEl.textContent = '∞';
            pointsEl.style.color = '#f59e0b';
            // 移除30点上限
            container.removeEventListener('click', handleAttrClick);
            container.addEventListener('click', (e) => {
                if (!e.target.matches('button')) return;
                const attr = e.target.dataset.attr;
                const valSpan = e.target.parentElement.querySelector('.value');
                if (e.target.classList.contains('plus')) allocated[attr]++;
                else if (e.target.classList.contains('minus') && allocated[attr] > 0) allocated[attr]--;
                valSpan.textContent = allocated[attr];
                pointsEl.textContent = '∞';
            });
            // 小提示动画
            const hint = document.createElement('div');
            hint.textContent = '🌟 无限模式已激活';
            hint.style.cssText = 'text-align:center;color:#f59e0b;font-size:12px;font-weight:600;animation:fadeSlideUp 0.5s ease;';
            document.querySelector('#attribute-allocation').appendChild(hint);
            setTimeout(() => hint.remove(), 3000);
        }
    });

    // 属性点击处理（需要命名以便彩蛋移除）
    function handleAttrClick(e) {
        if (!e.target.matches('button')) return;
        const attr = e.target.dataset.attr;
        const valSpan = e.target.parentElement.querySelector('.value');
        if (e.target.classList.contains('plus') && calcUsed() < 30) allocated[attr]++;
        else if (e.target.classList.contains('minus') && allocated[attr] > 0) allocated[attr]--;
        valSpan.textContent = allocated[attr];
        updatePoints();
    }

    // 传记日志折叠
    document.getElementById('bio-log-toggle')?.addEventListener('click', (e) => {
        const content = document.getElementById('bio-log-content');
        const collapsed = content.classList.toggle('collapsed');
        e.target.textContent = collapsed ? '展开' : '收起';
    });

    // 小档案折叠
    document.getElementById('profile-toggle')?.addEventListener('click', () => {
        const content = document.getElementById('profile-content');
        const arrow = document.querySelector('.profile-toggle-arrow');
        const collapsed = content.classList.toggle('collapsed');
        if (arrow) arrow.style.transform = collapsed ? 'rotate(-90deg)' : '';
    });
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function updateStatusBar() {
    const oldStress = parseInt(document.getElementById('stress')?.textContent) || 0;
    const oldMoney = parseInt(document.getElementById('money')?.textContent) || 0;
    const oldSocial = parseInt(document.getElementById('social')?.textContent) || 0;

    document.getElementById('current-age').textContent = game.state.age;

    const newStress = Math.round(game.state.derivedStats.stress);
    const newMoney = Math.round(game.state.derivedStats.money);
    const newSocial = Math.round(game.state.derivedStats.socialSupport);

    animateStatChange('stress', oldStress, newStress);
    animateStatChange('money', oldMoney, newMoney);
    animateStatChange('social', oldSocial, newSocial);

    // 回溯按钮状态
    const rewindBtn = document.getElementById('rewind-btn');
    if (rewindBtn) {
        rewindBtn.textContent = `⏪ 回溯 (${game.state.rewindsLeft})`;
        rewindBtn.disabled = !game.canRewind();
        rewindBtn.style.display = game.state.rewindsLeft > 0 ? '' : 'none';
    }

    const box = document.getElementById('attributes-display');
    box.innerHTML = '';
    for (const [key, name] of Object.entries(ATTR_NAMES)) {
        const div = document.createElement('div');
        div.className = 'attr-display';
        div.innerHTML = `<strong>${name}</strong>${game.state.attributes[key]}`;
        box.appendChild(div);
    }

    // 特质显示
    const traitsEl = document.getElementById('traits-display');
    if (traitsEl) {
        traitsEl.innerHTML = game.state.traits.length
            ? game.state.traits.map(t => `<span class="trait-tag">${t}</span>`).join('')
            : '';
    }

    updateProfile();
}

function updateProfile() {
    const p = game.state.profile;
    const chars = game.state.characters;
    const eduEl = document.getElementById('profile-education');
    const jobEl = document.getElementById('profile-job');
    const relEl = document.getElementById('profile-relationships');
    const charEl = document.getElementById('profile-characters');
    if (eduEl) eduEl.textContent = p.education || '未入学';
    if (jobEl) jobEl.textContent = p.job || '无';

    // 角色卡
    if (charEl) {
        const charList = Object.values(chars);
        if (!charList.length) {
            charEl.innerHTML = '<div class="profile-empty">还没有重要角色</div>';
        } else {
            charEl.innerHTML = charList
                .sort((a, b) => (b.importance || 3) - (a.importance || 3))
                .map(c => {
                    const impStars = '★'.repeat(Math.min(c.importance || 3, 5));
                    return `<div class="char-card" onclick="this.classList.toggle('expanded')">
                        <div class="char-card-header">
                            <span class="char-card-name">${c.name}</span>
                            <span class="char-card-relation">${c.relation || '认识'}</span>
                            <span class="char-card-imp">${impStars}</span>
                        </div>
                        <div class="char-card-body">
                            <div class="char-card-row"><span>性别</span><span>${c.gender || '未知'}</span></div>
                            <div class="char-card-row"><span>年龄</span><span>${c.age || '未知'}</span></div>
                            <div class="char-card-row"><span>性格</span><span>${c.personality || '未知'}</span></div>
                            <div class="char-card-row"><span>职业</span><span>${c.job || '未知'}</span></div>
                            <div class="char-card-row"><span>外貌</span><span>${c.appearance || '未知'}</span></div>
                            <div class="char-card-row"><span>初识</span><span>${c.firstMet || '未知'}</span></div>
                        </div>
                    </div>`;
                }).join('');
        }
    }

    if (!relEl) return;

    // 只显示重要关系（importance >= 3）且最近出现过的（5年内）
    const currentAge = game.state.age;
    const importantRels = p.relationships.filter(r => {
        if ((r.importance || 3) < 3) return false;
        // 核心关系（家人/配偶 importance 5）始终显示
        if ((r.importance || 3) >= 5) return true;
        // 其他关系：5年内出现过才显示
        const lastSeen = r.lastSeen ?? 0;
        return (currentAge - lastSeen) <= 5;
    });

    if (!importantRels.length) {
        relEl.innerHTML = '<div class="profile-empty">还没有重要的人</div>';
        return;
    }

    relEl.innerHTML = importantRels
        .sort((a, b) => (b.affinity || 0) - (a.affinity || 0))
        .map(r => {
            const tagClass = getRelTagClass(r.relation);
            const barColor = r.affinity >= 70 ? '#ec4899' : r.affinity >= 40 ? '#6366f1' : '#9ca3af';
            return `<div class="profile-rel-item">
                <div class="profile-rel-top">
                    <span class="profile-rel-name">${r.name}</span>
                    <span class="profile-rel-tag ${tagClass}">${r.relation}</span>
                </div>
                <div class="profile-rel-bottom">
                    <div class="profile-rel-bar">
                        <div class="profile-rel-bar-fill" style="width:${r.affinity}%;background:${barColor}"></div>
                    </div>
                    <span class="profile-rel-status">${r.status}</span>
                </div>
            </div>`;
        }).join('');
}

function getRelTagClass(relation) {
    if (['恋人', '热恋', '男友', '女友'].some(k => relation.includes(k))) return 'lover';
    if (['配偶', '老公', '老婆', '丈夫', '妻子'].some(k => relation.includes(k))) return 'spouse';
    if (['前任', '前男友', '前女友'].some(k => relation.includes(k))) return 'ex';
    if (['暗恋', '心动', '单相思'].some(k => relation.includes(k))) return 'crush';
    if (['仇人', '敌人', '对手'].some(k => relation.includes(k))) return 'enemy';
    if (['朋友', '死党', '闺蜜', '兄弟', '好友'].some(k => relation.includes(k))) return 'friend';
    return 'default';
}

// ===== 成就弹窗 =====
function showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `<span class="achievement-icon">🏅</span><div><div class="achievement-name">${achievement.name}</div><div class="achievement-desc">${achievement.desc}</div></div>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== 数值变化动画 =====
function animateStatChange(elementId, oldVal, newVal) {
    const el = document.getElementById(elementId);
    if (!el || oldVal === newVal) return;
    el.textContent = newVal;
    const cls = newVal > oldVal ? 'stat-flash-up' : 'stat-flash-down';
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 600);
}

// ===== 聚焦阶段 =====
const PHASE_RANGES = {
    '婴幼儿': [0, 5], '小学': [6, 12], '初中': [12, 15],
    '高中': [15, 18], '大学': [18, 22], '青年': [22, 35],
    '中年': [35, 50], '中老年': [50, 65], '老年': [65, 80]
};

function getCurrentPhaseName(age) {
    if (age <= 5) return '婴幼儿';
    if (age <= 12) return '小学';
    if (age <= 15) return '初中';
    if (age <= 18) return '高中';
    if (age <= 22) return '大学';
    if (age <= 35) return '青年';
    if (age <= 50) return '中年';
    if (age <= 65) return '中老年';
    return '老年';
}

function updateFocusPhaseUI() {
    const bar = document.getElementById('focus-phase-bar');
    const btn = document.getElementById('focus-phase-btn');
    const cancelBtn = document.getElementById('focus-phase-cancel');
    const label = document.getElementById('focus-phase-label');
    if (!bar) return;

    bar.style.display = 'flex';
    const phaseName = getCurrentPhaseName(game.state.age);

    if (game.focusPhase) {
        // 聚焦中
        const fp = game.focusPhase;
        const focusPhaseName = Object.entries(PHASE_RANGES).find(([, [s, e]]) => fp.start === s && fp.end === e)?.[0] || '当前阶段';
        label.textContent = `🔍 聚焦中：${focusPhaseName}（${fp.start}-${fp.end}岁）`;
        bar.classList.add('active-focus');
        btn.style.display = 'none';
        cancelBtn.style.display = '';

        // 如果已经超出聚焦范围，自动取消
        if (game.state.age > game.focusPhase.end) {
            game.focusPhase = null;
            updateFocusPhaseUI();
        }
    } else {
        // 未聚焦
        label.textContent = `🔍 当前阶段：${phaseName}`;
        bar.classList.remove('active-focus');
        btn.style.display = '';
        btn.textContent = `聚焦「${phaseName}」`;
        cancelBtn.style.display = 'none';
    }
}

// 绑定聚焦按钮事件
document.getElementById('focus-phase-btn')?.addEventListener('click', () => {
    const phaseName = getCurrentPhaseName(game.state.age);
    const range = PHASE_RANGES[phaseName];
    if (range) {
        game.focusPhase = { start: range[0], end: range[1] };
        updateFocusPhaseUI();
    }
});

document.getElementById('focus-phase-cancel')?.addEventListener('click', () => {
    game.focusPhase = null;
    updateFocusPhaseUI();
});

function showLoading(msg = 'AI 正在构思...') {
    document.getElementById('event-title').textContent = '';
    document.getElementById('event-description').textContent = '';
    document.getElementById('event-description').className = '';
    document.getElementById('options').innerHTML =
        `<div class="loading-spinner"></div><p class="loading-text">${msg}</p>`;
}

// 聚焦模式：同一年内的轮次计数
let focusRoundCounter = 0;
const FOCUS_ROUNDS_PER_YEAR = 4; // 聚焦模式下每年最多生成几轮事件

async function nextYear() {
    // 聚焦模式下：检查是否还有更多轮次
    const inFocus = game.focusPhase && game.state.age >= game.focusPhase.start && game.state.age <= game.focusPhase.end;

    if (focusRoundCounter > 0 && inFocus && focusRoundCounter < FOCUS_ROUNDS_PER_YEAR) {
        // 同一年的下一轮，不推进年龄
        game.saveGame();
        updateStatusBar();
        showLoading(`🔍 聚焦模式 — ${game.state.age}岁 第${focusRoundCounter + 1}轮...`);

        let events = null;
        try {
            events = await game.generateEvent(focusRoundCounter);
        } catch (err) {
            console.error('🔍 聚焦模式生成异常:', err);
        }
        if (!events || !events.length) {
            focusRoundCounter = 0;
        } else {
            const deathEvent = events.find(e => e.death || !game.state.alive);
            if (deathEvent) {
                game.recordNarrative(deathEvent, {});
                appendBioLog(game.state.age, deathEvent.prompt, 'fail');
                await showEnding();
                return;
            }

            const narratives = events.filter(e => e.type === 'narrative');
            const choices = events.filter(e => e.type === 'choice');
            currentEvent = choices[0] || null;

            focusRoundCounter++;
            await showEventSequence(narratives, currentEvent, choices.slice(1));
            return;
        }
    }

    // 正常推进：新的一年
    focusRoundCounter = 0;
    game.advanceYear();
    game.saveGame();
    updateFocusPhaseUI();

    // 检查特质获取
    const newTraits = game.checkTraitAcquisition();
    if (newTraits.length) {
        newTraits.forEach(t => appendBioLog(game.state.age, `获得特质：「${t}」`, 'milestone'));
    }

    // 检查成就
    const newAchievements = game.checkAchievements();
    if (newAchievements.length) {
        newAchievements.forEach(a => showAchievementToast(a));
    }

    if (game.state.age > 75 || !game.state.alive || game.state.attributes.health <= 0) {
        await showEnding();
        return;
    }

    updateStatusBar();

    // ===== 定时事件检查：在正常AI生成之前，先显示定时事件 =====
    const scheduledForThisAge = (game.scheduledEvents || []).filter(e => Number(e.age) === game.state.age);
    if (scheduledForThisAge.length > 0) {
        await showScheduledEvents(scheduledForThisAge);
        return; // showScheduledEvents 结束后会自己调用正常的AI生成轮
    }

    await runNormalGeneration();
}

// 显示定时事件，然后为每个定时事件触发一轮AI生成
async function showScheduledEvents(scheduledList) {
    const sched = scheduledList[0];
    const remaining = scheduledList.slice(1);

    // 先在界面上显示定时事件卡片
    document.getElementById('event-title').innerHTML = `${game.state.age}岁 <span class="milestone-badge">📅 定时事件</span>`;
    const desc = document.getElementById('event-description');
    desc.textContent = sched.text;
    desc.className = 'narrative-only';

    appendBioLog(game.state.age, `📅 定时事件：${sched.text}`, 'milestone');

    const box = document.getElementById('options');
    box.innerHTML = `
        <div class="narrative-result neutral">
            <p>📅 玩家预设的剧情即将展开……</p>
        </div>
        <button id="sched-generate-btn" class="continue-btn">🎬 展开这个事件 →</button>`;

    document.getElementById('sched-generate-btn').addEventListener('click', async () => {
        // 把定时事件作为金手指指令注入，触发一轮AI生成
        game.playerDirective = sched.text;
        showLoading(`📅 正在围绕「${sched.text}」生成事件...`);

        let events = null;
        try {
            events = await game.generateEvent(0);
        } catch (err) {
            console.error('📅 定时事件AI生成异常:', err);
        }

        // 生成失败或为空 → 显示失败信息 + 继续按钮
        if (!events || !events.length) {
            const box2 = document.getElementById('options');
            box2.innerHTML = `<div class="narrative-result neutral">
                    <p>📅 「${sched.text}」—— 这件事悄然发生了，但细节已随风而去。</p>
                    <p class="loading-text" style="color:#f59e0b">⚠️ AI生成失败，已跳过此定时事件</p>
                </div>
                <button id="sched-next-btn" class="continue-btn">继续 →</button>`;
            document.getElementById('sched-next-btn').addEventListener('click', async () => {
                if (remaining.length > 0) {
                    await showScheduledEvents(remaining);
                } else {
                    await runNormalGeneration();
                }
            });
            return;
        }

        const deathEvent = events.find(e => e.death || !game.state.alive);
        if (deathEvent) {
            game.recordNarrative(deathEvent, {});
            appendBioLog(game.state.age, deathEvent.prompt, 'fail');
            await showEnding();
            return;
        }

        const narratives = events.filter(e => e.type === 'narrative');
        const choices = events.filter(e => e.type === 'choice');
        if (narratives.length === 0 && choices.length === 0 && events.length > 0) {
            for (const e of events) {
                e.type = (e.options && e.options.length >= 2) ? 'choice' : 'narrative';
            }
        }
        const fixedNarr = events.filter(e => e.type === 'narrative');
        const fixedChoice = events.filter(e => e.type === 'choice');
        currentEvent = fixedChoice[0] || null;

        // 定时事件轮结束后，继续处理剩余定时事件或正常生成
        pendingAfterSequence = async () => {
            if (remaining.length > 0) {
                await showScheduledEvents(remaining);
            } else {
                await runNormalGeneration();
            }
        };

        await showEventSequence(fixedNarr, currentEvent, fixedChoice.slice(1));
    });
}

// 金手指立即触发额外一轮
async function triggerGoldFinger(directive) {
    game.playerDirective = directive;
    showLoading(`🎮 金手指生效中：「${directive}」...`);

    let events = null;
    try {
        events = await game.generateEvent(0);
    } catch (err) {
        console.error('🎮 金手指AI生成异常:', err);
    }

    if (!events || !events.length) {
        const box = document.getElementById('options');
        box.innerHTML = `<div class="narrative-result neutral">
                <p>🎮 金手指「${directive}」似乎没有生效……</p>
                <p class="loading-text" style="color:#f59e0b">⚠️ AI生成失败</p>
            </div>
            <button id="gf-next-btn" class="continue-btn">继续 →</button>`;
        document.getElementById('gf-next-btn').addEventListener('click', () => nextYear());
        return;
    }

    const deathEvent = events.find(e => e.death || !game.state.alive);
    if (deathEvent) {
        game.recordNarrative(deathEvent, {});
        appendBioLog(game.state.age, deathEvent.prompt, 'fail');
        await showEnding();
        return;
    }

    const narratives = events.filter(e => e.type === 'narrative');
    const choices = events.filter(e => e.type === 'choice');
    if (narratives.length === 0 && choices.length === 0 && events.length > 0) {
        for (const e of events) {
            e.type = (e.options && e.options.length >= 2) ? 'choice' : 'narrative';
        }
    }
    const fixedNarr = events.filter(e => e.type === 'narrative');
    const fixedChoice = events.filter(e => e.type === 'choice');
    currentEvent = fixedChoice[0] || null;

    // 金手指轮结束后回到正常流程
    pendingAfterSequence = null;
    await showEventSequence(fixedNarr, currentEvent, fixedChoice.slice(1));
}

// 正常的AI生成轮（从nextYear中抽出）
async function runNormalGeneration() {
    const nowInFocus = game.focusPhase && game.state.age >= game.focusPhase.start && game.state.age <= game.focusPhase.end;
    showLoading(nowInFocus ? `🔍 聚焦模式 — ${game.state.age}岁 第1轮...` : 'AI 正在构思...');

    let events = null;
    for (let retry = 0; retry < 2; retry++) {
        try {
            events = await game.generateEvent(0);
        } catch (err) {
            console.error(`⚠️ 第${retry + 1}次生成事件异常:`, err);
        }
        if (events && events.length) break;
        console.warn(`⚠️ 第${retry + 1}次生成事件为空，重试...`);
    }
    if (!events || !events.length) {
        appendBioLog(game.state.age, '这一年平平淡淡地过去了。', 'narrative');
        game.recordNarrative({ prompt: '这一年平平淡淡地过去了。', type: 'narrative' }, {});
        document.getElementById('event-title').textContent = `${game.state.age}岁`;
        document.getElementById('event-description').textContent = '这一年平平淡淡地过去了。';
        document.getElementById('event-description').className = 'narrative-only';
        const box = document.getElementById('options');
        box.innerHTML = `<button id="continue-btn" class="continue-btn">下一年 →</button>`;
        document.getElementById('continue-btn').addEventListener('click', () => nextYear());
        return;
    }

    const deathEvent = events.find(e => e.death || !game.state.alive);
    if (deathEvent) {
        game.recordNarrative(deathEvent, {});
        appendBioLog(game.state.age, deathEvent.prompt, 'fail');
        await showEnding();
        return;
    }

    const narratives = events.filter(e => e.type === 'narrative');
    const choices = events.filter(e => e.type === 'choice');

    if (narratives.length === 0 && choices.length === 0 && events.length > 0) {
        for (const e of events) {
            e.type = (e.options && e.options.length >= 2) ? 'choice' : 'narrative';
        }
        const fixedNarratives = events.filter(e => e.type === 'narrative');
        const fixedChoices = events.filter(e => e.type === 'choice');
        currentEvent = fixedChoices[0] || null;
        const nowInFocus2 = game.focusPhase && game.state.age >= game.focusPhase.start && game.state.age <= game.focusPhase.end;
        if (nowInFocus2) focusRoundCounter = 1;
        pendingAfterSequence = null;
        await showEventSequence(fixedNarratives, currentEvent, fixedChoices.slice(1));
        return;
    }

    currentEvent = choices[0] || null;

    if (nowInFocus) {
        focusRoundCounter = 1;
    }

    pendingAfterSequence = null;
    await showEventSequence(narratives, currentEvent, choices.slice(1));
}

async function showEventSequence(narratives, choiceEvent, extraChoices = []) {
    if (narratives.length === 0 && choiceEvent) {
        displayChoiceEvent(choiceEvent, extraChoices);
        return;
    }

    if (narratives.length === 0 && !choiceEvent) {
        if (extraChoices.length > 0) {
            const next = extraChoices[0];
            displayChoiceEvent(next, extraChoices.slice(1));
            return;
        }
        // 如果有待执行的回调（定时事件链/金手指后续），执行它
        if (pendingAfterSequence) {
            const cb = pendingAfterSequence;
            pendingAfterSequence = null;
            await cb();
            return;
        }
        // 所有事件都显示完了，显示按钮让玩家手动进入下一年
        const box = document.getElementById('options');
        const btnText = focusRoundCounter > 0 ? '继续这一年 →' : '下一年 →';
        box.innerHTML = `<button id="continue-btn" class="continue-btn">${btnText}</button>`;
        document.getElementById('continue-btn').addEventListener('click', () => nextYear());
        return;
    }

    const narr = narratives[0];
    const remaining = narratives.slice(1);

    const ageLabel = `${game.state.age}岁`;

    const msTag = narr.milestone
        ? ` <span class="milestone-badge">🏆 ${narr.milestone}</span>`
        : '';

    document.getElementById('event-title').innerHTML = ageLabel + msTag;
    const desc = document.getElementById('event-description');
    desc.textContent = narr.prompt;
    desc.className = 'narrative-only';

    const changes = narr.effects ? game.applyEffects(narr.effects) : {};
    game.recordNarrative(narr, changes);

    // 写入传记日志
    appendBioLog(game.state.age, narr.prompt, 'narrative', narr.milestone || null);

    // 极端状态检测
    const crisis = game.checkExtremeStates();
    if (crisis) {
        appendBioLog(game.state.age, crisis.prompt, 'fail');
        game.recordNarrative(crisis, {});
        updateStatusBar();
        const box = document.getElementById('options');
        box.innerHTML = `
            <div class="narrative-result fail">
                <p>💀 ${crisis.prompt}</p>
            </div>
            <button id="continue-btn" class="continue-btn">查看结局</button>`;
        document.getElementById('continue-btn').addEventListener('click', () => showEnding());
        return;
    }

    const allChoices = choiceEvent ? [choiceEvent, ...extraChoices] : extraChoices;
    const hasMore = remaining.length > 0 || allChoices.length > 0;
    const btnText = hasMore ? '继续 →' : (focusRoundCounter > 0 ? '继续这一年 →' : '下一年 →');
    const hint = remaining.length > 0
        ? `<p class="more-events-hint">📌 这一年还有 ${remaining.length + allChoices.length} 件事...</p>`
        : (allChoices.length > 0 ? `<p class="more-events-hint">📌 接下来有${allChoices.length > 1 ? allChoices.length + '个' : '一个'}重要选择...</p>` : '');

    const box = document.getElementById('options');
    box.innerHTML = `
        <div class="narrative-result neutral">
            <p>📖 ${narr.prompt.length > 20 ? '生活继续着。' : '这一年就这样过去了。'}</p>
            ${renderChanges(changes)}
        </div>
        ${hint}
        <div class="event-tools">
            <button id="expand-btn" class="tool-btn expand-btn">🔍 展开详情</button>
            <button id="goldfinger-btn" class="tool-btn goldfinger-btn">🎮 金手指</button>
        </div>
        <button id="continue-btn" class="continue-btn">${btnText}</button>`;

    // 展开详情
    document.getElementById('expand-btn').addEventListener('click', async () => {
        const btn = document.getElementById('expand-btn');
        if (!narr?.prompt) { btn.textContent = '❌ 无内容可展开'; return; }
        btn.disabled = true;
        btn.textContent = '🔍 展开中...';
        try {
            const expanded = await game.expandEvent(narr);
            if (expanded) {
                const expandDiv = document.createElement('div');
                expandDiv.className = 'expanded-content';
                expandDiv.innerHTML = `<p>${expanded}</p>`;
                btn.parentElement.after(expandDiv);
                btn.textContent = '✅ 已展开';
            } else {
                btn.textContent = '❌ 展开失败';
                setTimeout(() => { btn.textContent = '🔍 展开详情'; btn.disabled = false; }, 2000);
            }
        } catch (err) {
            console.error('展开按钮错误:', err);
            btn.textContent = '❌ 展开失败';
            setTimeout(() => { btn.textContent = '🔍 展开详情'; btn.disabled = false; }, 2000);
        }
    });

    // 金手指
    document.getElementById('goldfinger-btn').addEventListener('click', () => {
        showGoldFingerInput();
    });

    document.getElementById('continue-btn').addEventListener('click', () => {
        updateStatusBar();
        if (remaining.length > 0 || allChoices.length > 0) {
            showEventSequence(remaining, allChoices[0] || null, allChoices.slice(1));
        } else if (pendingAfterSequence) {
            const cb = pendingAfterSequence;
            pendingAfterSequence = null;
            cb();
        } else {
            nextYear();
        }
    });

    updateStatusBar();
}

function milestoneTag(event) {
    if (!event?.milestone) return '';
    return ` <span class="milestone-badge">🏆 ${event.milestone}</span>`;
}

function displayChoiceEvent(event, extraChoices = []) {
    currentEvent = event;
    currentExtraChoices = extraChoices;
    const ageLabel = `${game.state.age}岁`;
    document.getElementById('event-title').innerHTML = ageLabel + milestoneTag(event);
    const desc = document.getElementById('event-description');
    desc.textContent = event.prompt;
    desc.className = '';

    const box = document.getElementById('options');
    box.innerHTML = '';

    // 展开和金手指工具栏
    const toolsDiv = document.createElement('div');
    toolsDiv.className = 'event-tools';
    toolsDiv.innerHTML = `<button id="expand-choice-btn" class="tool-btn expand-btn">🔍 展开详情</button><button id="goldfinger-choice-btn" class="tool-btn goldfinger-btn">🎮 金手指</button>`;
    box.appendChild(toolsDiv);

    document.getElementById('expand-choice-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('expand-choice-btn');
        btn.disabled = true;
        btn.textContent = '🔍 展开中...';
        const expanded = await game.expandEvent(event);
        if (expanded) {
            const expandDiv = document.createElement('div');
            expandDiv.className = 'expanded-content';
            expandDiv.innerHTML = `<p>${expanded}</p>`;
            toolsDiv.after(expandDiv);
            btn.textContent = '✅ 已展开';
        } else {
            btn.textContent = '❌ 展开失败';
            setTimeout(() => { btn.textContent = '🔍 展开详情'; btn.disabled = false; }, 2000);
        }
    });

    document.getElementById('goldfinger-choice-btn')?.addEventListener('click', () => {
        showGoldFingerInput();
    });

    event.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => handleChoice(i));
        box.appendChild(btn);
    });
}

// ===== 金手指输入 =====
function showGoldFingerInput() {
    if (document.getElementById('goldfinger-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'goldfinger-panel';
    panel.className = 'goldfinger-panel';
    panel.innerHTML = `
        <div class="goldfinger-header">🎮 金手指 — 输入你的指令</div>
        <p class="goldfinger-hint">输入后将立即触发一轮围绕你指令的事件生成</p>
        <textarea id="goldfinger-input" class="goldfinger-input" placeholder="例如：我要向小美表白 / 下次让我中彩票 / 我决定辍学去创业..." maxlength="100" rows="2"></textarea>
        <div class="goldfinger-actions">
            <button id="goldfinger-cancel" class="goldfinger-cancel-btn">取消</button>
            <button id="goldfinger-confirm" class="goldfinger-confirm-btn">🎮 立即执行</button>
        </div>`;

    document.getElementById('options').appendChild(panel);

    document.getElementById('goldfinger-cancel').addEventListener('click', () => panel.remove());
    document.getElementById('goldfinger-confirm').addEventListener('click', async () => {
        const text = document.getElementById('goldfinger-input').value.trim();
        if (!text) { alert('请输入指令'); return; }
        panel.remove();
        await triggerGoldFinger(text);
    });
}

function renderChanges(changes) {
    if (!changes || !Object.keys(changes).length) return '';
    // stress is inverted: +stress = bad, -stress = good
    const INVERTED = ['stress'];
    return '<div class="stat-changes-display">' +
        Object.entries(changes).map(([k, v]) => {
            const name = STAT_NAMES[k] || k;
            const isGood = INVERTED.includes(k) ? v < 0 : v > 0;
            const cls = isGood ? 'positive' : 'negative';
            const sign = v > 0 ? '+' : '';
            return `<span class="stat-change ${cls}">${name} ${sign}${v}</span>`;
        }).join('') + '</div>';
}

async function handleChoice(idx) {
    // 保存快照用于回溯
    game.saveSnapshot();

    const result = game.makeChoice(currentEvent, idx);
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    // 写入传记日志
    const type = result.success ? 'success' : 'fail';
    appendBioLog(
        game.state.age,
        currentEvent.prompt,
        type,
        currentEvent.milestone || null,
        `${result.option.text}（${result.success ? '成功' : '失败'}）`
    );

    const narDiv = document.getElementById('narrative-display');
    narDiv.innerHTML = `<div class="loading-spinner"></div><p class="loading-text">AI 正在描述...</p>`;
    narDiv.classList.add('active');

    const narrative = await game.generateNarrative(currentEvent, result.option.text, result.success);

    narDiv.innerHTML = `
        <div class="narrative-result ${result.success ? 'success' : 'fail'}">
            <div class="result-tag">${result.success ? '✅ 成功' : '❌ 失败'}</div>
            <p>${narrative}</p>
            ${renderChanges(result.changes)}
        </div>
        ${game.canRewind() ? `<button id="rewind-choice-btn" class="rewind-btn">⏪ 回溯重选 (剩${game.state.rewindsLeft}次)</button>` : ''}
        <button id="continue-btn" class="continue-btn">继续 →</button>`;

    // 回溯按钮
    document.getElementById('rewind-choice-btn')?.addEventListener('click', () => {
        if (game.rewind()) {
            narDiv.classList.remove('active');
            narDiv.innerHTML = '';
            updateStatusBar();
            displayChoiceEvent(currentEvent, currentExtraChoices);
        }
    });

    // 极端状态检测
    const crisis = game.checkExtremeStates();
    if (crisis) {
        appendBioLog(game.state.age, crisis.prompt, 'fail');
        game.recordNarrative(crisis, {});
        narDiv.innerHTML += `
            <div class="narrative-result fail" style="margin-top:8px">
                <p>💀 ${crisis.prompt}</p>
            </div>`;
        const btn = narDiv.querySelector('#continue-btn');
        btn.textContent = '查看结局';
        btn.addEventListener('click', () => {
            narDiv.classList.remove('active');
            narDiv.innerHTML = '';
            showEnding();
        });
        updateStatusBar();
        return;
    }

    document.getElementById('continue-btn').addEventListener('click', () => {
        narDiv.classList.remove('active');
        narDiv.innerHTML = '';
        if (currentExtraChoices.length > 0) {
            const next = currentExtraChoices[0];
            const rest = currentExtraChoices.slice(1);
            displayChoiceEvent(next, rest);
        } else if (pendingAfterSequence) {
            const cb = pendingAfterSequence;
            pendingAfterSequence = null;
            cb();
        } else {
            nextYear();
        }
    });

    updateStatusBar();
}

async function showEnding() {
    const ending = game.calculateEnding();
    game.deleteSave(); // 结局后清除存档
    showScreen('end-screen');

    document.getElementById('ending-result').innerHTML = `
        <h2>${ending.title}</h2>
        <p>综合评分：${ending.score} · ${game.playerName}的一生</p>
        <div class="loading-spinner"></div>
        <p class="loading-text">AI 正在撰写人生总结...</p>`;

    const summary = await game.generateEndingSummary(ending.title);

    document.getElementById('ending-result').innerHTML = `
        <h2>${ending.title}</h2>
        <p>综合评分：${ending.score} · ${game.playerName}的一生</p>
        <div class="ending-summary">${summary}</div>
        <h3>人生历程</h3>
        ${game.state.history.map(h => {
            const cls = h.type === 'narrative' ? 'narrative' : (h.success ? 'success' : 'fail');
            const icon = h.type === 'narrative' ? '📖' : (h.success ? '✅' : '❌');
            const choiceText = h.choice ? ` → ${h.choice} ${icon}` : ` ${icon}`;
            return `<p class="history-item ${cls}">
                <span class="history-age">${h.age}岁</span>
                ${h.event}${choiceText}
                ${renderChanges(h.changes)}
            </p>`;
        }).join('')}`;

    // 显示观察者模式按钮
    const observerBtn = document.getElementById('observer-btn');
    const hasCharacters = Object.keys(game.state.characters).length > 0 ||
        game.state.profile.relationships.some(r => (r.importance || 3) >= 3);
    if (hasCharacters) {
        observerBtn.style.display = 'block';
    }
}

// 观察者模式
document.getElementById('observer-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('observer-btn');
    const resultDiv = document.getElementById('observer-result');
    btn.disabled = true;
    btn.textContent = 'AI 正在描写你走后的世界...';
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div class="loading-spinner"></div><p class="loading-text">正在观察...</p>';

    try {
        const text = await game.generateObserverMode();
        resultDiv.innerHTML = text;
        btn.textContent = '观察者模式';
        btn.style.display = 'none';
    } catch {
        resultDiv.innerHTML = '观察失败，请重试。';
        btn.disabled = false;
        btn.textContent = '观察者模式 — 重试';
    }
});

document.getElementById('restart')?.addEventListener('click', () => location.reload());

document.getElementById('export')?.addEventListener('click', () => {
    const blob = new Blob([game.exportLife()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${game.playerName}-life.json`;
    a.click();
});

initStartScreen();

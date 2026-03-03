import { GameEngine, API_BASE } from './engine.js';

const game = new GameEngine();
let currentEvent = null;
let currentExtraChoices = [];
let pendingAfterSequence = null; // 定时事件/金手指轮结束后的回调
let isAuthed = false; // 是否已通过密码验证
let currentLanguage = 'zh'; // 当前语言

// 翻译字典
const translations = {
    zh: {
        // 属性名
        intelligence: '智力', health: '健康', charisma: '魅力',
        willpower: '意志', luck: '运气', familyWealth: '家境',
        stress: '压力', money: '金钱', socialSupport: '社交',
        libido: '性欲', experience: '经验', satisfaction: '满足',
        education: '学历', job: '职业',
        relationships: '人际关系',
        age: '岁',
        male: '男', female: '女', other: '其他',
        
        // 界面文本
        title: '人生轨迹模拟器',
        subtitle: 'Lavro Labs · 多分支事件模拟',
        aiSettings: 'AI 设置',
        developer: '开发者',
        model: '模型',
        testConnection: '测试连接',
        aiHint: '选择 AI 提供商，填入你的 API Key',
        
        whoAreYou: '你是谁？',
        yourName: '你的名字',
        characterSetting: '角色设定（性格、背景、特点等）',
        kinkPreference: '性癖偏好（可选，多个用逗号分隔）',
        
        allocatePoints: '分配属性点（剩余',
        points: '点）',
        attrWarningZero: '⚠️ 警告：属性为 0 极易夭折！',
        attrWarningLow: '⚠️ 警告：属性低于 2 点可能导致夭折！',
        
        difficulty: '难度',
        diffEasy: '简单',
        diffNormal: '普通',
        diffHard: '困难',
        diffHell: '地狱',
        diffHintEasy: '轻松的人生体验',
        diffHintNormal: '正常的人生体验',
        diffHintHard: '充满挑战的人生',
        diffHintHell: '极度困难，步步惊心',
        
        contentMode: '内容尺度',
        contentSfw: '全年龄',
        contentNsfw: 'NSFW',
        contentNsfwPlus: 'NSFW+',
        contentHintSfw: '适合所有人的内容，情感描写含蓄隐晦',
        contentHintNsfw: '成人内容，包含露骨的情感和身体描写',
        contentHintNsfwPlus: '极致成人模式，性和欲望是核心主题',
        
        creativeMode: '角色模式',
        creativeOriginal: '原创',
        creativeFanfic: '同人',
        creativeHintOriginal: '原创模式：所有角色都是独立创作，不参考现实人物',
        creativeHintFanfic: '同人模式：角色会参考现实/作品中的人设（如明星、动漫角色等）',
        
        narrativeStyle: '解说风格',
        styleHumorous: '吐槽风',
        styleLiterary: '文艺风',
        styleRealistic: '写实风',
        styleDramatic: '戏剧风',
        styleHintHumorous: '吐槽风：毒舌损友式的幽默解说（默认）',
        styleHintLiterary: '文艺风：优美细腻的文学化叙述',
        styleHintRealistic: '写实风：客观冷静的纪实性描写',
        styleHintDramatic: '戏剧风：夸张生动的戏剧化表现',
        
        lifeFocus: '人生侧重',
        focusBalanced: '均衡',
        focusCareer: '事业',
        focusRelationship: '感情',
        focusFamily: '家庭',
        focusAdventure: '冒险',
        focusHintBalanced: '均衡发展：事业、感情、家庭各方面都会出现',
        focusHintCareer: '事业为重：更多工作、升职、创业相关事件',
        focusHintRelationship: '感情为重：更多恋爱、亲密关系、情感纠葛',
        focusHintFamily: '家庭为重：更多家人互动、亲情、家庭责任',
        focusHintAdventure: '冒险刺激：更多意外、冒险、极端体验',
        
        startPhase: '起始阶段',
        phaseBirth: '出生',
        phaseElementary: '小学',
        phaseMiddle: '初中',
        phaseHigh: '高中',
        phaseCollege: '大学',
        phaseWork: '工作',
        phaseHintBirth: '从出生开始完整体验',
        phaseHintElementary: '跳过婴幼儿期，从小学开始',
        phaseHintMiddle: '跳过童年，从初中开始',
        phaseHintHigh: '跳过初中，从高中开始',
        phaseHintCollege: '跳过高中，从大学开始',
        phaseHintWork: '跳过学生时代，从工作开始',
        
        backgroundSetting: '背景设定',
        bgModern: '现代（优化）',
        bgCustom: '自定义',
        bgHintModern: '现代背景：经过优化的现代都市生活，包含学业、职场、感情等常规人生阶段',
        bgHintCustom: '自定义背景：完全自由的世界观设定，不受现代社会框架限制',
        customBgPlaceholder: '描述你的世界观设定...',
        customBgCount: '字',
        
        scheduledEvents: '定时事件',
        schedAge: '年龄',
        schedEvent: '事件描述',
        schedAdd: '添加',
        schedHint: '在指定年龄触发特定事件（可选）',
        
        startGame: '开始人生',
        continueGame: '继续上次的人生',
        
        unlimitedMode: '无限模式已激活'
    },
    en: {
        // Attribute names
        intelligence: 'Intelligence', health: 'Health', charisma: 'Charisma',
        willpower: 'Willpower', luck: 'Luck', familyWealth: 'Family Wealth',
        stress: 'Stress', money: 'Money', socialSupport: 'Social',
        libido: 'Libido', experience: 'Experience', satisfaction: 'Satisfaction',
        education: 'Education', job: 'Job',
        relationships: 'Relationships',
        age: ' years old',
        male: 'Male', female: 'Female', other: 'Other',
        
        // UI text
        title: 'Life Trajectory Simulator',
        subtitle: 'Lavro Labs · Multi-branch Event Simulation',
        aiSettings: 'AI Settings',
        developer: 'Developer',
        model: 'Model',
        testConnection: 'Test Connection',
        aiHint: 'Select AI provider and enter your API Key',
        
        whoAreYou: 'Who Are You?',
        yourName: 'Your Name',
        characterSetting: 'Character Setting (personality, background, traits, etc.)',
        kinkPreference: 'Kink Preferences (optional, comma-separated)',
        
        allocatePoints: 'Allocate Attribute Points (Remaining:',
        points: 'pts)',
        attrWarningZero: '⚠️ Warning: 0 attribute may lead to early death!',
        attrWarningLow: '⚠️ Warning: Attributes below 2 may lead to early death!',
        
        difficulty: 'Difficulty',
        diffEasy: 'Easy',
        diffNormal: 'Normal',
        diffHard: 'Hard',
        diffHell: 'Hell',
        diffHintEasy: 'Relaxed life experience',
        diffHintNormal: 'Normal life experience',
        diffHintHard: 'Challenging life full of obstacles',
        diffHintHell: 'Extremely difficult, every step is dangerous',
        
        contentMode: 'Content Rating',
        contentSfw: 'All Ages',
        contentNsfw: 'NSFW',
        contentNsfwPlus: 'NSFW+',
        contentHintSfw: 'Content suitable for all ages, subtle emotional descriptions',
        contentHintNsfw: 'Adult content with explicit emotional and physical descriptions',
        contentHintNsfwPlus: 'Extreme adult mode, sex and desire are core themes',
        
        creativeMode: 'Character Mode',
        creativeOriginal: 'Original',
        creativeFanfic: 'Fanfic',
        creativeHintOriginal: 'Original mode: All characters are independently created',
        creativeHintFanfic: 'Fanfic mode: Characters reference real people or fictional characters',
        
        narrativeStyle: 'Narrative Style',
        styleHumorous: 'Humorous',
        styleLiterary: 'Literary',
        styleRealistic: 'Realistic',
        styleDramatic: 'Dramatic',
        styleHintHumorous: 'Humorous: Witty and sarcastic commentary (default)',
        styleHintLiterary: 'Literary: Beautiful and refined literary narration',
        styleHintRealistic: 'Realistic: Objective and calm documentary-style description',
        styleHintDramatic: 'Dramatic: Exaggerated and vivid theatrical expression',
        
        lifeFocus: 'Life Focus',
        focusBalanced: 'Balanced',
        focusCareer: 'Career',
        focusRelationship: 'Romance',
        focusFamily: 'Family',
        focusAdventure: 'Adventure',
        focusHintBalanced: 'Balanced: Career, romance, and family all appear',
        focusHintCareer: 'Career-focused: More work, promotion, and business events',
        focusHintRelationship: 'Romance-focused: More love, intimacy, and emotional entanglements',
        focusHintFamily: 'Family-focused: More family interactions, kinship, and responsibilities',
        focusHintAdventure: 'Adventure: More accidents, adventures, and extreme experiences',
        
        startPhase: 'Starting Phase',
        phaseBirth: 'Birth',
        phaseElementary: 'Elementary',
        phaseMiddle: 'Middle School',
        phaseHigh: 'High School',
        phaseCollege: 'College',
        phaseWork: 'Work',
        phaseHintBirth: 'Start from birth for complete experience',
        phaseHintElementary: 'Skip infancy, start from elementary school',
        phaseHintMiddle: 'Skip childhood, start from middle school',
        phaseHintHigh: 'Skip middle school, start from high school',
        phaseHintCollege: 'Skip high school, start from college',
        phaseHintWork: 'Skip student years, start from work',
        
        backgroundSetting: 'Background Setting',
        bgModern: 'Modern (Optimized)',
        bgCustom: 'Custom',
        bgHintModern: 'Modern background: Optimized modern urban life with education, career, romance, etc.',
        bgHintCustom: 'Custom background: Completely free worldview setting, not limited by modern society',
        customBgPlaceholder: 'Describe your worldview setting...',
        customBgCount: 'chars',
        
        scheduledEvents: 'Scheduled Events',
        schedAge: 'Age',
        schedEvent: 'Event Description',
        schedAdd: 'Add',
        schedHint: 'Trigger specific events at designated ages (optional)',
        
        startGame: 'Start Life',
        continueGame: 'Continue Last Life',
        
        unlimitedMode: 'Unlimited Mode Activated'
    }
};

function t(key) {
    return translations[currentLanguage][key] || key;
}

const ATTR_NAMES = {
    intelligence: '智力', health: '健康', charisma: '魅力',
    willpower: '意志', luck: '运气', familyWealth: '家境'
};

const STAT_NAMES = {
    ...ATTR_NAMES,
    stress: '压力', money: '金钱', socialSupport: '社交'
};

// 属性分配相关变量（提升到外部作用域以便彩蛋访问）
let allocated = { ...game.state.attributes };
let pointsEl = null;
let container = null;
let unlimitedMode = false;

const calcUsed = () => Object.values(allocated).reduce((s, v) => s + v, 0);

const updatePoints = () => { 
    if (pointsEl) {
        if (unlimitedMode) {
            pointsEl.textContent = '∞';
        } else {
            pointsEl.textContent = 30 - calcUsed();
        }
    }
    checkLowAttributes();
};

const checkLowAttributes = () => {
    const warningEl = document.getElementById('attr-warning');
    if (!warningEl) return;
    
    const hasLowAttr = Object.values(allocated).some(v => v <= 2 && v > 0);
    const hasZeroAttr = Object.values(allocated).some(v => v === 0);
    
    if (hasZeroAttr) {
        warningEl.textContent = '⚠️ 警告：属性为 0 极易夭折！';
        warningEl.style.display = 'block';
        warningEl.style.color = 'var(--danger)';
    } else if (hasLowAttr) {
        warningEl.textContent = '⚠️ 警告：属性低于 2 点可能导致夭折！';
        warningEl.style.display = 'block';
        warningEl.style.color = 'var(--warning)';
    } else {
        warningEl.style.display = 'none';
    }
};

// 年龄到阶段的映射（用于滑块）
function getPhaseFromAge(age) {
    if (age === 0) return currentLanguage === 'zh' ? '出生' : 'Birth';
    if (age >= 1 && age <= 5) return currentLanguage === 'zh' ? '幼儿' : 'Toddler';
    if (age >= 6 && age <= 11) return currentLanguage === 'zh' ? '小学' : 'Elementary';
    if (age >= 12 && age <= 14) return currentLanguage === 'zh' ? '初中' : 'Middle School';
    if (age >= 15 && age <= 17) return currentLanguage === 'zh' ? '高中' : 'High School';
    if (age >= 18 && age <= 21) return currentLanguage === 'zh' ? '大学' : 'College';
    if (age >= 22 && age <= 29) return currentLanguage === 'zh' ? '工作' : 'Work';
    if (age >= 30 && age <= 39) return currentLanguage === 'zh' ? '而立' : 'Thirties';
    if (age >= 40 && age <= 49) return currentLanguage === 'zh' ? '不惑' : 'Forties';
    if (age >= 50 && age <= 59) return currentLanguage === 'zh' ? '知天命' : 'Fifties';
    if (age >= 60 && age <= 69) return currentLanguage === 'zh' ? '花甲' : 'Sixties';
    if (age >= 70) return currentLanguage === 'zh' ? '古稀' : 'Seventies+';
    return '';
}

// 年龄到提示的映射（用于滑块）
function getPhaseHint(age) {
    const hints = {
        zh: {
            0: '从出生开始完整体验',
            1: '跳过婴儿期，从幼儿开始',
            6: '跳过婴幼儿期，从小学开始',
            12: '跳过童年，从初中开始',
            15: '跳过初中，从高中开始',
            18: '跳过高中，从大学开始',
            22: '跳过学生时代，从工作开始',
            30: '从而立之年开始，事业初成',
            40: '从不惑之年开始，人生过半',
            50: '从知天命开始，阅历丰富',
            60: '从花甲之年开始，步入老年',
            70: '从古稀之年开始，人生晚期'
        },
        en: {
            0: 'Start from birth for complete experience',
            1: 'Skip infancy, start from toddler years',
            6: 'Skip infancy, start from elementary school',
            12: 'Skip childhood, start from middle school',
            15: 'Skip middle school, start from high school',
            18: 'Skip high school, start from college',
            22: 'Skip student years, start from work',
            30: 'Start from thirties, career established',
            40: 'Start from forties, midlife',
            50: 'Start from fifties, experienced',
            60: 'Start from sixties, senior years',
            70: 'Start from seventies, late life'
        }
    };
    
    // 找到最接近的关键年龄
    const keyAges = [0, 1, 6, 12, 15, 18, 22, 30, 40, 50, 60, 70];
    let closestAge = 0;
    for (const keyAge of keyAges) {
        if (age >= keyAge) closestAge = keyAge;
    }
    
    return hints[currentLanguage][closestAge] || hints[currentLanguage][0];
}

// 属性点击处理
function handleAttrClick(e) {
    if (!e.target.matches('button')) return;
    const attr = e.target.dataset.attr;
    const valSpan = e.target.parentElement.querySelector('.value');
    
    if (unlimitedMode) {
        // 无限模式：无上限
        if (e.target.classList.contains('plus')) allocated[attr]++;
        else if (e.target.classList.contains('minus') && allocated[attr] > 0) allocated[attr]--;
    } else {
        // 普通模式：30点上限
        if (e.target.classList.contains('plus') && calcUsed() < 30) allocated[attr]++;
        else if (e.target.classList.contains('minus') && allocated[attr] > 0) allocated[attr]--;
    }
    
    valSpan.textContent = allocated[attr];
    updatePoints();
}

// 【性能】DOM 引用缓存，避免每次 getElementById 查询
const DOM = {};
function cacheDOM() {
    DOM.eventTitle = document.getElementById('event-title');
    DOM.eventDesc = document.getElementById('event-description');
    DOM.options = document.getElementById('options');
    DOM.currentAge = document.getElementById('current-age');
    DOM.stress = document.getElementById('stress');
    DOM.money = document.getElementById('money');
    DOM.social = document.getElementById('social');
    DOM.libido = document.getElementById('libido');
    DOM.experience = document.getElementById('experience');
    DOM.satisfaction = document.getElementById('satisfaction');
    DOM.attrDisplay = document.getElementById('attributes-display');
    DOM.traitsDisplay = document.getElementById('traits-display');
    DOM.bioLogContent = document.getElementById('bio-log-content');
    DOM.profileEducation = document.getElementById('profile-education');
    DOM.profileJob = document.getElementById('profile-job');
    DOM.profileRelationships = document.getElementById('profile-relationships');
    DOM.profileCharacters = document.getElementById('profile-characters');
}
// 在 DOMContentLoaded 后初始化缓存
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cacheDOM);
} else {
    cacheDOM();
}

// 【性能】脏标记：只在数据变化时重建 profile DOM
let _profileDirty = true;
let _lastCharHash = '';
let _lastRelHash = '';

// ===== 传记日志 =====
function appendBioLog(age, text, type = 'narrative', milestone = null, choice = null) {
    const container = DOM.bioLogContent || document.getElementById('bio-log-content');
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
    container = document.querySelector('.attributes');
    pointsEl = document.getElementById('points-left');
    allocated = { ...game.state.attributes };

    for (const [key, name] of Object.entries(ATTR_NAMES)) {
        const div = document.createElement('div');
        div.className = 'attribute-item';
        div.innerHTML = `
            <span>${name}</span>
            <div>
                <button class="minus" data-attr="${key}">-</button>
                <span class="value">${allocated[key]}</span>
                <button class="plus" data-attr="${key}">+</button>
            </div>`;
        container.appendChild(div);
    }

    container.addEventListener('click', handleAttrClick);
    
    // 初始化时更新点数显示
    updatePoints();

    // ===== 语言切换按钮 =====
    const langToggleBtn = document.getElementById('lang-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
            localStorage.setItem('life-sim-language', currentLanguage);
            updateLanguage();
        });
    }

    // 从localStorage恢复语言设置
    const savedLang = localStorage.getItem('life-sim-language');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
        currentLanguage = savedLang;
    }
    updateLanguage();

    function updateLanguage() {
        // 更新body的data-lang属性以切换字体
        document.body.setAttribute('data-lang', currentLanguage);
        
        // 更新标题
        const titleEl = document.querySelector('#start-screen h1');
        if (titleEl) titleEl.textContent = t('title');
        
        const subtitleEl = document.querySelector('#start-screen .subtitle');
        if (subtitleEl) subtitleEl.textContent = t('subtitle');
        
        // 更新AI设置
        const aiLabel = document.querySelector('.ai-config-section label');
        if (aiLabel) aiLabel.textContent = t('aiSettings');
        
        const devBtn = document.getElementById('dev-mode-btn');
        if (devBtn) devBtn.textContent = t('developer');
        
        const modelLabel = document.querySelector('.ai-model-label');
        if (modelLabel) modelLabel.textContent = t('model');
        
        const testBtn = document.getElementById('test-connection-btn');
        if (testBtn) testBtn.textContent = t('testConnection');
        
        const aiHint = document.getElementById('ai-config-hint');
        if (aiHint) aiHint.textContent = t('aiHint');
        
        // 更新身份部分
        const identityH2 = document.querySelector('.identity-section h2');
        if (identityH2) identityH2.textContent = t('whoAreYou');
        
        const nameInput = document.getElementById('player-name');
        if (nameInput) nameInput.placeholder = t('yourName');
        
        const personalityInput = document.getElementById('player-personality');
        if (personalityInput) personalityInput.placeholder = t('characterSetting');
        
        const kinksInput = document.getElementById('player-kinks');
        if (kinksInput) kinksInput.placeholder = t('kinkPreference');
        
        // 更新性别选项
        const genderSelect = document.getElementById('player-gender');
        if (genderSelect) {
            const currentValue = genderSelect.value;
            if (currentLanguage === 'en') {
                genderSelect.innerHTML = `
                    <option value="Male">${t('male')}</option>
                    <option value="Female">${t('female')}</option>
                    <option value="Other">${t('other')}</option>
                `;
                if (currentValue === '男') genderSelect.value = 'Male';
                else if (currentValue === '女') genderSelect.value = 'Female';
                else if (currentValue === '其他') genderSelect.value = 'Other';
            } else {
                genderSelect.innerHTML = `
                    <option value="男">${t('male')}</option>
                    <option value="女">${t('female')}</option>
                    <option value="其他">${t('other')}</option>
                `;
                if (currentValue === 'Male') genderSelect.value = '男';
                else if (currentValue === 'Female') genderSelect.value = '女';
                else if (currentValue === 'Other') genderSelect.value = '其他';
            }
        }
        
        // 更新属性分配标题
        const attrH2 = document.querySelector('#attribute-allocation h2');
        if (attrH2) {
            const pointsLeft = document.getElementById('points-left');
            const pointsText = pointsLeft ? pointsLeft.textContent : '0';
            attrH2.innerHTML = `${t('allocatePoints')} <span id="points-left">${pointsText}</span> ${t('points')}`;
        }
        
        // 更新属性名称
        document.querySelectorAll('.attribute-item span:first-child').forEach((span, index) => {
            const keys = Object.keys(ATTR_NAMES);
            if (keys[index]) {
                span.textContent = t(keys[index]);
            }
        });
        
        // 更新难度部分
        const diffSection = document.querySelector('.difficulty-section');
        if (diffSection) {
            const label = diffSection.querySelector('label');
            if (label) label.textContent = t('difficulty');
            
            const easyBtn = diffSection.querySelector('.diff-btn[data-diff="1"]');
            if (easyBtn) easyBtn.textContent = t('diffEasy');
            
            const normalBtn = diffSection.querySelector('.diff-btn[data-diff="2"]');
            if (normalBtn) normalBtn.textContent = t('diffNormal');
            
            const hardBtn = diffSection.querySelector('.diff-btn[data-diff="3"]');
            if (hardBtn) hardBtn.textContent = t('diffHard');
            
            const hellBtn = diffSection.querySelector('.diff-btn[data-diff="4"]');
            if (hellBtn) hellBtn.textContent = t('diffHell');
            
            // 更新当前选中的难度提示
            const activeBtn = diffSection.querySelector('.diff-btn.active');
            if (activeBtn) {
                const diff = activeBtn.dataset.diff;
                const hintKey = diff === '1' ? 'diffHintEasy' : diff === '2' ? 'diffHintNormal' : diff === '3' ? 'diffHintHard' : 'diffHintHell';
                const hint = document.getElementById('difficulty-hint');
                if (hint) hint.textContent = t(hintKey);
            }
        }
        
        // 更新内容尺度
        const contentSection = document.querySelector('.content-mode-section');
        if (contentSection) {
            const label = contentSection.querySelector('label');
            if (label) label.textContent = t('contentMode');
            
            const sfwBtn = document.getElementById('sfw-btn');
            if (sfwBtn) sfwBtn.textContent = t('contentSfw');
            
            const hint = document.getElementById('content-mode-hint');
            if (hint) hint.textContent = t('contentHintSfw');
        }
        
        // 更新角色模式
        const creativeSection = document.querySelector('.creative-mode-section');
        if (creativeSection) {
            const label = creativeSection.querySelector('label');
            if (label) label.textContent = t('creativeMode');
            
            const originalBtn = creativeSection.querySelector('.creative-btn[data-mode="original"]');
            if (originalBtn) originalBtn.textContent = t('creativeOriginal');
            
            const fanficBtn = creativeSection.querySelector('.creative-btn[data-mode="fanfic"]');
            if (fanficBtn) fanficBtn.textContent = t('creativeFanfic');
            
            const hint = document.getElementById('creative-mode-hint');
            if (hint) {
                const activeBtn = creativeSection.querySelector('.creative-btn.active');
                const mode = activeBtn?.dataset.mode || 'original';
                hint.textContent = t(mode === 'original' ? 'creativeHintOriginal' : 'creativeHintFanfic');
            }
        }
        
        // 更新解说风格
        const narrativeSection = document.querySelector('.narrative-style-section');
        if (narrativeSection) {
            const label = narrativeSection.querySelector('label');
            if (label) label.textContent = t('narrativeStyle');
            
            const humorousBtn = narrativeSection.querySelector('.style-btn[data-style="humorous"]');
            if (humorousBtn) humorousBtn.textContent = t('styleHumorous');
            
            const literaryBtn = narrativeSection.querySelector('.style-btn[data-style="literary"]');
            if (literaryBtn) literaryBtn.textContent = t('styleLiterary');
            
            const realisticBtn = narrativeSection.querySelector('.style-btn[data-style="realistic"]');
            if (realisticBtn) realisticBtn.textContent = t('styleRealistic');
            
            const dramaticBtn = narrativeSection.querySelector('.style-btn[data-style="dramatic"]');
            if (dramaticBtn) dramaticBtn.textContent = t('styleDramatic');
            
            const hint = document.getElementById('narrative-style-hint');
            if (hint) {
                const activeBtn = narrativeSection.querySelector('.style-btn.active');
                const style = activeBtn?.dataset.style || 'humorous';
                const hintKey = `styleHint${style.charAt(0).toUpperCase() + style.slice(1)}`;
                hint.textContent = t(hintKey);
            }
        }
        
        // 更新人生侧重
        const focusSection = document.querySelector('.life-focus-section');
        if (focusSection) {
            const label = focusSection.querySelector('label');
            if (label) label.textContent = t('lifeFocus');
            
            const balancedBtn = focusSection.querySelector('.focus-opt-btn[data-focus="balanced"]');
            if (balancedBtn) balancedBtn.textContent = t('focusBalanced');
            
            const careerBtn = focusSection.querySelector('.focus-opt-btn[data-focus="career"]');
            if (careerBtn) careerBtn.textContent = t('focusCareer');
            
            const relationshipBtn = focusSection.querySelector('.focus-opt-btn[data-focus="relationship"]');
            if (relationshipBtn) relationshipBtn.textContent = t('focusRelationship');
            
            const familyBtn = focusSection.querySelector('.focus-opt-btn[data-focus="family"]');
            if (familyBtn) familyBtn.textContent = t('focusFamily');
            
            const adventureBtn = focusSection.querySelector('.focus-opt-btn[data-focus="adventure"]');
            if (adventureBtn) adventureBtn.textContent = t('focusAdventure');
            
            const hint = document.getElementById('life-focus-hint');
            if (hint) {
                const activeBtn = focusSection.querySelector('.focus-opt-btn.active');
                const focus = activeBtn?.dataset.focus || 'balanced';
                const hintKey = `focusHint${focus.charAt(0).toUpperCase() + focus.slice(1)}`;
                hint.textContent = t(hintKey);
            }
        }
        
        // 更新起始阶段
        const phaseSection = document.querySelector('.phase-section');
        if (phaseSection) {
            const label = phaseSection.querySelector('label');
            if (label) label.textContent = t('startPhase');
            
            // 更新滑块显示的阶段标签和提示
            const phaseAgeDisplay = document.getElementById('phase-age-display');
            const phaseLabelDisplay = document.getElementById('phase-label-display');
            const phaseHintEl = document.getElementById('phase-hint');
            
            if (phaseLabelDisplay && phaseAgeDisplay) {
                const currentAge = parseInt(phaseAgeDisplay.textContent) || 0;
                phaseLabelDisplay.textContent = getPhaseFromAge(currentAge);
                if (phaseHintEl) {
                    phaseHintEl.textContent = getPhaseHint(currentAge);
                }
            }
        }
        
        // 更新背景设定
        const bgSection = document.querySelector('.background-setting-section');
        if (bgSection) {
            const label = bgSection.querySelector('label');
            if (label) label.textContent = t('backgroundSetting');
            
            const modernBtn = bgSection.querySelector('.bg-btn[data-bg="modern"]');
            if (modernBtn) modernBtn.textContent = t('bgModern');
            
            const customBtn = bgSection.querySelector('.bg-btn[data-bg="custom"]');
            if (customBtn) customBtn.textContent = t('bgCustom');
            
            const bgHint = document.getElementById('background-hint');
            if (bgHint) bgHint.textContent = t('bgHintModern');
            
            const customBgTextarea = document.getElementById('custom-background-text');
            if (customBgTextarea) customBgTextarea.placeholder = t('customBgPlaceholder');
        }
        
        // 更新定时事件
        const schedSection = document.querySelector('.scheduled-events-section');
        if (schedSection) {
            const label = schedSection.querySelector('label');
            if (label) label.textContent = t('scheduledEvents');
            
            const hint = schedSection.querySelector('.scheduled-hint');
            if (hint) hint.textContent = t('schedHint');
            
            const ageInput = document.getElementById('sched-age');
            if (ageInput) ageInput.placeholder = t('schedAge');
            
            const textInput = document.getElementById('sched-text');
            if (textInput) textInput.placeholder = t('schedEvent');
            
            const addBtn = document.getElementById('sched-add-btn');
            if (addBtn) addBtn.textContent = '+';
        }
        
        // 更新按钮
        const startBtn = document.getElementById('start-game');
        if (startBtn) {
            const img = startBtn.querySelector('img');
            startBtn.innerHTML = '';
            if (img) startBtn.appendChild(img);
            startBtn.appendChild(document.createTextNode(t('startGame')));
        }
        
        const loadBtn = document.getElementById('load-game');
        if (loadBtn) {
            const img = loadBtn.querySelector('img');
            loadBtn.innerHTML = '';
            if (img) loadBtn.appendChild(img);
            loadBtn.appendChild(document.createTextNode(t('continueGame')));
        }
    }

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
    const testConnBtn = document.getElementById('test-connection-btn');
    let useBuiltinKey = false;

    // 连通性测试通过后才能开始
    function setAuthed(val) {
        isAuthed = val;
        startBtn.disabled = !val;
        startBtn.style.opacity = val ? '1' : '0.4';
    }

    function enableTestBtn() {
        testConnBtn.disabled = false;
    }
    function disableTestBtn() {
        testConnBtn.disabled = true;
    }

    // 任何配置变更都重置验证状态
    function resetAuth() {
        setAuthed(false);
        aiHint.textContent = '请点击「测试连接」验证配置';
        aiHint.style.color = '';
    }

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
        // 切换模型后需要重新测试
        if (isAuthed) resetAuth();
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
        }
        resetAuth();
        disableTestBtn();
    });

    // 从 localStorage 恢复（只恢复 provider 和 model，不恢复 API Key）
    const savedProvider = localStorage.getItem('life-sim-provider');
    const savedModel = localStorage.getItem('life-sim-model');
    if (savedProvider && PROVIDERS[savedProvider]) {
        providerSelect.value = savedProvider;
        updateModelOptions();
        if (savedModel) modelSelect.value = savedModel;
    }
    // 清理旧版本可能保存的 API Key（安全考虑）
    localStorage.removeItem('life-sim-ai-key');

    aiKeyInput.addEventListener('input', () => {
        useBuiltinKey = false;
        devModeBtn.classList.remove('active');
        if (aiKeyInput.value.trim()) {
            aiHint.textContent = '请点击「测试连接」验证配置';
            aiHint.style.color = '';
            enableTestBtn();
        } else {
            aiHint.textContent = '选择 AI 提供商，填入你的 API Key';
            aiHint.style.color = '';
            disableTestBtn();
        }
        setAuthed(false);
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
                    aiKeyInput.value = '';
                    aiKeyInput.placeholder = '开发者模式已激活';
                    aiKeyInput.disabled = true;
                    providerSelect.value = 'deepseek';
                    updateModelOptions();
                    devModeBtn.classList.add('active');
                    overlay.remove();
                    // 自动触发连通性测试
                    enableTestBtn();
                    // 延迟一下确保 DOM 更新完成
                    setTimeout(() => testConnBtn.click(), 100);
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

    // 连通性测试按钮
    testConnBtn.addEventListener('click', async () => {
        const provider = providerSelect.value;
        const model = modelSelect.value;
        const userKey = aiKeyInput.value.trim();

        if (!useBuiltinKey && !userKey) {
            aiHint.textContent = '❌ 请先输入 API Key';
            aiHint.style.color = 'var(--danger)';
            return;
        }

        const payload = useBuiltinKey
            ? { provider, model, apiKey: '__BUILTIN__' }
            : { provider, model, apiKey: userKey };

        testConnBtn.disabled = true;
        testConnBtn.textContent = '⏳ 后端连接中...';
        aiHint.textContent = '正在连接后端（首次可能需要30秒唤醒）...';
        aiHint.style.color = 'var(--warning)';

        // 带超时的 fetch
        function fetchWithTimeout(url, options, timeoutMs = 60000) {
            return Promise.race([
                fetch(url, options),
                new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时，服务器可能在休眠')), timeoutMs))
            ]);
        }

        // Step 1: 检查后端是否在线
        try {
            const healthRes = await fetchWithTimeout(`${API_BASE}/api/health`, { method: 'GET' }, 60000);
            if (!healthRes.ok) throw new Error(`后端返回 ${healthRes.status}`);
            const healthData = await healthRes.json();
            console.log('✅ 后端健康检查:', healthData);
        } catch (err) {
            console.error('❌ 后端连接失败:', err);
            testConnBtn.textContent = '重新测试';
            testConnBtn.disabled = false;
            aiHint.textContent = `❌ 后端连接失败: ${err.message}`;
            aiHint.style.color = 'var(--danger)';
            setAuthed(false);
            return;
        }

        // Step 2: 先设置 AI 配置
        testConnBtn.textContent = '⏳ 配置 AI...';
        aiHint.textContent = '后端已连接，正在设置 AI 配置...';
        try {
            const keyRes = await fetchWithTimeout(`${API_BASE}/api/set-key`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, 15000);
            if (!keyRes.ok) {
                const errData = await keyRes.json().catch(() => ({}));
                throw new Error(errData.error || `设置失败 (${keyRes.status})`);
            }
        } catch (err) {
            console.error('❌ AI 配置失败:', err);
            testConnBtn.textContent = '重新测试';
            testConnBtn.disabled = false;
            aiHint.textContent = `❌ AI 配置失败: ${err.message}`;
            aiHint.style.color = 'var(--danger)';
            setAuthed(false);
            return;
        }

        // Step 3: 测试 AI 连通性
        testConnBtn.textContent = '⏳ AI 测试中...';
        aiHint.textContent = '正在测试 AI 接口（可能需要几秒）...';
        try {
            const testRes = await fetchWithTimeout(`${API_BASE}/api/test-connection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }, 30000);
            const testData = await testRes.json();
            if (testData.ok) {
                testConnBtn.textContent = '✅ 连接成功';
                testConnBtn.disabled = false; // 立即解除 disabled
                aiHint.textContent = '✅ 连接成功，可以开始游戏';
                aiHint.style.color = 'var(--success)';
                setAuthed(true);
                // 保存到 localStorage（只保存 provider 和 model，不保存 API Key）
                if (!useBuiltinKey && userKey) {
                    localStorage.setItem('life-sim-provider', provider);
                    localStorage.setItem('life-sim-model', model);
                }
                // 3秒后恢复按钮文字
                setTimeout(() => { 
                    if (testConnBtn.textContent === '✅ 连接成功') {
                        testConnBtn.textContent = '测试连接'; 
                    }
                }, 3000);
            } else {
                testConnBtn.textContent = '重新测试';
                testConnBtn.disabled = false;
                aiHint.textContent = `❌ AI 测试失败: ${testData.error || '未知错误'}`;
                aiHint.style.color = 'var(--danger)';
                setAuthed(false);
            }
        } catch (err) {
            console.error('❌ AI 测试失败:', err);
            testConnBtn.textContent = '重新测试';
            testConnBtn.disabled = false;
            aiHint.textContent = `❌ 测试失败: ${err.message}`;
            aiHint.style.color = 'var(--danger)';
            setAuthed(false);
        }
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

    // 内容尺度选择 — 三级模式：全年龄 → NSFW → NSFW+
    let selectedContentMode = 'sfw';
    let nsfwUnlocked = false;
    let nsfwPlusUnlocked = false;
    let sfwClickCount = 0;
    let nsfwClickCount = 0;
    let sfwClickTimer = null;
    let nsfwClickTimer = null;
    const contentHints = {
        sfw: '适合所有人的内容，情感描写含蓄隐晦',
        nsfw: '对情色内容不加限制，但不会刻意强调',
        nsfwPlus: '🔞 专注于情色内容的极致体验'
    };

    const sfwBtn = document.getElementById('sfw-btn');
    let nsfwBtn = null;
    let nsfwPlusBtn = null;

    // 全年龄按钮点击
    sfwBtn.addEventListener('click', () => {
        if (!nsfwUnlocked) {
            // 解锁NSFW
            sfwClickCount++;
            clearTimeout(sfwClickTimer);
            sfwClickTimer = setTimeout(() => { sfwClickCount = 0; }, 800);
            if (sfwClickCount >= 3) {
                nsfwUnlocked = true;
                sfwClickCount = 0;
                const optionsDiv = document.querySelector('.content-mode-options');
                optionsDiv.classList.add('expanded');
                nsfwBtn = document.createElement('button');
                nsfwBtn.className = 'content-btn';
                nsfwBtn.dataset.mode = 'nsfw';
                nsfwBtn.textContent = 'NSFW';
                optionsDiv.appendChild(nsfwBtn);
                
                nsfwBtn.addEventListener('click', handleNsfwClick);
                document.getElementById('content-mode-hint').textContent = '已解锁 NSFW 模式';
            }
        } else {
            // 切换到全年龄
            document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
            sfwBtn.classList.add('active');
            selectedContentMode = 'sfw';
            document.getElementById('content-mode-hint').textContent = contentHints.sfw;
            document.getElementById('kink-input-section').style.display = 'none';
            document.body.classList.remove('nsfw-plus-mode');
        }
    });

    function handleNsfwClick() {
        if (!nsfwPlusUnlocked) {
            // 解锁NSFW+
            nsfwClickCount++;
            clearTimeout(nsfwClickTimer);
            nsfwClickTimer = setTimeout(() => { nsfwClickCount = 0; }, 800);
            if (nsfwClickCount >= 3) {
                nsfwPlusUnlocked = true;
                nsfwClickCount = 0;
                const optionsDiv = document.querySelector('.content-mode-options');
                // 改为三列布局
                optionsDiv.classList.add('three-columns');
                nsfwPlusBtn = document.createElement('button');
                nsfwPlusBtn.className = 'content-btn nsfw-plus-btn';
                nsfwPlusBtn.dataset.mode = 'nsfwPlus';
                nsfwPlusBtn.textContent = 'NSFW+';
                optionsDiv.appendChild(nsfwPlusBtn);
                
                nsfwPlusBtn.addEventListener('click', () => {
                    document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
                    nsfwPlusBtn.classList.add('active');
                    selectedContentMode = 'nsfwPlus';
                    document.getElementById('content-mode-hint').textContent = contentHints.nsfwPlus;
                    document.getElementById('kink-input-section').style.display = 'block';
                    document.body.classList.add('nsfw-plus-mode');
                });
                
                document.getElementById('content-mode-hint').textContent = '已解锁 NSFW+ 模式';
            } else {
                // 正常切换到NSFW
                document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
                nsfwBtn.classList.add('active');
                selectedContentMode = 'nsfw';
                document.getElementById('content-mode-hint').textContent = contentHints.nsfw;
                document.getElementById('kink-input-section').style.display = 'none';
                document.body.classList.remove('nsfw-plus-mode');
            }
        } else {
            // 切换到NSFW
            document.querySelectorAll('.content-btn').forEach(b => b.classList.remove('active'));
            nsfwBtn.classList.add('active');
            selectedContentMode = 'nsfw';
            document.getElementById('content-mode-hint').textContent = contentHints.nsfw;
            document.getElementById('kink-input-section').style.display = 'none';
            document.body.classList.remove('nsfw-plus-mode');
        }
    }

    // 角色模式选择
    let selectedCreativeMode = 'original';
    const creativeModeHints = {
        original: '原创模式：所有角色都是独立创作，不参考现实人物',
        fanfic: '同人模式：角色会参考现实/作品中的人设（如明星、动漫角色等）'
    };
    document.querySelectorAll('.creative-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.creative-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCreativeMode = btn.dataset.mode;
            document.getElementById('creative-mode-hint').textContent = creativeModeHints[selectedCreativeMode];
        });
    });

    // 解说风格选择
    let selectedNarrativeStyle = 'humorous';
    const narrativeStyleHints = {
        humorous: '吐槽风：毒舌损友式的幽默解说（默认）',
        literary: '文艺风：优美细腻的文学化叙述',
        realistic: '写实风：客观冷静的纪实性描写',
        dramatic: '戏剧风：夸张生动的戏剧化表现'
    };
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedNarrativeStyle = btn.dataset.style;
            document.getElementById('narrative-style-hint').textContent = narrativeStyleHints[selectedNarrativeStyle];
        });
    });

    // 人生侧重选择
    let selectedLifeFocus = 'balanced';
    const lifeFocusHints = {
        balanced: '均衡发展：事业、感情、家庭各方面都会出现',
        career: '事业为重：更多工作、升职、创业相关事件',
        relationship: '感情为重：更多恋爱、亲密关系、情感纠葛',
        family: '家庭为重：更多家人互动、亲情、家庭责任',
        adventure: '冒险刺激：更多意外、冒险、极端体验'
    };
    document.querySelectorAll('.focus-opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.focus-opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedLifeFocus = btn.dataset.focus;
            document.getElementById('life-focus-hint').textContent = lifeFocusHints[selectedLifeFocus];
        });
    });

    // 背景设定选择
    let selectedBackground = 'modern';
    let customBackgroundText = '';
    let customMaxAge = 80;
    const backgroundHints = {
        modern: '现代背景：经过优化的现代都市生活，包含学业、职场、感情等常规人生阶段',
        custom: '自定义背景：完全自由的世界观设定，不受现代社会框架限制'
    };
    
    const phaseSlider = document.getElementById('phase-slider');
    const phaseSliderSection = document.getElementById('phase-section-slider');
    const phaseInputSection = document.getElementById('phase-section-input');
    const phaseAgeInput = document.getElementById('phase-age-input');
    
    document.querySelectorAll('.bg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.bg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedBackground = btn.dataset.bg;
            document.getElementById('background-hint').textContent = backgroundHints[selectedBackground] || '';
            
            const customInput = document.getElementById('custom-background-input');
            
            if (selectedBackground === 'custom') {
                customInput.style.display = 'block';
                // 自定义模式：显示输入框，隐藏滑块
                if (phaseSliderSection) phaseSliderSection.style.display = 'none';
                if (phaseInputSection) phaseInputSection.style.display = 'block';
                // 同步当前年龄到输入框
                if (phaseAgeInput) phaseAgeInput.value = selectedStartAge;
            } else {
                customInput.style.display = 'none';
                // 现代模式：显示滑块，隐藏输入框
                if (phaseSliderSection) phaseSliderSection.style.display = 'block';
                if (phaseInputSection) phaseInputSection.style.display = 'none';
                // 现代模式下，固定80岁
                if (phaseSlider) {
                    phaseSlider.max = 80;
                    updateSliderMarkers(80);
                }
            }
        });
    });

    // 自定义最高年龄输入
    const customMaxAgeInput = document.getElementById('custom-max-age');
    customMaxAgeInput?.addEventListener('input', () => {
        let value = parseInt(customMaxAgeInput.value) || 80;
        if (value < 22) value = 22;
        if (value > 200) value = 200;
        customMaxAge = value;
        
        // 更新输入框的最大值
        if (phaseAgeInput) {
            phaseAgeInput.max = customMaxAge;
            // 如果当前值超过最大值，调整
            if (parseInt(phaseAgeInput.value) > customMaxAge) {
                phaseAgeInput.value = customMaxAge;
                selectedStartAge = customMaxAge;
            }
        }
    });
    
    // 起始年龄输入框事件
    if (phaseAgeInput) {
        phaseAgeInput.addEventListener('input', () => {
            let value = parseInt(phaseAgeInput.value) || 0;
            if (value < 0) value = 0;
            if (value > customMaxAge) value = customMaxAge;
            selectedStartAge = value;
            phaseAgeInput.value = value;
        });
    }
    
    // 更新滑块标记
    function updateSliderMarkers(maxAge) {
        const markers = document.querySelector('.phase-markers');
        if (!markers) return;
        
        if (maxAge <= 80) {
            // 标准标记：0, 18, 30, 50, 70, 80
            markers.innerHTML = `
                <span data-age="0">0</span>
                <span data-age="18">18</span>
                <span data-age="30">30</span>
                <span data-age="50">50</span>
                <span data-age="70">70</span>
                <span data-age="80">80</span>
            `;
        } else {
            // 自定义标记：0, 1/4, 1/2, 3/4, max
            const quarter = Math.round(maxAge / 4);
            const half = Math.round(maxAge / 2);
            const threeQuarter = Math.round(maxAge * 3 / 4);
            markers.innerHTML = `
                <span data-age="0">0</span>
                <span data-age="${quarter}">${quarter}</span>
                <span data-age="${half}">${half}</span>
                <span data-age="${threeQuarter}">${threeQuarter}</span>
                <span data-age="${maxAge}">${maxAge}</span>
            `;
        }
    }

    // 自定义背景文本输入
    const customBgTextarea = document.getElementById('custom-background-text');
    const customBgCount = document.getElementById('custom-bg-count');
    
    customBgTextarea?.addEventListener('input', () => {
        customBackgroundText = customBgTextarea.value;
        if (customBgCount) {
            customBgCount.textContent = customBackgroundText.length;
        }
    });

    // 起始阶段选择（滑块）
    let selectedStartAge = 0;
    
    const phaseAgeDisplay = document.getElementById('phase-age-display');
    const phaseLabelDisplay = document.getElementById('phase-label-display');
    const phaseHintEl = document.getElementById('phase-hint');
    
    if (phaseSlider && phaseAgeDisplay && phaseLabelDisplay && phaseHintEl) {
        phaseSlider.addEventListener('input', (e) => {
            selectedStartAge = parseInt(e.target.value);
            phaseAgeDisplay.textContent = selectedStartAge;
            phaseLabelDisplay.textContent = getPhaseFromAge(selectedStartAge);
            phaseHintEl.textContent = getPhaseHint(selectedStartAge);
        });
        
        // 初始化显示
        phaseAgeDisplay.textContent = selectedStartAge;
        phaseLabelDisplay.textContent = getPhaseFromAge(selectedStartAge);
        phaseHintEl.textContent = getPhaseHint(selectedStartAge);
    }

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
        const kinks = document.getElementById('player-kinks').value.trim();

        if (!name) { alert('请输入你的名字'); return; }
        if (!isAuthed) { alert('请先配置 AI 设置'); return; }
        if (!unlimitedMode && calcUsed() > 30) { alert('属性点超出30点！'); return; }

        // 发送 AI 配置到后端（已在测试时设置，这里再确认一次）
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
        } catch (err) {
            alert('AI 配置失败，请重新测试连接');
            return;
        }

        const weirdness = 3; // 固定值，已移除奇异度滑块
        game.initializeGame(name, gender, personality || '普通', allocated, weirdness, selectedDifficulty, selectedContentMode, selectedCreativeMode, selectedLifeFocus, kinks, selectedNarrativeStyle, selectedBackground, customBackgroundText, currentLanguage);
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
    document.querySelector('#start-screen h1')?.addEventListener('click', () => {
        titleClicks++;
        clearTimeout(titleClickTimer);
        titleClickTimer = setTimeout(() => { titleClicks = 0; }, 800);
        if (titleClicks >= 3 && !unlimitedMode) {
            unlimitedMode = true;
            titleClicks = 0;
            pointsEl.textContent = '∞';
            pointsEl.style.color = '#f59e0b';
            
            // 小提示动画
            const hint = document.createElement('div');
            hint.textContent = t('unlimitedMode');
            hint.style.cssText = 'text-align:center;color:#f59e0b;font-size:12px;font-weight:600;animation:fadeSlideUp 0.5s ease;';
            document.querySelector('#attribute-allocation').appendChild(hint);
            setTimeout(() => hint.remove(), 3000);
        }
    });

    // 传记弹窗控制
    document.getElementById('open-biography-btn')?.addEventListener('click', () => {
        document.getElementById('biography-modal').style.display = 'flex';
    });

    // 金手指按钮
    document.getElementById('goldfinger-trigger-btn')?.addEventListener('click', () => {
        showGoldFingerInput();
    });

    // 保存存档
    document.getElementById('save-game-btn')?.addEventListener('click', () => {
        try {
            const saveData = {
                version: '1.0',
                timestamp: Date.now(),
                playerName: game.playerName,
                playerGender: game.playerGender,
                playerPersonality: game.playerPersonality,
                playerKinks: game.playerKinks,
                contentMode: game.contentMode,
                creativeMode: game.creativeMode,
                narrativeStyle: game.narrativeStyle,
                lifeFocus: game.lifeFocus,
                state: game.state,
                scheduledEvents: game.scheduledEvents,
                backstory: game.backstory
            };
            
            const json = JSON.stringify(saveData, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `人生模拟器_${game.playerName}_${game.state.age}岁_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert('存档已保存！');
        } catch (err) {
            console.error('保存失败:', err);
            alert('保存失败：' + err.message);
        }
    });

    // 读取存档
    document.getElementById('load-game-file-btn')?.addEventListener('click', () => {
        document.getElementById('load-game-input').click();
    });

    document.getElementById('load-game-input')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const saveData = JSON.parse(text);
            
            // 验证存档格式
            if (!saveData.version || !saveData.playerName || !saveData.state) {
                throw new Error('存档格式不正确');
            }
            
            // 恢复游戏状态
            game.playerName = saveData.playerName;
            game.playerGender = saveData.playerGender;
            game.playerPersonality = saveData.playerPersonality;
            game.playerKinks = saveData.playerKinks || '';
            game.contentMode = saveData.contentMode || 'sfw';
            game.creativeMode = saveData.creativeMode || 'original';
            game.narrativeStyle = saveData.narrativeStyle || 'humorous';
            game.lifeFocus = saveData.lifeFocus || 'balanced';
            game.state = saveData.state;
            game.scheduledEvents = saveData.scheduledEvents || [];
            game.backstory = saveData.backstory || '';
            
            await game.loadFallbackEvents();
            
            // 切换到游戏界面
            showScreen('game-screen');
            updateStatusBar();
            updateFocusPhaseUI();
            
            // 显示当前事件或进入下一年
            alert(`存档读取成功！\n${game.playerName}，${game.state.age}岁`);
            nextYear();
            
            // 清空文件输入
            e.target.value = '';
        } catch (err) {
            console.error('读取失败:', err);
            alert('读取存档失败：' + err.message);
            e.target.value = '';
        }
    });

    document.getElementById('close-biography-btn')?.addEventListener('click', () => {
        document.getElementById('biography-modal').style.display = 'none';
    });

    // 点击弹窗背景关闭
    document.getElementById('biography-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'biography-modal') {
            document.getElementById('biography-modal').style.display = 'none';
        }
    });

    // 小档案折叠
    document.getElementById('profile-toggle')?.addEventListener('click', () => {
        const content = document.getElementById('profile-content');
        const arrow = document.querySelector('.profile-toggle-arrow');
        const collapsed = content.classList.toggle('collapsed');
        if (arrow) arrow.style.transform = collapsed ? 'rotate(-90deg)' : '';
    });
}

// 【性能】缓存 screen 元素列表，避免每次切屏都 querySelectorAll
let _cachedScreens = null;
function showScreen(id) {
    if (!_cachedScreens) _cachedScreens = document.querySelectorAll('.screen');
    _cachedScreens.forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    // 游戏界面添加布局类
    const app = document.getElementById('app');
    if (id === 'game-screen') {
        app.classList.add('game-layout');
        document.body.classList.add('game-active');
    } else {
        app.classList.remove('game-layout');
        document.body.classList.remove('game-active');
    }
}

function updateStatusBar() {
    const stressEl = DOM.stress || document.getElementById('stress');
    const moneyEl = DOM.money || document.getElementById('money');
    const socialEl = DOM.social || document.getElementById('social');
    
    const oldStress = parseInt(stressEl?.textContent) || 0;
    const oldMoney = parseInt(moneyEl?.textContent) || 0;
    const oldSocial = parseInt(socialEl?.textContent) || 0;

    (DOM.currentAge || document.getElementById('current-age')).textContent = game.state.age;

    const newStress = Math.round(game.state.derivedStats.stress);
    const newMoney = Math.round(game.state.derivedStats.money);
    const newSocial = Math.round(game.state.derivedStats.socialSupport);

    animateStatChange('stress', oldStress, newStress);
    animateStatChange('money', oldMoney, newMoney);
    animateStatChange('social', oldSocial, newSocial);

    // NSFW+ 模式显示情色数值
    const isNsfwPlus = game.contentMode === 'nsfwPlus';
    const libidoRow = document.getElementById('libido-row');
    const expRow = document.getElementById('experience-row');
    const satRow = document.getElementById('satisfaction-row');
    
    if (isNsfwPlus) {
        if (libidoRow) libidoRow.style.display = '';
        if (expRow) expRow.style.display = '';
        if (satRow) satRow.style.display = '';
        
        const oldLibido = parseInt((DOM.libido || document.getElementById('libido'))?.textContent) || 50;
        const oldExp = parseInt((DOM.experience || document.getElementById('experience'))?.textContent) || 0;
        const oldSat = parseInt((DOM.satisfaction || document.getElementById('satisfaction'))?.textContent) || 50;
        
        const newLibido = Math.round(game.state.derivedStats.libido || 50);
        const newExp = Math.round(game.state.derivedStats.experience || 0);
        const newSat = Math.round(game.state.derivedStats.satisfaction || 50);
        
        animateStatChange('libido', oldLibido, newLibido);
        animateStatChange('experience', oldExp, newExp);
        animateStatChange('satisfaction', oldSat, newSat);
    } else {
        if (libidoRow) libidoRow.style.display = 'none';
        if (expRow) expRow.style.display = 'none';
        if (satRow) satRow.style.display = 'none';
    }

    // 回溯按钮状态
    const rewindBtn = document.getElementById('rewind-btn');
    if (rewindBtn) {
        rewindBtn.textContent = `⏪ 回溯 (${game.state.rewindsLeft})`;
        rewindBtn.disabled = !game.canRewind();
        rewindBtn.style.display = game.state.rewindsLeft > 0 ? '' : 'none';
    }

    // 【性能】属性面板：diff 更新而非每次 innerHTML 重建
    const box = DOM.attrDisplay || document.getElementById('attributes-display');
    const attrEntries = Object.entries(ATTR_NAMES);
    if (box.children.length !== attrEntries.length) {
        // 首次渲染或结构变化时才全量重建
        box.innerHTML = '';
        for (const [key, name] of attrEntries) {
            const div = document.createElement('div');
            div.className = 'attr-display';
            div.dataset.attr = key;
            div.innerHTML = `<strong>${name}</strong><span>${game.state.attributes[key]}</span>`;
            box.appendChild(div);
        }
    } else {
        // 后续只更新数值文本
        for (const [key, name] of attrEntries) {
            const div = box.querySelector(`[data-attr="${key}"]`);
            if (div) {
                const span = div.querySelector('span');
                const newVal = String(game.state.attributes[key]);
                if (span.textContent !== newVal) {
                    span.textContent = newVal;
                }
            }
        }
    }

    // 特质显示 - 已禁用
    const traitsEl = DOM.traitsDisplay || document.getElementById('traits-display');
    if (traitsEl) {
        traitsEl.style.display = 'none';
    }

    // 【性能】标记 profile 需要更新
    _profileDirty = true;
    updateProfile();
}

function updateProfile() {
    const p = game.state.profile;
    const chars = game.state.characters;
    const eduEl = DOM.profileEducation || document.getElementById('profile-education');
    const jobEl = DOM.profileJob || document.getElementById('profile-job');
    const relListEl = document.getElementById('relationships-list');
    
    if (eduEl) eduEl.textContent = p.education || '未入学';
    if (jobEl) jobEl.textContent = p.job || '无';

    if (!relListEl) return;

    // 筛选有交情的人物（好感度 >= 30 或重要度 >= 3）
    const currentAge = game.state.age;
    const importantRels = p.relationships.filter(r => {
        const affinity = r.affinity || 0;
        const importance = r.importance || 3;
        // 显示好感度 >= 30 或重要度 >= 3 的人物
        if (affinity >= 30 || importance >= 3) return true;
        return false;
    });

    // 【性能】关系列表用 hash 检测变化
    const relHash = importantRels.map(r => `${r.name}|${r.relation}|${r.affinity}`).join(',');
    if (relHash === _lastRelHash) return;
    _lastRelHash = relHash;

    if (!importantRels.length) {
        relListEl.innerHTML = '<div class="empty-hint">还没有认识的人</div>';
        return;
    }

    relListEl.innerHTML = importantRels
        .sort((a, b) => (b.affinity || 0) - (a.affinity || 0))
        .map(r => {
            const affinity = r.affinity || 0;
            const relation = r.relation || '认识';
            const affinityColor = getAffinityColor(relation, affinity);
            
            return `<div class="relationship-item" data-rel-name="${r.name}">
                <div class="rel-name">${r.name}</div>
                <div class="rel-affinity" style="color: ${affinityColor}">${affinity}</div>
                <div class="rel-relation">${relation}</div>
            </div>`;
        }).join('');
    
    // 绑定点击事件显示详情
    relListEl.querySelectorAll('.relationship-item').forEach(item => {
        item.addEventListener('click', () => {
            const relName = item.dataset.relName;
            const rel = p.relationships.find(r => r.name === relName);
            const char = chars[relName];
            showNPCModal(char, rel);
        });
    });
}

// 根据关系类型和好感度返回颜色
function getAffinityColor(relation, affinity) {
    // 亲情关系 - 蓝色
    if (['父亲', '母亲', '爸爸', '妈妈', '儿子', '女儿', '兄弟', '姐妹', '哥哥', '弟弟', '姐姐', '妹妹', '爷爷', '奶奶', '外公', '外婆'].some(k => relation.includes(k))) {
        return '#60a5fa'; // 蓝色
    }
    // 恋爱关系 - 红色
    if (['恋人', '热恋', '男友', '女友', '配偶', '老公', '老婆', '丈夫', '妻子'].some(k => relation.includes(k))) {
        return '#f87171'; // 红色
    }
    // 暧昧关系 - 粉色
    if (['暗恋', '心动', '单相思', '暧昧', '喜欢'].some(k => relation.includes(k))) {
        return '#f472b6'; // 粉色
    }
    // 普通朋友 - 绿色（好感度 >= 50）
    if (affinity >= 50) {
        return '#4ade80'; // 绿色
    }
    // 默认 - 灰色
    return '#94a3b8';
}

// 显示NPC详情弹窗
function showNPCModal(char, rel) {
    const modal = document.createElement('div');
    modal.className = 'npc-detail-modal';
    
    const name = char?.name || rel?.name || '未知';
    const relation = rel?.relation || char?.relation || '认识';
    const affinity = rel?.affinity || 0;
    const status = rel?.status || '未知';
    
    modal.innerHTML = `
        <div class="npc-detail-content">
            <div class="npc-detail-header">
                <div>
                    <div class="npc-detail-name">${name}</div>
                    <div style="font-size: 13px; color: var(--text-dim); margin-top: 4px;">${relation}</div>
                </div>
                <button class="npc-detail-close">×</button>
            </div>
            <div class="npc-detail-info">
                ${rel ? `
                    <div class="npc-detail-row">
                        <span class="npc-detail-label">好感度</span>
                        <span class="npc-detail-value">${affinity}</span>
                    </div>
                    <div class="npc-detail-row">
                        <span class="npc-detail-label">状态</span>
                        <span class="npc-detail-value">${status}</span>
                    </div>
                ` : ''}
                ${char ? `
                    <div class="npc-detail-row">
                        <span class="npc-detail-label">性别</span>
                        <span class="npc-detail-value">${char.gender || '未知'}</span>
                    </div>
                    <div class="npc-detail-row">
                        <span class="npc-detail-label">年龄</span>
                        <span class="npc-detail-value">${char.age || '未知'}</span>
                    </div>
                    ${char.personality ? `
                        <div class="npc-detail-row">
                            <span class="npc-detail-label">性格</span>
                            <span class="npc-detail-value">${char.personality}</span>
                        </div>
                    ` : ''}
                    ${char.job ? `
                        <div class="npc-detail-row">
                            <span class="npc-detail-label">职业</span>
                            <span class="npc-detail-value">${char.job}</span>
                        </div>
                    ` : ''}
                    ${char.appearance ? `
                        <div class="npc-detail-row">
                            <span class="npc-detail-label">外貌</span>
                            <span class="npc-detail-value">${char.appearance}</span>
                        </div>
                    ` : ''}
                    ${char.backstory ? `
                        <div class="npc-detail-row full-width">
                            <span class="npc-detail-label">背景</span>
                            <span class="npc-detail-value">${char.backstory}</span>
                        </div>
                    ` : ''}
                    ${char.description ? `
                        <div class="npc-detail-row full-width">
                            <span class="npc-detail-label">介绍</span>
                            <span class="npc-detail-value">${char.description}</span>
                        </div>
                    ` : ''}
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击关闭按钮或背景关闭
    modal.querySelector('.npc-detail-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function getRelTagClass(relation) {
    if (['恋人', '热恋', '男友', '女友'].some(k => relation.includes(k))) return 'lover';
    if (['配偶', '老公', '老婆', '丈夫', '妻子'].some(k => relation.includes(k))) return 'spouse';
    if (['前任', '前男友', '前女女友'].some(k => relation.includes(k))) return 'ex';
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
    // 【性能】使用 DOM 缓存，减少 getElementById 调用
    const el = DOM[elementId] || document.getElementById(elementId);
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
    const title = DOM.eventTitle || document.getElementById('event-title');
    const desc = DOM.eventDesc || document.getElementById('event-description');
    const opts = DOM.options || document.getElementById('options');
    title.textContent = '';
    desc.textContent = '';
    desc.className = '';
    opts.innerHTML =
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
    (DOM.eventTitle || document.getElementById('event-title')).innerHTML = `${game.state.age}岁 <span class="milestone-badge">📅 定时事件</span>`;
    const desc = DOM.eventDesc || document.getElementById('event-description');
    desc.textContent = sched.text;
    desc.className = 'narrative-only';

    appendBioLog(game.state.age, `📅 定时事件：${sched.text}`, 'milestone');

    const box = DOM.options || document.getElementById('options');
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
        const box = DOM.options || document.getElementById('options');
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
        (DOM.eventTitle || document.getElementById('event-title')).textContent = `${game.state.age}岁`;
        const descEl = DOM.eventDesc || document.getElementById('event-description');
        descEl.textContent = '这一年平平淡淡地过去了。';
        descEl.className = 'narrative-only';
        const box = DOM.options || document.getElementById('options');
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
        const box = DOM.options || document.getElementById('options');
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

    (DOM.eventTitle || document.getElementById('event-title')).innerHTML = ageLabel + msTag;
    const desc = DOM.eventDesc || document.getElementById('event-description');
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
        const box = DOM.options || document.getElementById('options');
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

    const box = DOM.options || document.getElementById('options');
    box.innerHTML = `
        <div class="narrative-result neutral">
            <p>📖 ${narr.prompt.length > 20 ? '生活继续着。' : '这一年就这样过去了。'}</p>
            ${renderChanges(changes)}
        </div>
        ${hint}
        <div class="expand-controls">
            <button class="expand-control-btn continue-expand-btn" id="first-expand-btn">📖 继续续写</button>
            <button class="expand-control-btn next-event-btn" id="first-next-btn">➡️ 下一件事</button>
        </div>`;

    // 第一次续写
    document.getElementById('first-expand-btn').addEventListener('click', async function() {
        this.disabled = true;
        this.textContent = '📖 续写中...';
        try {
            const expanded = await game.expandEvent(narr);
            if (expanded) {
                const expandDiv = document.createElement('div');
                expandDiv.className = 'expanded-content';
                expandDiv.innerHTML = `<p>${expanded}</p>`;
                
                // 创建续写控制按钮
                const expandControls = document.createElement('div');
                expandControls.className = 'expand-controls';
                expandControls.innerHTML = `
                    <button class="expand-control-btn continue-expand-btn">📖 继续续写</button>
                    <button class="expand-control-btn next-event-btn">➡️ 下一件事</button>
                `;
                expandDiv.appendChild(expandControls);
                
                // 插入到结果后面，替换原来的控制按钮
                const resultDiv = box.querySelector('.narrative-result');
                const firstControls = box.querySelector('.expand-controls');
                firstControls.replaceWith(expandDiv);
                
                // 绑定新的控制按钮
                bindExpandControls(expandDiv, narr);
            } else {
                this.textContent = '❌ 续写失败';
                setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
            }
        } catch (err) {
            console.error('续写错误:', err);
            this.textContent = '❌ 续写失败';
            setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
        }
    });
    
    // 第一次点击下一件事
    document.getElementById('first-next-btn').addEventListener('click', () => {
        if (remaining.length > 0 || allChoices.length > 0) {
            showEventSequence(remaining, allChoices[0] || null, allChoices.slice(1));
        } else {
            nextYear();
        }
    });
    
    // 递归绑定续写控制按钮的辅助函数
    function bindExpandControls(expandDiv, narr) {
        expandDiv.querySelector('.continue-expand-btn')?.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = '📖 续写中...';
            try {
                const moreExpanded = await game.expandEvent(narr);
                if (moreExpanded) {
                    const moreDiv = document.createElement('div');
                    moreDiv.className = 'expanded-content';
                    moreDiv.innerHTML = `<p>${moreExpanded}</p>`;
                    
                    const moreControls = document.createElement('div');
                    moreControls.className = 'expand-controls';
                    moreControls.innerHTML = `
                        <button class="expand-control-btn continue-expand-btn">📖 继续续写</button>
                        <button class="expand-control-btn next-event-btn">➡️ 下一件事</button>
                    `;
                    moreDiv.appendChild(moreControls);
                    
                    expandDiv.after(moreDiv);
                    expandDiv.querySelector('.expand-controls').remove();
                    
                    bindExpandControls(moreDiv, narr);
                } else {
                    this.textContent = '❌ 续写失败';
                    setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
                }
            } catch (err) {
                console.error('续写错误:', err);
                this.textContent = '❌ 续写失败';
                setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
            }
        });
        
        expandDiv.querySelector('.next-event-btn')?.addEventListener('click', () => {
            document.querySelectorAll('.expanded-content').forEach(el => el.remove());
            document.getElementById('continue-btn')?.click();
        });
    }

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
    (DOM.eventTitle || document.getElementById('event-title')).innerHTML = ageLabel + milestoneTag(event);
    const desc = DOM.eventDesc || document.getElementById('event-description');
    desc.textContent = event.prompt;
    desc.className = '';

    const box = DOM.options || document.getElementById('options');
    box.innerHTML = '';

    // 直接显示续写控制按钮
    const expandControls = document.createElement('div');
    expandControls.className = 'expand-controls';
    expandControls.innerHTML = `
        <button class="expand-control-btn continue-expand-btn">📖 继续续写</button>
        <button class="expand-control-btn next-event-btn">➡️ 下一件事</button>
    `;
    box.appendChild(expandControls);
    
    // 绑定续写控制按钮
    bindChoiceExpandControls(expandControls, event, box);
    
    // 选择事件的续写控制绑定函数
    function bindChoiceExpandControls(controlsDiv, event, parentBox) {
        controlsDiv.querySelector('.continue-expand-btn')?.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = '📖 续写中...';
            try {
                const moreExpanded = await game.expandEvent(event);
                if (moreExpanded) {
                    const moreDiv = document.createElement('div');
                    moreDiv.className = 'expanded-content';
                    moreDiv.innerHTML = `<p>${moreExpanded}</p>`;
                    
                    const moreControls = document.createElement('div');
                    moreControls.className = 'expand-controls';
                    moreControls.innerHTML = `
                        <button class="expand-control-btn continue-expand-btn">📖 继续续写</button>
                        <button class="expand-control-btn next-event-btn">➡️ 下一件事</button>
                    `;
                    moreDiv.appendChild(moreControls);
                    
                    controlsDiv.after(moreDiv);
                    controlsDiv.remove();
                    
                    bindChoiceExpandControls(moreControls, event, parentBox);
                } else {
                    this.textContent = '❌ 续写失败';
                    setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
                }
            } catch (err) {
                console.error('续写错误:', err);
                this.textContent = '❌ 续写失败';
                setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
            }
        });
        
        controlsDiv.querySelector('.next-event-btn')?.addEventListener('click', () => {
            document.querySelectorAll('.expanded-content').forEach(el => el.remove());
            document.querySelectorAll('.expand-controls').forEach(el => el.remove());
            // 清除所有展开内容和控制按钮
        });
    }

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

    (DOM.options || document.getElementById('options')).appendChild(panel);

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
    // 不再保存快照，删除回溯功能
    // game.saveSnapshot();

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
        <div class="expand-controls">
            <button class="expand-control-btn continue-expand-btn" id="choice-expand-btn">📖 继续续写</button>
            <button class="expand-control-btn next-event-btn" id="choice-next-btn">➡️ 下一件事</button>
        </div>`;

    // 绑定续写按钮
    document.getElementById('choice-expand-btn')?.addEventListener('click', async function() {
        this.disabled = true;
        this.textContent = '📖 续写中...';
        try {
            const expanded = await game.expandEvent(currentEvent);
            if (expanded) {
                const expandDiv = document.createElement('div');
                expandDiv.className = 'expanded-content';
                expandDiv.innerHTML = `<p>${expanded}</p>`;
                
                const expandControls = document.createElement('div');
                expandControls.className = 'expand-controls';
                expandControls.innerHTML = `
                    <button class="expand-control-btn continue-expand-btn">📖 继续续写</button>
                    <button class="expand-control-btn next-event-btn">➡️ 下一件事</button>
                `;
                expandDiv.appendChild(expandControls);
                
                const firstControls = narDiv.querySelector('.expand-controls');
                firstControls.replaceWith(expandDiv);
                
                bindChoiceResultExpandControls(expandDiv, currentEvent, narDiv);
            } else {
                this.textContent = '❌ 续写失败';
                setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
            }
        } catch (err) {
            console.error('续写错误:', err);
            this.textContent = '❌ 续写失败';
            setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
        }
    });
    
    // 递归绑定续写控制按钮的辅助函数
    function bindChoiceResultExpandControls(expandDiv, event, parentDiv) {
        expandDiv.querySelector('.continue-expand-btn')?.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = '📖 续写中...';
            try {
                const moreExpanded = await game.expandEvent(event);
                if (moreExpanded) {
                    const moreDiv = document.createElement('div');
                    moreDiv.className = 'expanded-content';
                    moreDiv.innerHTML = `<p>${moreExpanded}</p>`;
                    
                    const moreControls = document.createElement('div');
                    moreControls.className = 'expand-controls';
                    moreControls.innerHTML = `
                        <button class="expand-control-btn continue-expand-btn">📖 继续续写</button>
                        <button class="expand-control-btn next-event-btn">➡️ 下一件事</button>
                    `;
                    moreDiv.appendChild(moreControls);
                    
                    expandDiv.after(moreDiv);
                    expandDiv.querySelector('.expand-controls').remove();
                    
                    bindChoiceResultExpandControls(moreDiv, event, parentDiv);
                } else {
                    this.textContent = '❌ 续写失败';
                    setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
                }
            } catch (err) {
                console.error('续写错误:', err);
                this.textContent = '❌ 续写失败';
                setTimeout(() => { this.textContent = '📖 继续续写'; this.disabled = false; }, 2000);
            }
        });
        
        expandDiv.querySelector('.next-event-btn')?.addEventListener('click', () => {
            proceedToNext();
        });
    }
    
    // 下一件事按钮
    document.getElementById('choice-next-btn')?.addEventListener('click', () => {
        proceedToNext();
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
        const allControls = narDiv.querySelectorAll('.expand-controls');
        allControls.forEach(ctrl => ctrl.remove());
        const endBtn = document.createElement('button');
        endBtn.className = 'continue-btn';
        endBtn.textContent = '查看结局';
        endBtn.addEventListener('click', () => {
            narDiv.classList.remove('active');
            narDiv.innerHTML = '';
            showEnding();
        });
        narDiv.appendChild(endBtn);
        updateStatusBar();
        return;
    }
    
    function proceedToNext() {
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
    }
    
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

export const API_BASE =
    location.hostname === 'localhost' || location.hostname === '127.0.0.1'
        ? ''
        : 'https://life-simulator-api.onrender.com';

export class GameEngine {
    constructor() {
        this.playerName = '';
        this.playerGender = '男';
        this.playerPersonality = '';
        this.state = {
            age: 0,
            weirdness: 3,
            alive: true,
            deathReason: '',
            attributes: {
                intelligence: 5, health: 5, charisma: 5,
                willpower: 5, luck: 5, familyWealth: 5
            },
            hiddenAttributes: {
                mentalStability: 50, riskPreference: 50,
                empathy: 50, ambition: 50, traumaSensitivity: 50
            },
            derivedStats: { stress: 0, money: 20, socialSupport: 50 },
            difficulty: 2, // 1=简单 2=普通 3=困难 4=地狱
            rewindsLeft: 2, // 回溯次数
            traits: [],
            flags: [],
            history: [],
            milestones: [],
            profile: {
                education: '未入学',
                job: '无',
                relationships: []
                // relationship: { name, relation, affinity (0-100), status, importance (1-5) }
            },
            characters: {}
            // characters: { "小美": { name, age, gender, personality, job, appearance, relation, firstMet, importance } }
        };
        this.focusPhase = null; // { start, end } — 重点阶段
        this.contentMode = 'sfw'; // 'sfw' or 'nsfw'
        this.creativeMode = 'original'; // 'original' or 'fanfic'
        this.narrativeStyle = 'humorous'; // 'humorous', 'literary', 'realistic', 'dramatic'
        this.lifeFocus = 'balanced'; // 'balanced', 'career', 'relationship', 'family', 'adventure'
        this.scheduledEvents = []; // [{ age, text }] — 定时事件
        this.playerDirective = ''; // 金手指：玩家的下一轮指令
        this.backstory = ''; // 跳过阶段时生成的前史摘要
        this.fallbackEvents = [];
    }

    async loadFallbackEvents() {
        try {
            const r = await fetch('data/events.json');
            this.fallbackEvents = await r.json();
        } catch { this.fallbackEvents = []; }
    }

    // 快速跳过到指定年龄
    async skipToAge(targetAge) {
        try {
            const res = await fetch(`${API_BASE}/api/skip-years`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerName: this.playerName,
                    playerGender: this.playerGender,
                    playerPersonality: this.playerPersonality,
                    targetAge,
                    attributes: this.state.attributes
                })
            });
            if (!res.ok) throw new Error('skip API error');
            const data = await res.json();

            // 应用跳过的结果
            this.state.age = targetAge;
            if (data.effects) {
                if (data.effects.stress !== undefined) this.state.derivedStats.stress = data.effects.stress;
                if (data.effects.money !== undefined) this.state.derivedStats.money = data.effects.money;
                if (data.effects.socialSupport !== undefined) this.state.derivedStats.socialSupport = data.effects.socialSupport;
            }
            if (data.profile) {
                if (data.profile.education) this.state.profile.education = data.profile.education;
                if (data.profile.job) this.state.profile.job = data.profile.job;
            }
            if (data.relationships) {
                for (const r of data.relationships) {
                    this.state.profile.relationships.push({
                        name: r.name, relation: r.relation || '认识',
                        affinity: r.affinity || 50, status: r.status || '正常',
                        importance: r.importance || 3, lastSeen: targetAge
                    });
                }
            }
            if (data.characters) this.applyCharacterChanges(data.characters);
            // 特质系统已禁用
            // if (data.traits) {
            //     for (const t of data.traits) {
            //         if (!this.state.traits.includes(t)) this.state.traits.push(t);
            //     }
            // }
            if (data.milestones) {
                for (const m of data.milestones) {
                    if (!this.state.milestones.includes(m)) this.state.milestones.push(m);
                }
            }
            // 写入历史摘要
            if (data.summary) {
                for (const s of data.summary) {
                    const ageMatch = s.match(/^(\d+)岁[:：]/);
                    const age = ageMatch ? parseInt(ageMatch[1]) : 0;
                    const text = ageMatch ? s.replace(/^\d+岁[:：]\s*/, '') : s;
                    this.state.history.push({ age, event: text, choice: null, success: null, changes: {}, type: 'narrative', milestone: null });
                }
                // 存为永久前史，后续AI生成时始终携带
                this.backstory = data.summary.join('\n');
            }
            return data;
        } catch (err) {
            console.warn('跳过失败:', err);
            // 简单fallback：直接设置年龄
            this.state.age = targetAge;
            return null;
        }
    }

    initializeGame(name, gender, personality, attributes, weirdness, difficulty, contentMode, creativeMode, lifeFocus, kinks, narrativeStyle, backgroundSetting, customBackground) {
            this.playerName = name;
            this.playerGender = gender;
            this.playerPersonality = personality;
            this.playerKinks = kinks || '';
            this.state.attributes = { ...attributes };
            this.state.weirdness = weirdness;
            this.state.difficulty = difficulty || 2;
            this.contentMode = contentMode || 'sfw';
            this.creativeMode = creativeMode || 'original';
            this.narrativeStyle = narrativeStyle || 'humorous';
            this.lifeFocus = lifeFocus || 'balanced';
            this.backgroundSetting = backgroundSetting || 'modern';
            this.customBackground = customBackground || '';
            this.initializeHiddenAttributes();
            this.initializeDerivedFromAttributes();
        }


    initializeHiddenAttributes() {
        const a = this.state.attributes;
        const r = () => Math.random() * 20;
        this.state.hiddenAttributes.ambition = 30 + a.intelligence * 3 + r();
        this.state.hiddenAttributes.empathy = 30 + a.charisma * 3 + r();
        this.state.hiddenAttributes.mentalStability = 40 + a.willpower * 2 + r();
        this.state.hiddenAttributes.riskPreference = 20 + this.state.weirdness * 5 + r();
    }

    initializeDerivedFromAttributes() {
            this.state.derivedStats.money = this.state.attributes.familyWealth * 8;
            this.state.derivedStats.socialSupport = 50 + this.state.attributes.charisma * 2;
            // 情色相关数值（仅NSFW+模式使用）
            this.state.derivedStats.libido = 50; // 性欲
            this.state.derivedStats.experience = 0; // 经验值
            this.state.derivedStats.satisfaction = 50; // 满足度
        }


    async generateEvent(focusRound = 0) {
        // 【性能】AbortController 防止请求挂起（90s 超时）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000);
        try {
            const res = await fetch(`${API_BASE}/api/generate-event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    state: this.state,
                    playerName: this.playerName,
                    playerGender: this.playerGender,
                    playerPersonality: this.playerPersonality,
                    focusPhase: this.focusPhase,
                    contentMode: this.contentMode,
                    creativeMode: this.creativeMode,
                    narrativeStyle: this.narrativeStyle,
                    backgroundSetting: this.backgroundSetting,
                    customBackground: this.customBackground,
                    lifeFocus: this.lifeFocus,
                    focusRound,
                    scheduledEvents: this.scheduledEvents,
                    playerDirective: this.playerDirective,
                    backstory: this.backstory
                })
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error('API error');
            // 用完就清
            this.playerDirective = '';
            const data = await res.json();

            // 新格式：{ events: [...] }，兼容旧格式
            let events = data.events || [data];

            for (const event of events) {
                if (event.milestone && !this.state.milestones.includes(event.milestone)) {
                    this.state.milestones.push(event.milestone);
                }
                if (event.profileChanges) {
                    this.applyProfileChanges(event.profileChanges);
                }
                if (event.characters) {
                    this.applyCharacterChanges(event.characters);
                }
                if (event.death) {
                    this.state.alive = false;
                    this.state.deathReason = event.deathReason || '不明原因';
                }
            }

            return events;
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn('AI失败，用备用:', err);
            const fb = this.getFallbackEvent();
            return fb ? [fb] : null;
        }
    }

    // 展开生成：对当前事件进行详细展开
    async expandEvent(event) {
        // 【性能】AbortController 防止续写请求挂起（60s 超时）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        try {
            const res = await fetch(`${API_BASE}/api/expand-event`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    state: this.state,
                    event: { prompt: event.prompt, type: event.type },
                    playerName: this.playerName,
                    playerGender: this.playerGender,
                    playerPersonality: this.playerPersonality,
                    contentMode: this.contentMode,
                    creativeMode: this.creativeMode,
                    narrativeStyle: this.narrativeStyle,
                    backgroundSetting: this.backgroundSetting,
                    customBackground: this.customBackground
                })
            });
            clearTimeout(timeoutId);
            if (!res.ok) {
                console.error('expand API error:', res.status, await res.text());
                throw new Error('expand API error');
            }
            const data = await res.json();
            return data.text || null;
        } catch (err) {
            console.error('expandEvent失败:', err);
            return null;
        }
    }

    getFallbackEvent() {
        const available = this.fallbackEvents.filter(e =>
            this.state.age >= e.ageMin && this.state.age <= e.ageMax
        );
        if (!available.length) return null;
        const total = available.reduce((s, e) => s + e.baseWeight, 0);
        let r = Math.random() * total;
        for (const e of available) { r -= e.baseWeight; if (r <= 0) return e; }
        return available[0];
    }

    async generateNarrative(event, choice, success) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        try {
            const res = await fetch(`${API_BASE}/api/narrate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    state: this.state, event, choice, success,
                    playerName: this.playerName,
                    playerGender: this.playerGender,
                    playerPersonality: this.playerPersonality,
                    contentMode: this.contentMode,
                    creativeMode: this.creativeMode,
                    narrativeStyle: this.narrativeStyle,
                    backgroundSetting: this.backgroundSetting,
                    customBackground: this.customBackground
                })
            });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error();
            return (await res.json()).text;
        } catch { return success ? '事情进展顺利。' : '事情没按预期发展。'; }
    }

    async generateEndingSummary(endingTitle) {
        try {
            const res = await fetch(`${API_BASE}/api/generate-ending`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    state: this.state, endingTitle,
                    playerName: this.playerName,
                    playerGender: this.playerGender,
                    playerPersonality: this.playerPersonality,
                    contentMode: this.contentMode,
                    creativeMode: this.creativeMode,
                    narrativeStyle: this.narrativeStyle,
                    backgroundSetting: this.backgroundSetting,
                    customBackground: this.customBackground
                })
            });
            if (!res.ok) throw new Error();
            return (await res.json()).text;
        } catch { return '你走过了属于自己的人生道路。'; }
    }

    async generateObserverMode() {
        try {
            const res = await fetch(`${API_BASE}/api/observer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    state: this.state,
                    playerName: this.playerName,
                    playerGender: this.playerGender,
                    playerPersonality: this.playerPersonality,
                    contentMode: this.contentMode,
                    creativeMode: this.creativeMode,
                    narrativeStyle: this.narrativeStyle,
                    backgroundSetting: this.backgroundSetting,
                    customBackground: this.customBackground
                })
            });
            if (!res.ok) throw new Error();
            return (await res.json()).text;
        } catch { return '世界继续运转着，但总有人会记得你。'; }
    }

    calculateSuccess(option) {
        const a = this.state.attributes;
        const d = this.state.derivedStats;
        let rate = option.successRate || 0.5;
        // 智力：基础成功率加成
        rate += a.intelligence * 0.03;
        // 运气：随机波动加成
        rate += a.luck * 0.02;
        // 魅力：社交类事件隐性加成（通过socialSupport间接体现）
        rate += d.socialSupport * 0.001;
        // 意志：失败时有"再来一次"的隐性加成（降低失败惩罚感）
        // 健康：健康差时成功率下降
        if (a.health <= 2) rate -= 0.1;
        if (a.health >= 8) rate += 0.05;
        // 高压影响发挥
        if (d.stress >= 80) rate -= 0.1;
        if (d.stress >= 60) rate -= 0.05;
        return Math.random() < Math.max(0.05, Math.min(0.95, rate));
    }

    applyEffects(effects) {
        if (!effects) return {};
        const changes = {};
        for (const [key, rawValue] of Object.entries(effects)) {
            let value = rawValue;
            if (this.state.attributes[key] !== undefined) {
                value = Math.max(-2, Math.min(2, Math.round(value)));
                const old = this.state.attributes[key];
                // 下限0，上限不强制（允许超过10，支持无限模式）
                this.state.attributes[key] = Math.max(0, old + value);
                const actual = this.state.attributes[key] - old;
                if (actual !== 0) changes[key] = actual;
            } else if (this.state.derivedStats[key] !== undefined) {
                value = Math.max(-50, Math.min(50, Math.round(value)));
                const old = this.state.derivedStats[key];
                // money没有上限，stress和socialSupport保持0-100
                if (key === 'money') {
                    this.state.derivedStats[key] = Math.max(0, old + value);
                } else {
                    this.state.derivedStats[key] = Math.max(0, Math.min(100, old + value));
                }
                const actual = this.state.derivedStats[key] - old;
                if (actual !== 0) changes[key] = actual;
            }
        }
        return changes;
    }

    // 模糊匹配关系人名（处理"李奶奶"和"邻居李奶奶"重复问题）
    findRelationByName(name) {
        const rels = this.state.profile.relationships;
        // 精确匹配优先
        const exact = rels.find(e => e.name === name);
        if (exact) return exact;
        // 模糊匹配：一个名字包含另一个
        const fuzzy = rels.find(e => name.includes(e.name) || e.name.includes(name));
        return fuzzy || null;
    }

    // 处理档案变更（学历、职业、人际关系）
    applyProfileChanges(profileChanges) {
        if (!profileChanges) return;
        const p = this.state.profile;
        if (profileChanges.education) p.education = profileChanges.education;
        if (profileChanges.job) p.job = profileChanges.job;
        if (profileChanges.relationships) {
            for (const r of profileChanges.relationships) {
                if (!r.name) continue;
                const existing = this.findRelationByName(r.name);
                if (existing) {
                    // 统一用较短的名字（更干净）
                    if (r.name.length < existing.name.length) existing.name = r.name;
                    if (r.relation) existing.relation = r.relation;
                    if (r.affinity !== undefined) existing.affinity = Math.max(0, Math.min(100, r.affinity));
                    if (r.affinityChange !== undefined) existing.affinity = Math.max(0, Math.min(100, existing.affinity + r.affinityChange));
                    if (r.status) existing.status = r.status;
                    if (r.importance !== undefined) existing.importance = Math.max(1, Math.min(5, r.importance));
                    existing.lastSeen = this.state.age;
                } else {
                    p.relationships.push({
                        name: r.name,
                        relation: r.relation || '认识',
                        affinity: r.affinity !== undefined ? Math.max(0, Math.min(100, r.affinity)) : 50,
                        status: r.status || '正常',
                        importance: r.importance || 3,
                        lastSeen: this.state.age
                    });
                }
            }
        }
    }

    // 处理角色卡变更
    applyCharacterChanges(characters) {
        if (!characters || !Array.isArray(characters)) return;
        for (const c of characters) {
            if (!c.name) continue;
            const existing = this.state.characters[c.name];
            if (existing) {
                // 合并更新
                Object.assign(existing, c);
                existing.age = c.age ?? existing.age;
            } else {
                this.state.characters[c.name] = {
                    name: c.name,
                    age: c.age || '未知',
                    gender: c.gender || '未知',
                    personality: c.personality || '未知',
                    job: c.job || '未知',
                    appearance: c.appearance || '未知',
                    relation: c.relation || '认识',
                    firstMet: c.firstMet || `${this.state.age}岁`,
                    importance: c.importance || 3
                };
            }
        }
    }

    // 极端状态检测 — 返回危机事件或null
    // 设计：先给警告（不致死），连续高压才可能致死
    checkExtremeStates() {
        const { attributes: a, derivedStats: d, difficulty } = this.state;
        // 难度系数：简单0.2 普通0.6 困难1.0 地狱1.5
        const deathMul = [0, 0.2, 0.6, 1.0, 1.5][difficulty] || 0.6;

        // 健康归零 → 死亡（这个保留，合理）
        if (a.health <= 0) {
            this.state.alive = false;
            this.state.deathReason = '身体撑不住了';
            return { type: 'narrative', prompt: '身体终于亮起了红灯，再也没能站起来。', death: true, deathReason: '身体撑不住了' };
        }

        // 压力警告阶段（不致死，只是提示）
        if (d.stress >= 80 && d.stress < 95) {
            // 标记进入高压状态，但不杀人，让AI在下一轮事件中体现
            if (!this.state.flags.includes('高压警告')) {
                this.state.flags.push('高压警告');
                return { type: 'narrative', prompt: '最近总觉得喘不过气，夜里翻来覆去睡不着。', death: false,
                    effects: { stress: -5 } }; // 给一点缓冲
            }
            return null;
        }

        // 压力满 + 意志低 → 概率自杀（但降低概率，需要真的到极限）
        if (d.stress >= 98 && a.willpower <= 1) {
            if (Math.random() < 0.4 * deathMul) {
                this.state.alive = false;
                this.state.deathReason = '不堪重压，选择了离开';
                return { type: 'narrative', prompt: '压力终于压垮了最后一根稻草。在一个深夜，一切都安静了下来。', death: true, deathReason: '不堪重压，选择了离开' };
            }
            // 没死的话，自动减压一点，给喘息空间
            d.stress = 90;
            return { type: 'narrative', prompt: '在崩溃的边缘，不知道是什么拉住了自己。', death: false };
        }

        // 压力100 → 低概率死亡
        if (d.stress >= 100) {
            if (Math.random() < 0.2 * deathMul) {
                this.state.alive = false;
                this.state.deathReason = '精神崩溃';
                return { type: 'narrative', prompt: '长期的高压终于让一切崩塌了。', death: true, deathReason: '精神崩溃' };
            }
            // 强制减压，避免每年都触发
            d.stress = 85;
            if (!this.state.flags.includes('精神崩溃过')) this.state.flags.push('精神崩溃过');
            return { type: 'narrative', prompt: '精神状态亮了红灯，被迫停下来休息。', death: false };
        }

        // 如果压力降下来了，移除警告标记
        if (d.stress < 70 && this.state.flags.includes('高压警告')) {
            this.state.flags = this.state.flags.filter(f => f !== '高压警告');
        }

        // 金钱极度负面 + 社交归零 → 低概率死亡
        if (d.money <= 0 && d.socialSupport <= 5) {
            if (Math.random() < 0.15 * deathMul) {
                this.state.alive = false;
                this.state.deathReason = '身无分文，无人问津';
                return { type: 'narrative', prompt: '没有钱，没有朋友，世界对你关上了所有的门。', death: true, deathReason: '身无分文，无人问津' };
            }
        }
        return null;
    }

    makeChoice(event, optionIndex) {
        const option = event.options[optionIndex];
        const success = this.calculateSuccess(option);
        const effects = success ? option.effectsSuccess : option.effectsFail;
        const changes = this.applyEffects(effects);

        // 处理选项中的档案变更
        const profileChanges = success ? option.profileSuccess : option.profileFail;
        if (profileChanges) this.applyProfileChanges(profileChanges);
        // 也处理事件级别的档案变更
        if (event.profileChanges) this.applyProfileChanges(event.profileChanges);

        // 特质系统已禁用
        // if (option.addTraits) {
        //     for (const t of option.addTraits) {
        //         if (!this.state.traits.includes(t)) this.state.traits.push(t);
        //     }
        // }
        if (option.addFlags) {
            for (const f of option.addFlags) {
                if (!this.state.flags.includes(f)) this.state.flags.push(f);
            }
        }

        this.state.history.push({
            age: this.state.age, event: event.prompt,
            choice: option.text, success, changes, type: 'choice',
            milestone: event.milestone || null
        });

        return { success, option, changes };
    }

    recordNarrative(event, changes) {
        this.state.history.push({
            age: this.state.age, event: event.prompt,
            choice: null, success: null,
            changes: changes || {}, type: 'narrative',
            milestone: event.milestone || null
        });
    }

    advanceYear() {
        this.state.age++;
        const a = this.state.attributes;
        const d = this.state.derivedStats;

        // 意志力：高意志自动减压
        if (a.willpower >= 7) d.stress = Math.max(0, d.stress - 3);
        else if (a.willpower >= 4) d.stress = Math.max(0, d.stress - 1);

        // 被动恢复：极端高压时自然缓解
        if (d.stress >= 80) d.stress = Math.max(0, d.stress - 3);
        else if (d.stress >= 60) d.stress = Math.max(0, d.stress - 1);

        // 魅力：高魅力自然维持社交
        if (a.charisma >= 7 && d.socialSupport < 80) d.socialSupport = Math.min(100, d.socialSupport + 2);
        // 低魅力社交自然流失
        if (a.charisma <= 2 && d.socialSupport > 20) d.socialSupport = Math.max(0, d.socialSupport - 1);

        // 家境：每年有被动收入/支出
        if (a.familyWealth >= 8) d.money += 5;
        else if (a.familyWealth >= 5) d.money += 2;
        else if (a.familyWealth <= 1 && d.money > 0) d.money = Math.max(0, d.money - 1);

        // 健康：低健康增加压力
        if (a.health <= 2) d.stress = Math.min(100, d.stress + 3);

        // 老年衰退：50岁后健康自然下降
        if (this.state.age >= 60 && Math.random() < 0.3) {
            a.health = Math.max(0, a.health - 1);
        } else if (this.state.age >= 50 && Math.random() < 0.1) {
            a.health = Math.max(0, a.health - 1);
        }
    }

    calculateEnding() {
        const { attributes: a, derivedStats: d } = this.state;
        const score = a.intelligence * 10 + a.health * 10 + d.money + d.socialSupport + (100 - d.stress);
        if (!this.state.alive) return { title: this.state.deathReason, score };
        if (d.stress > 80) return { title: '心理崩溃', score };
        if (d.socialSupport < 10) return { title: '孤独终老', score };
        if (a.health <= 0) return { title: '英年早逝', score };
        if (score > 400) return { title: '成功人士', score };
        if (score > 300) return { title: '小有成就', score };
        if (score > 200) return { title: '平凡稳定', score };
        return { title: '艰难人生', score };
    }

    exportLife() { return JSON.stringify(this.state, null, 2); }

    // ===== 存档/读档 =====
    saveGame() {
        const saveData = {
            playerName: this.playerName,
            playerGender: this.playerGender,
            playerPersonality: this.playerPersonality,
            state: this.state,
            focusPhase: this.focusPhase,
            contentMode: this.contentMode,
            creativeMode: this.creativeMode,
            narrativeStyle: this.narrativeStyle,
            lifeFocus: this.lifeFocus,
            scheduledEvents: this.scheduledEvents,
            playerDirective: this.playerDirective,
            backstory: this.backstory,
            backgroundSetting: this.backgroundSetting,
            customBackground: this.customBackground
        };
        localStorage.setItem('life-sim-save', JSON.stringify(saveData));
        return true;
    }

    loadGame() {
        const raw = localStorage.getItem('life-sim-save');
        if (!raw) return false;
        try {
            const saveData = JSON.parse(raw);
            this.playerName = saveData.playerName;
            this.playerGender = saveData.playerGender;
            this.playerPersonality = saveData.playerPersonality;
            this.state = saveData.state;
            this.focusPhase = saveData.focusPhase || null;
            this.contentMode = saveData.contentMode || 'sfw';
            this.creativeMode = saveData.creativeMode || 'original';
            this.narrativeStyle = saveData.narrativeStyle || 'humorous';
            this.lifeFocus = saveData.lifeFocus || 'balanced';
            this.scheduledEvents = saveData.scheduledEvents || [];
            this.playerDirective = saveData.playerDirective || '';
            this.backstory = saveData.backstory || '';
            this.backgroundSetting = saveData.backgroundSetting || 'modern';
            this.customBackground = saveData.customBackground || '';
            return true;
        } catch { return false; }
    }

    hasSave() { return !!localStorage.getItem('life-sim-save'); }
    deleteSave() { localStorage.removeItem('life-sim-save'); }

    // ===== 回溯系统 =====
    saveSnapshot() {
        this._snapshot = JSON.parse(JSON.stringify({
            state: this.state
        }));
    }

    canRewind() { return this.state.rewindsLeft > 0 && this._snapshot; }

    rewind() {
        if (!this.canRewind()) return false;
        const snap = this._snapshot;
        // 恢复状态但保留回溯次数-1
        const rewindsLeft = this.state.rewindsLeft - 1;
        this.state = JSON.parse(JSON.stringify(snap.state));
        this.state.rewindsLeft = rewindsLeft;
        // 移除最后一条历史（就是刚才的选择）
        if (this.state.history.length) this.state.history.pop();
        this._snapshot = null;
        return true;
    }

    // ===== 特质系统 =====
    checkTraitAcquisition() {
        const a = this.state.attributes;
        const d = this.state.derivedStats;
        const t = this.state.traits;
        const h = this.state.history;
        const add = (trait) => { if (!t.includes(trait)) { t.push(trait); return trait; } return null; };

        const gained = [];

        // 基于属性的特质
        if (a.intelligence >= 9 && !t.includes('学霸')) gained.push(add('学霸'));
        if (a.charisma >= 9 && !t.includes('万人迷')) gained.push(add('万人迷'));
        if (a.willpower >= 9 && !t.includes('钢铁意志')) gained.push(add('钢铁意志'));
        if (a.luck >= 9 && !t.includes('天选之人')) gained.push(add('天选之人'));
        if (a.health <= 1 && !t.includes('病秧子')) gained.push(add('病秧子'));
        if (a.luck <= 1 && !t.includes('霉运缠身')) gained.push(add('霉运缠身'));

        // 基于经历的特质
        const failCount = h.filter(e => e.success === false).length;
        const successCount = h.filter(e => e.success === true).length;
        if (failCount >= 5 && successCount <= 1 && !t.includes('倒霉蛋')) gained.push(add('倒霉蛋'));
        if (successCount >= 8 && !t.includes('人生赢家')) gained.push(add('人生赢家'));
        if (failCount >= 3 && successCount >= 3 && !t.includes('大起大落')) gained.push(add('大起大落'));

        // 基于状态的特质
        if (d.stress >= 90 && !t.includes('高压锅')) gained.push(add('高压锅'));
        if (d.money >= 200 && !t.includes('暴发户')) gained.push(add('暴发户'));
        if (d.money <= 0 && this.state.age >= 18 && !t.includes('月光族')) gained.push(add('月光族'));
        if (d.socialSupport >= 90 && !t.includes('社交达人')) gained.push(add('社交达人'));
        if (d.socialSupport <= 10 && !t.includes('社恐')) gained.push(add('社恐'));

        // 基于标记的特质
        if (this.state.flags.includes('精神崩溃过') && !t.includes('浴火重生')) gained.push(add('浴火重生'));

        return gained.filter(Boolean);
    }

    // ===== 成就系统 =====
    checkAchievements() {
        if (!this._achievements) this._achievements = [];
        const a = this.state.attributes;
        const d = this.state.derivedStats;
        const age = this.state.age;
        const h = this.state.history;
        const unlocked = [];

        const check = (id, name, desc) => {
            if (this._achievements.includes(id)) return;
            this._achievements.push(id);
            unlocked.push({ id, name, desc });
        };

        if (age >= 18) check('adult', '成年了', '活到了18岁');
        if (age >= 30) check('thirty', '三十而立', '活到了30岁');
        if (age >= 50) check('fifty', '知天命', '活到了50岁');
        if (age >= 70) check('seventy', '古稀之年', '活到了70岁');
        if (d.money >= 100) check('rich', '小有积蓄', '金钱达到100');
        if (d.money >= 500) check('wealthy', '财务自由', '金钱达到500');
        if (a.intelligence >= 10) check('genius', '天才', '智力达到10');

        const exCount = this.state.profile.relationships.filter(r =>
            ['前任', '前男友', '前女友'].some(k => r.relation?.includes(k))
        ).length;
        if (exCount >= 3) check('heartbreaker', '渣王/渣后', '拥有3个以上前任');
        if (exCount >= 5) check('collector', '前任收集者', '拥有5个以上前任');

        const failStreak = h.slice(-3).every(e => e.success === false);
        if (failStreak && h.length >= 3) check('unlucky', '非酋', '连续3次失败');

        const successStreak = h.slice(-5).every(e => e.success === true);
        if (successStreak && h.length >= 5) check('lucky', '欧皇', '连续5次成功');

        if (d.money <= 0 && d.stress >= 90) check('rockbottom', '人生谷底', '破产且压力爆表');
        // 特质系统已禁用
        // if (this.state.traits.length >= 5) check('complex', '复杂人格', '获得5个以上特质');

        return unlocked;
    }
}

window.GameEngine = GameEngine;

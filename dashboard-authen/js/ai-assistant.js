/**
 * AI Copilot / Assistant Controller
 * For UTH NetLab Training Management Dashboard
 */
(function () {
    'use strict';

    // State
    const state = {
        isOpen: false,
        activeTab: 'diagnostic', // 'diagnostic' or 'chat'
        activeClass: 'all',
        diagnosticData: null,
        isLoading: false,
        chatHistory: []
    };

    // DOM Elements
    let fabBtn, backdrop, drawer, closeBtn;
    let classSelect, refreshBtn;
    let tabDiagBtn, tabChatBtn;
    let tabDiagContent, tabChatContent;
    let chatMessages, chatInput, chatSendBtn, promptChips;
    let fabBadge;

    function initElements() {
        fabBtn = document.getElementById('aiCopilotFab');
        backdrop = document.getElementById('aiDrawerBackdrop');
        drawer = document.getElementById('aiDrawer');
        closeBtn = document.getElementById('aiDrawerClose');
        classSelect = document.getElementById('aiClassSelect');
        refreshBtn = document.getElementById('aiRefreshBtn');
        tabDiagBtn = document.getElementById('aiTabDiagBtn');
        tabChatBtn = document.getElementById('aiTabChatBtn');
        tabDiagContent = document.getElementById('aiTabDiagContent');
        tabChatContent = document.getElementById('aiTabChatContent');
        chatMessages = document.getElementById('aiChatMessages');
        chatInput = document.getElementById('aiChatInput');
        chatSendBtn = document.getElementById('aiChatSendBtn');
        promptChips = document.getElementById('aiPromptChips');
        fabBadge = document.getElementById('aiFabBadge');
    }

    function initEvents() {
        if (fabBtn) {
            fabBtn.addEventListener('click', () => openDrawer());
        }
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeDrawer());
        }
        if (backdrop) {
            backdrop.addEventListener('click', () => closeDrawer());
        }

        // Tab Switching
        if (tabDiagBtn) {
            tabDiagBtn.addEventListener('click', () => switchTab('diagnostic'));
        }
        if (tabChatBtn) {
            tabChatBtn.addEventListener('click', () => switchTab('chat'));
        }

        // Class selector change
        if (classSelect) {
            classSelect.addEventListener('change', (e) => {
                state.activeClass = e.target.value;
                loadDiagnosticData();
            });
        }

        // Refresh button
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => loadDiagnosticData());
        }

        // Chat send event
        if (chatSendBtn && chatInput) {
            chatSendBtn.addEventListener('click', () => handleSendMessage());
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            });
        }

        // Suggested Chips Click Delegation
        if (promptChips) {
            promptChips.addEventListener('click', (e) => {
                const chip = e.target.closest('.ai-chip');
                if (chip) {
                    const text = chip.getAttribute('data-prompt') || chip.textContent.trim();
                    switchTab('chat');
                    sendMessage(text);
                }
            });
        }
    }

    function openDrawer() {
        state.isOpen = true;
        if (drawer) drawer.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        if (fabBadge) fabBadge.style.display = 'none';

        if (!state.diagnosticData) {
            loadDiagnosticData();
        }
    }

    function closeDrawer() {
        state.isOpen = false;
        if (drawer) drawer.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
    }

    function switchTab(tabName) {
        state.activeTab = tabName;
        if (tabDiagBtn && tabChatBtn && tabDiagContent && tabChatContent) {
            if (tabName === 'diagnostic') {
                tabDiagBtn.classList.add('active');
                tabChatBtn.classList.remove('active');
                tabDiagContent.classList.add('active');
                tabChatContent.classList.remove('active');
            } else {
                tabDiagBtn.classList.remove('active');
                tabChatBtn.classList.add('active');
                tabDiagContent.classList.remove('active');
                tabChatContent.classList.add('active');
                if (chatInput) chatInput.focus();
                scrollChatToBottom();
            }
        }
    }

    async function loadDiagnosticData() {
        if (!tabDiagContent) return;
        tabDiagContent.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 20px; color: #64748b; gap: 12px;">
                <div class="dashboard-loading-spinner" style="border-color: #cbd5e1; border-top-color: #6366f1; width: 32px; height: 32px;"></div>
                <span style="font-size: 0.85rem; font-weight: 500;">Đang phân tích dữ liệu thực hành & chấm điểm...</span>
            </div>
        `;

        try {
            const url = `/api/index.php/ai/diagnostic-report?class_id=${encodeURIComponent(state.activeClass)}`;
            const res = await fetch(url, { credentials: 'include' });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const json = await res.json();
            state.diagnosticData = json.data;
            renderDiagnosticView(state.diagnosticData);
            populateClassDropdown(state.diagnosticData.available_classes);
            updateFabBadge(state.diagnosticData);
        } catch (err) {
            console.error('Lỗi khi tải dữ liệu chẩn đoán AI:', err);
            tabDiagContent.innerHTML = `
                <div style="padding: 24px; text-align: center; color: #ef4444;">
                    <p style="font-weight: 600; margin-bottom: 8px;">Không thể tải báo cáo chẩn đoán AI</p>
                    <p style="font-size: 0.8rem; color: #64748b; margin-bottom: 16px;">${err.message}</p>
                    <button type="button" class="button secondary" onclick="window.AiCopilot.reload()">Thử lại</button>
                </div>
            `;
        }
    }

    function populateClassDropdown(classes) {
        if (!classSelect || !classes || classSelect.options.length > 1) return;
        classes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.class_id;
            opt.textContent = `${c.class_code} - ${c.class_name}`;
            classSelect.appendChild(opt);
        });
    }

    function updateFabBadge(data) {
        if (!fabBadge || !data || !data.summary) return;
        const urgentCount = data.summary.urgent_students_count || 0;
        if (urgentCount > 0 && !state.isOpen) {
            fabBadge.textContent = urgentCount > 9 ? '9+' : urgentCount;
            fabBadge.style.display = 'block';
        } else {
            fabBadge.style.display = 'none';
        }
    }

    function renderDiagnosticView(data) {
        if (!tabDiagContent) return;

        const summary = data.summary || {};
        const topLabs = data.top_failed_labs || [];
        const mistakes = data.common_mistakes || [];
        const students = data.struggling_students || [];
        const recs = data.recommendations || [];

        let html = `<div class="ai-diagnostic-view">`;

        // 1. KPI Cards
        html += `
            <div class="ai-kpi-grid">
                <div class="ai-kpi-card danger">
                    <span class="kpi-title">Bài lab trượt nhiều</span>
                    <span class="kpi-num">${topLabs.length > 0 ? topLabs[0].failed_count + ' lượt' : '0'}</span>
                    <small style="font-size:0.7rem; color:#991b1b;">${topLabs.length > 0 ? topLabs[0].lab_name : 'Không có'}</small>
                </div>
                <div class="ai-kpi-card warning">
                    <span class="kpi-title">Tiêu chí hay sai</span>
                    <span class="kpi-num">${summary.total_common_mistakes_tracked || 0}</span>
                    <small style="font-size:0.7rem; color:#854d0e;">Từ grading_details</small>
                </div>
                <div class="ai-kpi-card info">
                    <span class="kpi-title">Học viên cần hỗ trợ</span>
                    <span class="kpi-num">${summary.struggling_students_count || 0}</span>
                    <small style="font-size:0.7rem; color:#1e40af;">${summary.urgent_students_count || 0} bạn cần can thiệp gấp</small>
                </div>
                <div class="ai-kpi-card success">
                    <span class="kpi-title">Khuyến nghị sư phạm</span>
                    <span class="kpi-num">${recs.length}</span>
                    <small style="font-size:0.7rem; color:#166534;">Đề xuất cho giảng viên</small>
                </div>
            </div>
        `;

        // 2. Pedagogical Recommendations Section
        if (recs.length > 0) {
            html += `
                <div class="ai-diag-section">
                    <div class="ai-diag-section-header">
                        <h4 class="ai-diag-title">💡 Đề Xuất Sư Phạm Từ AI</h4>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
            `;
            recs.forEach(r => {
                html += `
                    <div class="ai-advice-card">
                        <div class="ai-advice-title">
                            <span>✨</span>
                            <span>${escapeHtml(r.title)}</span>
                        </div>
                        <p class="ai-advice-desc">${escapeHtml(r.description)}</p>
                    </div>
                `;
            });
            html += `</div></div>`;
        }

        // 3. Top Failed Labs Section
        html += `
            <div class="ai-diag-section">
                <div class="ai-diag-section-header">
                    <h4 class="ai-diag-title">⚠️ Top Bài Thực Hành Hay Làm Sai / Trượt</h4>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;
        if (topLabs.length === 0) {
            html += `<p style="font-size: 0.825rem; color: #64748b; margin: 0;">Chưa ghi nhận bài thi nào có số lượt trượt cao.</p>`;
        } else {
            topLabs.slice(0, 5).forEach((lab, idx) => {
                const riskClass = lab.risk_level === 'high' ? 'high-risk' : (lab.risk_level === 'medium' ? 'medium-risk' : 'low-risk');
                const tagClass = lab.risk_level === 'high' ? 'high' : (lab.risk_level === 'medium' ? 'medium' : 'low');
                const tagLabel = lab.risk_level === 'high' ? 'Nguy cơ cao' : (lab.risk_level === 'medium' ? 'Trung bình' : 'Ổn định');

                html += `
                    <div class="ai-lab-fail-card ${riskClass}">
                        <div class="ai-lab-fail-header">
                            <span class="ai-lab-fail-name">${idx + 1}. ${escapeHtml(lab.lab_name)}</span>
                            <span class="ai-risk-tag ${tagClass}">${tagLabel}</span>
                        </div>
                        <div style="font-size: 0.775rem; color: #475569;">Thiết bị: <strong>${escapeHtml(lab.device_name)}</strong></div>
                        <div class="ai-lab-fail-meta">
                            <span>Trượt: <strong>${lab.failed_count}/${lab.total_attempts}</strong> (${lab.fail_rate_percent}%)</span>
                            <span>Điểm TB: <strong>${lab.avg_score}</strong></span>
                            <span>Thời lượng: <strong>${lab.avg_duration_min}p</strong></span>
                        </div>
                    </div>
                `;
            });
        }
        html += `</div></div>`;

        // 4. Common Mistakes from grading_details
        html += `
            <div class="ai-diag-section">
                <div class="ai-diag-section-header">
                    <h4 class="ai-diag-title">🔍 Chi Tiết Lỗi Cấu Hình Phổ Biến</h4>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;
        if (mistakes.length === 0) {
            html += `<p style="font-size: 0.825rem; color: #64748b; margin: 0;">Chưa ghi nhận tiêu chí cấu hình sai sót nào trong các bài nộp.</p>`;
        } else {
            mistakes.slice(0, 5).forEach(m => {
                const unsavedClass = m.error_type === 'unsaved' ? 'unsaved' : '';
                html += `
                    <div class="ai-mistake-item">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="ai-mistake-badge ${unsavedClass}">${escapeHtml(m.category)}</span>
                            <span style="font-size: 0.75rem; font-weight: 600; color: #ef4444;">${m.fail_count} lần sai</span>
                        </div>
                        <div class="ai-mistake-rule">${escapeHtml(m.rule_name)} <small style="color: #64748b; font-weight: normal;">(${escapeHtml(m.lab_name)})</small></div>
                        ${m.reasons && m.reasons.length > 0 ? `
                            <div class="ai-mistake-reason">${escapeHtml(m.reasons[0])}</div>
                        ` : ''}
                    </div>
                `;
            });
        }
        html += `</div></div>`;

        // 5. Struggling Students List
        html += `
            <div class="ai-diag-section">
                <div class="ai-diag-section-header" style="display: flex; align-items: center; justify-content: space-between;">
                    <h4 class="ai-diag-title">👥 Học Viên Cần Quan Tâm / Đôn Đốc</h4>
                    ${students.length > 0 ? `
                        <button type="button" class="btn-ai-batch-remind" id="btn-batch-remind" style="font-size: 0.72rem; padding: 4px 10px; background: #4f46e5; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
                            <span>📧 Nhắc nhở danh sách</span>
                        </button>
                    ` : ''}
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
        `;
        if (students.length === 0) {
            html += `<p style="font-size: 0.825rem; color: #64748b; margin: 0;">Tất cả học viên đều duy trì tiến độ hoàn thành tốt.</p>`;
        } else {
            students.slice(0, 6).forEach(s => {
                const isUrgent = s.attention_level === 'urgent';
                const color = isUrgent ? '#e11d48' : '#d97706';
                const tag = isUrgent ? 'Cần can thiệp' : 'Chậm tiến độ';

                html += `
                    <div class="ai-student-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <div class="ai-student-info">
                            <span class="ai-student-name" style="font-weight: 600; font-size: 0.85rem; color: #1e293b;">${escapeHtml(s.student_name)}</span>
                            <span class="ai-student-class" style="font-size: 0.75rem; color: #64748b; display: block;">${escapeHtml(s.class_code)} • ${escapeHtml(s.email)}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div class="ai-student-progress-col" style="text-align: right;">
                                <span class="ai-student-pct" style="color: ${color}; font-weight: 700; font-size: 0.9rem;">${s.completion_percent}%</span>
                                <small style="font-size: 0.7rem; color: #64748b; display: block;">${s.passed_labs}/${s.total_assigned_labs} bài (${tag})</small>
                            </div>
                            <button type="button" class="btn-single-remind" data-email="${escapeHtml(s.email)}" data-name="${escapeHtml(s.student_name)}" title="Gửi email nhắc nhở qua Gmail SMTP" style="font-size: 0.72rem; padding: 5px 8px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 6px; cursor: pointer; font-weight: 600; white-space: nowrap;">
                                📧 Nhắc nhở
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        html += `</div></div>`;

        html += `</div>`; // Close .ai-diagnostic-view
        tabDiagContent.innerHTML = html;

        // Bind reminder events
        const batchBtn = tabDiagContent.querySelector('#btn-batch-remind');
        if (batchBtn) {
            batchBtn.addEventListener('click', () => handleSendBatchReminders(batchBtn));
        }
        tabDiagContent.querySelectorAll('.btn-single-remind').forEach(btn => {
            btn.addEventListener('click', () => {
                const email = btn.getAttribute('data-email');
                const name = btn.getAttribute('data-name');
                handleSendSingleReminder(btn, email, name);
            });
        });
    }

    async function handleSendSingleReminder(btn, email, name) {
        if (btn.disabled) return;
        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '⏳ Đang gửi...';

        try {
            const res = await fetch('/api/index.php/ai/send-reminders', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ student_email: email })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error?.message || `HTTP ${res.status}`);
            
            btn.innerHTML = '✓ Đã gửi mail';
            btn.style.background = '#ecfdf5';
            btn.style.color = '#059669';
            btn.style.borderColor = '#a7f3d0';
            if (typeof showToast === 'function') {
                showToast(`Đã gửi email đôn đốc thành công tới ${name} (${email})!`, 'success');
            } else {
                alert(`Đã gửi email đôn đốc thành công tới ${name} (${email})!`);
            }
        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
            if (typeof showToast === 'function') {
                showToast(`Không thể gửi email: ${err.message}`, 'error');
            } else {
                alert(`Không thể gửi email: ${err.message}`);
            }
        }
    }

    async function handleSendBatchReminders(btn) {
        if (btn.disabled) return;
        if (!confirm('Bạn có chắc chắn muốn gửi email đôn đốc tiến độ cho các học viên cần quan tâm trong danh sách này không?')) return;

        const originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '⏳ Đang gửi...';

        try {
            const res = await fetch('/api/index.php/ai/send-reminders', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ class_id: state.selectedClassId, target: 'struggling' })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error?.message || `HTTP ${res.status}`);
            const data = json.data || {};
            
            btn.innerHTML = `✓ Đã gửi (${data.sent_count})`;
            btn.style.background = '#059669';
            if (typeof showToast === 'function') {
                showToast(`Đã gửi email nhắc nhở thành công tới ${data.sent_count} học viên qua Gmail SMTP!`, 'success');
            } else {
                alert(`Đã gửi email nhắc nhở thành công tới ${data.sent_count} học viên qua Gmail SMTP!`);
            }
        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
            if (typeof showToast === 'function') {
                showToast(`Lỗi khi gửi email hàng loạt: ${err.message}`, 'error');
            } else {
                alert(`Lỗi khi gửi email hàng loạt: ${err.message}`);
            }
        }
    }

    // Chat handling
    async function handleSendMessage() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        await sendMessage(text);
    }

    async function sendMessage(text) {
        if (state.isLoading) return;
        state.isLoading = true;
        if (chatSendBtn) chatSendBtn.disabled = true;

        // Append User Message
        appendMessage('user', text);
        scrollChatToBottom();

        // Append Typing Indicator
        const typingId = appendTypingIndicator();
        scrollChatToBottom();

        try {
            const res = await fetch('/api/index.php/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    message: text,
                    class_id: state.activeClass
                })
            });

            removeTypingIndicator(typingId);

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.error?.message || `Lỗi phản hồi HTTP ${res.status}`);
            }

            const json = await res.json();
            const data = json.data || {};
            appendMessage('assistant', data.answer, data.model);
            updateSuggestedChips(data.suggested_questions);
        } catch (err) {
            removeTypingIndicator(typingId);
            appendMessage('assistant', `⚠️ **Đã xảy ra lỗi:** ${err.message}. Vui lòng thử lại sau giây lát.`);
        } finally {
            state.isLoading = false;
            if (chatSendBtn) chatSendBtn.disabled = false;
            scrollChatToBottom();
        }
    }

    function appendMessage(role, text, model = null) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-msg ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'ai-msg-avatar';
        avatar.innerHTML = role === 'user' ? '👤' : '🤖';

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        
        let badgeHtml = '';
        if (role === 'assistant' && model === 'gemini-1.5-flash') {
            badgeHtml = `<div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #e0e7ff; color: #4338ca; font-size: 0.68rem; font-weight: 700; margin-bottom: 8px;">
                <span>⚡ Powered by Google Gemini 1.5 Flash</span>
            </div>`;
        } else if (role === 'assistant' && model === 'local-rag') {
            badgeHtml = `<div style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; background: #f1f5f9; color: #475569; font-size: 0.68rem; font-weight: 600; margin-bottom: 8px;">
                <span>ℹ️ Local RAG Engine</span>
            </div>`;
        }

        bubble.innerHTML = role === 'user' ? escapeHtml(text).replace(/\n/g, '<br>') : (badgeHtml + formatMarkdown(text));

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
    }

    function appendTypingIndicator() {
        if (!chatMessages) return null;
        const id = 'typing_' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.className = 'ai-msg assistant';
        msgDiv.id = id;

        const avatar = document.createElement('div');
        avatar.className = 'ai-msg-avatar';
        avatar.innerHTML = '🤖';

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        bubble.innerHTML = `
            <div class="ai-typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        chatMessages.appendChild(msgDiv);
        return id;
    }

    function removeTypingIndicator(id) {
        if (!id) return;
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function updateSuggestedChips(suggestions) {
        if (!promptChips) return;
        if (!suggestions || suggestions.length === 0) return;
        promptChips.innerHTML = '';
        suggestions.forEach(q => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ai-chip';
            btn.setAttribute('data-prompt', q);
            btn.textContent = q;
            promptChips.appendChild(btn);
        });
    }

    function scrollChatToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Lightweight Markdown Formatter
    function formatMarkdown(text) {
        if (!text) return '';
        let escaped = escapeHtml(text);

        // Headers
        escaped = escaped.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        escaped = escaped.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

        // Bold & Italic
        escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Code blocks & inline code
        escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bullet lists
        escaped = escaped.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
        escaped = escaped.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Numbered lists
        escaped = escaped.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li>$2</li>');

        // Newlines
        escaped = escaped.replace(/\n\n/g, '</p><p>');
        escaped = escaped.replace(/\n/g, '<br>');

        return `<p>${escaped}</p>`;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Public API on window
    window.AiCopilot = {
        open: openDrawer,
        close: closeDrawer,
        reload: loadDiagnosticData,
        ask: (q) => {
            openDrawer();
            switchTab('chat');
            sendMessage(q);
        }
    };

    // Auto-init on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initElements();
            initEvents();
        });
    } else {
        initElements();
        initEvents();
    }
})();

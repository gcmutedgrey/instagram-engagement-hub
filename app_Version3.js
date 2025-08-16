// Instagram Engagement Hub JavaScript
// Main app file with all integrations

import { initNotifications, scheduleEngagementReminder } from './reminders.js';
import { getCustomTemplates, saveCustomTemplate, deleteCustomTemplate } from './customTemplates.js';
import { addTagToProfile, removeTagFromProfile } from './profileTags.js';
import { getEngagementStatsForProfile } from './analytics.js';

class EngagementHub {
    constructor() {
        this.profiles = this.loadData('profiles') || [];
        this.engagements = this.loadData('engagements') || [];
        this.currentWeek = new Date();

        this.commentTemplates = {
            street: [
                "The way you captured the light in this urban scene is incredible! The shadows add such depth 📸",
                "This candid moment tells such a powerful story. Street photography at its finest! 🔥",
                "Your eye for composition in chaotic urban environments is amazing. Love this capture! ✨",
                "The contrast between the subjects and the background is perfect. Great street work! 📷",
                "This has such strong documentary vibes. Really captures the essence of the city 🏙️"
            ],
            editorial: [
                "This composition is absolutely stunning! The styling and mood work perfectly together ✨",
                "The editorial vision here is so strong. Every element contributes to the story 📸",
                "Your use of color and texture creates such a compelling narrative. Beautiful work! 🎨",
                "The lighting setup here is perfection. Really elevates the entire concept 💡",
                "This has such high fashion energy. The model and styling are on point! 👑"
            ],
            commercial: [
                "Such clean execution! The attention to detail really shows your professionalism 🔥",
                "This product shot is incredibly polished. The lighting is spot-on! 📸",
                "Your commercial work always has such strong brand consistency. Well done! ✨",
                "The composition draws the eye exactly where it needs to go. Great commercial instinct! 💼",
                "This level of technical precision is why you're killing it in commercial work! 📷"
            ]
        };

        this.engagementTips = [
            "Engage within the first hour of posting for maximum visibility",
            "Ask genuine questions about their technique or creative process",
            "Share your own related experience when commenting",
            "Use 2-3 relevant emojis to add personality to your comments",
            "Engage with their stories and reels, not just feed posts",
            "Follow up on previous conversations in new comments",
            "Tag mutual photographer friends when relevant"
        ];

        this.bestTimes = {
            'Monday': '8-10 AM, 7-9 PM',
            'Tuesday': '9-11 AM, 6-8 PM',
            'Wednesday': '8-10 AM, 7-9 PM',
            'Thursday': '9-11 AM, 6-8 PM',
            'Friday': '7-9 AM, 5-7 PM',
            'Saturday': '10 AM-12 PM, 2-4 PM',
            'Sunday': '9-11 AM, 1-3 PM'
        };

        initNotifications(); // Reminders integration

        this.init();
    }

    init() {
        this.initEventListeners();
        this.initTheme();
        this.updateStats();
        this.renderProfiles();
        this.renderCalendar();
        this.loadTips();
        this.loadBestTimes();
        this.updateDashboard();
        this.renderCustomTemplates();
    }

    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav__tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Profile management
        const addProfileBtn = document.getElementById('addProfileBtn');
        const addProfileForm = document.getElementById('addProfileForm');
        const closeModal = document.getElementById('closeModal');
        const cancelAdd = document.getElementById('cancelAdd');

        addProfileBtn.addEventListener('click', () => this.showModal('addProfileModal'));
        addProfileForm.addEventListener('submit', (e) => this.addProfile(e));
        closeModal.addEventListener('click', () => this.hideModal('addProfileModal'));
        cancelAdd.addEventListener('click', () => this.hideModal('addProfileModal'));

        // Comment generator
        const generateBtn = document.getElementById('generateComment');
        const copyBtn = document.getElementById('copyComment');
        generateBtn.addEventListener('click', () => this.generateComment());
        copyBtn.addEventListener('click', () => this.copyComment());

        // Custom template controls
        const customTemplateForm = document.getElementById('customTemplateForm');
        customTemplateForm.addEventListener('submit', (e) => this.addCustomTemplate(e));
        document.getElementById('customTemplatesList').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-custom-template')) {
                const idx = parseInt(e.target.dataset.idx, 10);
                deleteCustomTemplate(idx);
                this.renderCustomTemplates();
            }
            if (e.target.classList.contains('use-custom-template')) {
                const idx = parseInt(e.target.dataset.idx, 10);
                const templates = getCustomTemplates();
                document.getElementById('commentText').textContent = templates[idx];
            }
        });

        // Engagement logging
        const logEngagementBtn = document.getElementById('logEngagementBtn');
        const logEngagementForm = document.getElementById('logEngagementForm');
        const closeLogModal = document.getElementById('closeLogModal');
        const cancelLog = document.getElementById('cancelLog');

        logEngagementBtn.addEventListener('click', () => {
            this.populateEngagementProfiles();
            this.showModal('logEngagementModal');
        });
        logEngagementForm.addEventListener('submit', (e) => this.logEngagement(e));
        closeLogModal.addEventListener('click', () => this.hideModal('logEngagementModal'));
        cancelLog.addEventListener('click', () => this.hideModal('logEngagementModal'));

        // Calendar navigation
        const prevWeek = document.getElementById('prevWeek');
        const nextWeek = document.getElementById('nextWeek');
        prevWeek.addEventListener('click', () => this.changeWeek(-1));
        nextWeek.addEventListener('click', () => this.changeWeek(1));

        // Tag controls
        document.getElementById('profilesGrid').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-tag-btn')) {
                const profileId = e.target.dataset.profileId;
                const tagInput = document.getElementById('tag-input-' + profileId);
                const tag = tagInput.value.trim();
                if (tag) {
                    addTagToProfile(profileId, tag);
                    tagInput.value = '';
                    this.profiles = this.loadData('profiles') || [];
                    this.renderProfiles();
                }
            }
            if (e.target.classList.contains('remove-tag-btn')) {
                const profileId = e.target.dataset.profileId;
                const tag = e.target.dataset.tag;
                removeTagFromProfile(profileId, tag);
                this.profiles = this.loadData('profiles') || [];
                this.renderProfiles();
            }
        });

        // Reminder scheduling
        document.getElementById('reminderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const message = document.getElementById('reminderMessage').value;
            const datetime = document.getElementById('reminderDatetime').value;
            scheduleEngagementReminder(message, datetime);
            alert('Reminder scheduled!');
        });

        // Modal overlay clicks
        document.querySelectorAll('.modal__overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.hideModal(modal.id);
            });
        });
    }

    // ...rest of class remains the same as original EXCEPT for renderProfiles and renderCustomTemplates

    renderProfiles() {
        const grid = document.getElementById('profilesGrid');
        
        if (this.profiles.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <span class="empty-state__emoji">📸</span>
                    <p>No profiles added yet. Click "Add Profile" to start tracking photographers!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.profiles.map(profile => `
            <div class="profile-card">
                <div class="profile-card__header">
                    <div class="profile-avatar">
                        ${profile.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="profile-card__username">@${profile.username}</div>
                        <div class="profile-card__niche">${this.getNicheLabel(profile.niche)}</div>
                    </div>
                </div>
                <div class="profile-card__stats">
                    <div class="profile-stat">
                        <div class="profile-stat__number">${profile.totalEngagements}</div>
                        <div class="profile-stat__label">Engagements</div>
                    </div>
                    <div class="profile-stat">
                        <div class="profile-stat__number">${this.getDaysSince(profile.lastEngagement)}</div>
                        <div class="profile-stat__label">Days ago</div>
                    </div>
                </div>
                <div>
                    <input type="text" placeholder="Add tag" id="tag-input-${profile.id}" class="form-control tag-input" style="width:100px;display:inline-block;">
                    <button class="btn btn--outline btn--sm add-tag-btn" data-profile-id="${profile.id}">Add Tag</button>
                </div>
                <div class="tags-list">
                    ${(profile.tags || []).map(tag => `
                        <span class="tag-badge">
                            ${tag} <button class="remove-tag-btn" data-profile-id="${profile.id}" data-tag="${tag}" style="border:none;background:none;color:red;cursor:pointer;">×</button>
                        </span>
                    `).join('')}
                </div>
                <div class="priority-badge priority-badge--${profile.priority}">
                    ${profile.priority.toUpperCase()} PRIORITY
                </div>
                <div class="profile-card__actions">
                    <button class="btn btn--outline btn--sm" onclick="app.removeProfile('${profile.id}')">Remove</button>
                </div>
                <div class="profile-card__analytics">
                    <details>
                        <summary>Weekly Engagement Trend</summary>
                        <div class="analytics-chart" id="analytics-${profile.id}">
                            ${this.renderProfileAnalytics(profile.id)}
                        </div>
                    </details>
                </div>
            </div>
        `).join('');
    }

    renderProfileAnalytics(profileId) {
        const stats = getEngagementStatsForProfile(profileId);
        const weeks = Object.keys(stats).sort();
        if (!weeks.length) return '<div>No data yet.</div>';
        return `
            <table>
                <tr><th>Week</th><th># Engagements</th></tr>
                ${weeks.map(week => `<tr><td>${week}</td><td>${stats[week]}</td></tr>`).join('')}
            </table>
        `;
    }

    renderCustomTemplates() {
        const list = document.getElementById('customTemplatesList');
        const templates = getCustomTemplates();
        if (!list) return;
        if (templates.length === 0) {
            list.innerHTML = '<li>No custom templates yet.</li>';
            return;
        }
        list.innerHTML = templates.map((t, idx) =>
            `<li>
                <span>${t}</span>
                <button class="btn btn--sm use-custom-template" data-idx="${idx}">Use</button>
                <button class="btn btn--sm delete-custom-template" data-idx="${idx}" style="color:red;">Delete</button>
            </li>`
        ).join('');
    }

    addCustomTemplate(event) {
        event.preventDefault();
        const template = document.getElementById('customTemplateInput').value.trim();
        if (template) {
            saveCustomTemplate(template);
            document.getElementById('customTemplateInput').value = '';
            this.renderCustomTemplates();
        }
    }

    // ...rest of EngagementHub methods as in your original app.js
    // (initTheme, toggleTheme, updateThemeButton, switchTab, showModal, hideModal, addProfile, removeProfile, getNicheLabel, getDaysSince, updateStats, generateComment, copyComment, loadTips, loadBestTimes, populateEngagementProfiles, logEngagement, updateDashboard, renderRecentActivity, getEngagementIcon, getEngagementTypeLabel, formatRelativeTime, renderCalendar, getWeekStart, changeWeek, saveData, loadData)
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EngagementHub();
});
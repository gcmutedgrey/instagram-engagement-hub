// Custom Comment Templates Module

const STORAGE_KEY = "engagement_hub_custom_templates";

export function getCustomTemplates() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveCustomTemplate(template) {
    const templates = getCustomTemplates();
    templates.push(template);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function deleteCustomTemplate(index) {
    const templates = getCustomTemplates();
    templates.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
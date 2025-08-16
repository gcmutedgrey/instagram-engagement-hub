// Reminders & Notifications Module

export function initNotifications() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

export function scheduleEngagementReminder(message, time) {
    const now = new Date();
    const target = new Date(time);
    const delay = target - now;
    if (delay <= 0) return; // time in past

    setTimeout(() => {
        if (Notification.permission === "granted") {
            new Notification("Engagement Reminder", { body: message });
        }
    }, delay);
}
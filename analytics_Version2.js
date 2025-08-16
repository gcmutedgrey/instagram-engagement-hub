// Analytics Module

export function getEngagementStatsForProfile(profileId) {
    const engagements = JSON.parse(localStorage.getItem('engagement_hub_engagements')) || [];
    const profileEngagements = engagements.filter(e => e.profileId === profileId);

    // Group by week
    const stats = {};
    profileEngagements.forEach(e => {
        const d = new Date(e.date);
        const year = d.getFullYear();
        const week = getWeekNumber(d);
        const key = `${year}-W${week}`;
        stats[key] = (stats[key] || 0) + 1;
    });
    return stats;
}

function getWeekNumber(date) {
    // Get week number for a date
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}
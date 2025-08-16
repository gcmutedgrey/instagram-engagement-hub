// Profile Tagging Features

export function addTagToProfile(profileId, tag) {
    const profiles = JSON.parse(localStorage.getItem('engagement_hub_profiles')) || [];
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    if (!profile.tags) profile.tags = [];
    if (!profile.tags.includes(tag)) profile.tags.push(tag);
    localStorage.setItem('engagement_hub_profiles', JSON.stringify(profiles));
}

export function removeTagFromProfile(profileId, tag) {
    const profiles = JSON.parse(localStorage.getItem('engagement_hub_profiles')) || [];
    const profile = profiles.find(p => p.id === profileId);
    if (!profile || !profile.tags) return;
    profile.tags = profile.tags.filter(t => t !== tag);
    localStorage.setItem('engagement_hub_profiles', JSON.stringify(profiles));
}
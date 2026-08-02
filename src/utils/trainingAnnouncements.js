const ANNOUNCEMENTS_STORAGE_KEY = 'icar_training_announcements_v1';

const defaultAnnouncements = [
    {
        id: '1',
        title: 'Training Programme Session Day 2 Active',
        description: 'Live practical modules and institute presentations are currently underway for KVK coordinators.',
        status: 'live', // 'live' or 'completed'
        date: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Certificate Verification Window Open',
        description: 'All participant certificates generated are dynamically verifiable via encoded QR code scanner.',
        status: 'completed',
        date: new Date(Date.now() - 86400000).toISOString()
    }
];

export const getAnnouncements = () => {
    try {
        const stored = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Error reading announcements:", e);
    }
    return defaultAnnouncements;
};

export const saveAnnouncements = (announcements) => {
    try {
        localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
        return true;
    } catch (e) {
        console.error("Error saving announcements:", e);
        return false;
    }
};

export const addAnnouncement = (newAnnouncement) => {
    const list = getAnnouncements();
    const item = {
        id: Date.now().toString(),
        title: newAnnouncement.title.trim(),
        description: newAnnouncement.description.trim(),
        status: newAnnouncement.status || 'live',
        date: new Date().toISOString()
    };
    const updated = [item, ...list];
    saveAnnouncements(updated);
    return updated;
};

export const updateAnnouncement = (id, updatedFields) => {
    const list = getAnnouncements();
    const updated = list.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    saveAnnouncements(updated);
    return updated;
};

export const deleteAnnouncement = (id) => {
    const list = getAnnouncements();
    const updated = list.filter(item => item.id !== id);
    saveAnnouncements(updated);
    return updated;
};

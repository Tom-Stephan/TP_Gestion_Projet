import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
    const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);

    const login = async (email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();
            currentUser.value = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        currentUser.value = null;
        localStorage.removeItem('user');
    };

    const saveUserData = async () => {
        if (!currentUser.value) return;

        try {
            const response = await fetch(`http://localhost:5000/api/users/${currentUser.value._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wallet_points: currentUser.value.wallet_points,
                    inventory_cards: currentUser.value.inventory_cards,
                    xp: currentUser.value.xp,
                    level: currentUser.value.level,
                    history: currentUser.value.history
                }),
            });

            if (!response.ok) {
                console.error('Failed to save progress');
            } else {
                console.log('Progress saved via API');
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    };

    const getXpRequired = (level) => {
        return 100 * level; // Level 1->2: 100, Level 2->3: 200, etc.
    };

    const addXp = (amount) => {
        if (!currentUser.value) return;

        currentUser.value.xp = (currentUser.value.xp || 0) + amount;

        let required = getXpRequired(currentUser.value.level || 1);

        // Level Up Logic
        while (currentUser.value.xp >= required) {
            currentUser.value.xp -= required;
            currentUser.value.level = (currentUser.value.level || 1) + 1;

            // Recalculate for next level if multiple level ups happen
            required = getXpRequired(currentUser.value.level);
        }
    };

    const addWalletPoints = (amount) => {
        if (!currentUser.value) return;
        currentUser.value.wallet_points = (currentUser.value.wallet_points || 0) + amount;
    };

    const addHistoryItem = (action, gain) => {
        if (!currentUser.value) return;

        if (!currentUser.value.history) {
            currentUser.value.history = [];
        }

        const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

        currentUser.value.history.unshift({
            action,
            date,
            gain,
            id: Date.now()
        });

        // Keep only last 20 items
        if (currentUser.value.history.length > 20) {
            currentUser.value.history.pop();
        }
    };

    return {
        currentUser,
        login,
        logout,
        saveUserData,
        addXp,
        addWalletPoints,
        addHistoryItem,
        getXpRequired
    };
});

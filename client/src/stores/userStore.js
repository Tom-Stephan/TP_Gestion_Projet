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

        if (currentUser.value.history.length > 20) {
            currentUser.value.history.pop();
        }
    };

    const register = async (pseudo, email, password) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pseudo, email, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const userData = await response.json();
            currentUser.value = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Register error:', error);
            return false;
        }
    };

    const joinClan = async (clanId) => {
        if (!currentUser.value) return;
        try {
            const response = await fetch('http://localhost:5000/api/users/clan/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.value._id, clanId })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                currentUser.value = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return true;
            }
        } catch (error) {
            console.error('Join clan error:', error);
        }
        return false;
    };

    const leaveClan = async () => {
        if (!currentUser.value) return;
        try {
            const response = await fetch('http://localhost:5000/api/users/clan/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.value._id })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                currentUser.value = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return true;
            }
        } catch (error) {
            console.error('Leave clan error:', error);
        }
        return false;
    };

    return {
        currentUser,
        login,
        register,
        logout,
        saveUserData,
        addXp,
        addWalletPoints,
        addHistoryItem,
        getXpRequired,
        joinClan,
        leaveClan
    };
});

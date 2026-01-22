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
                    inventory_cards: currentUser.value.inventory_cards
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

    return {
        currentUser,
        login,
        logout,
        saveUserData
    };
});

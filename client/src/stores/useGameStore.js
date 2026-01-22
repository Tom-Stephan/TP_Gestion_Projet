import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGameStore = defineStore('game', () => {
    // State
    const isQuizOpen = ref(false);
    const bonusMultiplier = ref(1);
    const bonusEndTime = ref(null);
    const now = ref(Date.now());

    // Update 'now' periodically for reactivity in getters
    setInterval(() => {
        now.value = Date.now();
    }, 1000);

    // Actions
    function openQuiz() {
        isQuizOpen.value = true;
    }

    function closeQuiz() {
        isQuizOpen.value = false;
    }

    function activateBonus(durationMinutes) {
        bonusMultiplier.value = 2;
        bonusEndTime.value = Date.now() + (durationMinutes * 60 * 1000);
    }

    // Getters
    const isBonusActive = computed(() => {
        return bonusEndTime.value && now.value < bonusEndTime.value;
    });

    const remainingBonusTime = computed(() => {
        if (!isBonusActive.value) return "00:00";
        const diff = Math.max(0, bonusEndTime.value - now.value);
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    return {
        isQuizOpen,
        bonusMultiplier,
        bonusEndTime,
        openQuiz,
        closeQuiz,
        activateBonus,
        isBonusActive,
        remainingBonusTime
    };
});

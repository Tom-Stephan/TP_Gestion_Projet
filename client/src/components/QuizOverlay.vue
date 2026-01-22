<script setup>
import { ref } from 'vue';
import { useGameStore } from '../stores/useGameStore';

const gameStore = useGameStore();

// Questions Mock
const questions = [
    {
        text: "Combien de temps met un mégot pour disparaître ?",
        options: [
            { text: "1 mois", correct: false },
            { text: "1 à 2 ans", correct: false },
            { text: "12 ans", correct: true },
        ]
    },
    {
        text: "Quel déchet est le plus retrouvé sur les plages ?",
        options: [
            { text: "Les bouteilles plastique", correct: false },
            { text: "Les mégots de cigarettes", correct: true },
            { text: "Les filets de pêche", correct: false },
        ]
    },
    {
        text: "Le verre est recyclable...",
        options: [
            { text: "10 fois", correct: false },
            { text: "100 fois", correct: false },
            { text: "À l'infini", correct: true },
        ]
    }
];

const currentQuestionIndex = ref(0);
const isGameOver = ref(false);
const isVictory = ref(false);
const selectedAnswer = ref(null);
const resultMessage = ref("");

const handleAnswer = (option) => {
    selectedAnswer.value = option;
    
    setTimeout(() => {
        if (option.correct) {
            // Correct Answer
            if (currentQuestionIndex.value < questions.length - 1) {
                // Next Question
                selectedAnswer.value = null; // Reset selection
                currentQuestionIndex.value++;
            } else {
                // Win
                isVictory.value = true;
                gameStore.activateBonus(15);
                setTimeout(() => {
                    closeAndToast();
                }, 3000);
            }
        } else {
            // Wrong Answer
            isGameOver.value = true;
        }
    }, 1000); // Suspense delay
};

const closeAndToast = () => {
    gameStore.closeQuiz();
    // Reset state for next time
    setTimeout(() => {
        currentQuestionIndex.value = 0;
        isGameOver.value = false;
        isVictory.value = false;
        selectedAnswer.value = null;
    }, 500);
    alert("BOOST X2 ACTIVÉ 🚀");
};

const retry = () => {
    gameStore.closeQuiz();
    setTimeout(() => {
        currentQuestionIndex.value = 0;
        isGameOver.value = false;
        isVictory.value = false;
        selectedAnswer.value = null;
    }, 500);
};

</script>

<template>
  <div v-if="gameStore.isQuizOpen" class="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
    
    <!-- Arcade Background Elements -->
    <div class="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-scanline"></div>

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-md">
        
        <!-- Header -->
        <div class="text-center mb-10">
            <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-pulse tracking-widest uppercase">
                Arcade Mode
            </h2>
            <div class="text-xs font-mono text-cyan-300 mt-2">QUESTION {{ currentQuestionIndex + 1 }} / {{ questions.length }}</div>
        </div>

        <!-- Question Card -->
        <Transition name="fade" mode="out-in">
            <div v-if="!isGameOver && !isVictory" :key="currentQuestionIndex" class="bg-gray-900/80 border-2 border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-md">
                <p class="text-xl font-bold text-center mb-8 leading-relaxed">
                    {{ questions[currentQuestionIndex].text }}
                </p>

                <div class="space-y-4">
                    <button 
                        v-for="(option, idx) in questions[currentQuestionIndex].options" 
                        :key="idx"
                        @click="handleAnswer(option)"
                        :disabled="selectedAnswer"
                        class="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 border-2 relative overflow-hidden group"
                        :class="[
                            selectedAnswer === option 
                                ? (option.correct ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400')
                                : 'bg-gray-800 border-gray-700 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                        ]"
                    >
                        <span class="relative z-10">{{ option.text }}</span>
                        <!-- Hover glow -->
                        <div v-if="!selectedAnswer" class="absolute inset-0 bg-cyan-400/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                </div>
            </div>

            <!-- Game Over View -->
            <div v-else-if="isGameOver" class="text-center animate-shake">
                <h1 class="text-6xl font-black text-red-600 mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">GAME OVER</h1>
                <p class="text-gray-400 mb-8 max-w-xs mx-auto">Mauvaise réponse... Révisez vos classiques écologiques et réessayez !</p>
                <button @click="retry" class="px-8 py-3 bg-white text-black font-black uppercase rounded-full hover:scale-105 transition">Quitter</button>
            </div>

            <!-- Victory View -->
            <div v-else-if="isVictory" class="text-center">
                <div class="text-6xl mb-4 animate-bounce">🏆</div>
                <h1 class="text-4xl font-black text-yellow-400 mb-2 uppercase">Succès !</h1>
                <p class="text-cyan-300 font-mono text-xl animate-pulse">BONUS ACTIVÉ</p>
            </div>
        </Transition>

    </div>
  </div>
</template>

<style scoped>
.animate-scanline {
    animation: scanline 3s linear infinite;
}
@keyframes scanline {
    0% { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.animate-shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
</style>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  availableCards: {
    type: Array,
    required: true,
    // Expected format: [{ name: "Crabe Vert", rarity: "Commune" }, ...]
  }
});

const isOpening = ref(false);
const showResult = ref(false);
const revealedCard = ref(null);

const lootBoxSound = new Audio('/sounds/open.mp3'); // Optional sound

const drawCard = () => {
    // 1. Filtrer les cartes par rareté
    const commonCards = props.availableCards.filter(c => c.rarity === 'Commune');
    const rareCards = props.availableCards.filter(c => c.rarity === 'Rare');
    const legendaryCards = props.availableCards.filter(c => c.rarity === 'Légendaire');

    // 2. Tirer un nombre aléatoire (0 à 1)
    const roll = Math.random();

    // 3. Logique de Probabilité (70% / 25% / 5%)
    let pool;
    if (roll < 0.70) {
        pool = commonCards;
    } else if (roll < 0.95) {
        pool = rareCards;
    } else {
        pool = legendaryCards;
    }

    // 4. Si le pool est vide (sécurité), on fallback sur Commune
    if (pool.length === 0) pool = props.availableCards;

    // 5. Tirer une carte au hasard dans le pool
    return pool[Math.floor(Math.random() * pool.length)];
};

const openBox = () => {
  if (isOpening.value) return;
  
  isOpening.value = true;
  showResult.value = false;
  
  // Animation duration
  setTimeout(() => {
    revealedCard.value = drawCard();
    isOpening.value = false;
    showResult.value = true;
  }, 2000); // 2 seconds spin/shake
};

const getRarityColor = (rarity) => {
    switch(rarity) {
        case 'Légendaire': return 'text-yellow-500 border-yellow-500 bg-yellow-50';
        case 'Rare': return 'text-purple-500 border-purple-500 bg-purple-50';
        default: return 'text-gray-500 border-gray-500 bg-gray-50';
    }
};
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8">
    
    <!-- The Box -->
    <div 
        class="relative cursor-pointer transition-transform duration-100"
        :class="{ 'animate-shake': isOpening }"
        @click="openBox"
    >
        <div v-show="!showResult" class="text-9xl filter drop-shadow-xl hover:scale-110 transition-transform">
            🎁
        </div>
    </div>

    <!-- The Result (Flash) -->
    <transition name="flash">
        <div v-if="showResult" class="mt-8 text-center animate-pop-in">
            <div 
                class="border-4 rounded-xl p-8 shadow-2xl transform rotate-3 transition-all hover:rotate-0"
                :class="getRarityColor(revealedCard.rarity)"
            >
                <div class="text-sm uppercase font-bold tracking-widest mb-2 opacity-70">
                    {{ revealedCard.rarity }}
                </div>
                <h3 class="text-3xl font-black mb-4">{{ revealedCard.name }}</h3>
                <div class="text-6xl my-4">🃏</div>
            </div>
            
            <button 
                @click="showResult = false" 
                class="mt-6 px-6 py-2 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition"
            >
                Relancer
            </button>
        </div>
    </transition>

    <div v-if="isOpening" class="mt-8 text-xl font-bold text-blue-600 animate-pulse">
        Ouverture en cours...
    </div>

  </div>
</template>

<style>
/* 1. Shake Animation */
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.animate-shake {
  animation: shake 0.5s infinite;
}

/* 2. Pop In Result */
@keyframes pop-in {
    0% { transform: scale(0) rotate(-45deg); opacity: 0; }
    80% { transform: scale(1.1) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); }
}

.animate-pop-in {
    animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* 3. Flash Transition */
.flash-enter-active {
  animation: flash-burst 0.5s;
}

@keyframes flash-burst {
    0% { filter: brightness(1); }
    50% { filter: brightness(3) blur(2px); }
    100% { filter: brightness(1); }
}
</style>

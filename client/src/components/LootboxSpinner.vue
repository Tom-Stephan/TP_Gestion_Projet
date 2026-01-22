<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  availableCards: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'win']);

// --- CONFIGURATION ---
const ITEM_WIDTH = 140; // Largeur d'une carte (doit matcher le CSS w-[140px])
const GAP = 16;         // Marge horizontale (mx-[8px] * 2)
const TOTAL_ITEMS = 80; // Nombre total de cartes dans le ruban
const WINNER_INDEX = 60; // Index fixe où le ruban s'arrêtera (vers la fin pour le suspense)

// --- STATE ---
const containerRef = ref(null); // Référence pour mesurer la largeur réelle
const isSpinning = ref(false);
const hasWon = ref(false);
const items = ref([]); 
const winnerItem = ref(null);
const translateX = ref(0);

// Génération du ruban de cartes
const generateItems = () => {
  const generated = [];
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const randomCard = props.availableCards[Math.floor(Math.random() * props.availableCards.length)];
    generated.push({
      ...randomCard,
      id: `item-${i}-${Date.now()}`, 
      uniqueIndex: i // Pour identifier la carte gagnante visuellement
    });
  }
  return generated;
};

const startSpin = async () => {
    if (isSpinning.value) return;
    
    // 1. Préparer les données
    items.value = generateItems();
    winnerItem.value = items.value[WINNER_INDEX];
    
    // Reset
    isSpinning.value = true;
    hasWon.value = false;
    translateX.value = 0;

    // Attendre que le DOM affiche les éléments pour avoir la vraie largeur
    await nextTick();

    // 2. LE CALCUL MAGIQUE DU CENTRAGE
    if (containerRef.value) {
        // Largeur visible de la fenêtre du spinner
        const containerWidth = containerRef.value.offsetWidth;

        // Position du bord gauche de la carte gagnante
        // (Index * (LargeurCarte + EspaceTotal))
        const distanceToCard = WINNER_INDEX * (ITEM_WIDTH + GAP);

        // Décalage pour centrer la carte : (Moitié Conteneur) - (Moitié Carte)
        const centerOffset = (containerWidth / 2) - (ITEM_WIDTH / 2);

        // Position finale (Négatif car on déplace vers la gauche)
        // J'ai ajouté un tout petit 'jitter' (+/- 5px) pour le réalisme, mais elle reste au centre
        const jitter = (Math.random() * 10) - 5; 
        
        // On lance l'animation après un micro-délai pour que le navigateur enregistre le translate 0
        setTimeout(() => {
            translateX.value = -(distanceToCard - centerOffset + jitter);
        }, 50);
    }

    // 3. Fin de l'animation (Sychro avec le CSS duration-6000)
    setTimeout(() => {
        hasWon.value = true;
        emit('win', winnerItem.value);
    }, 6050); 
};

const getRarityClass = (rarity) => {
    switch(rarity) {
        case 'Légendaire': return 'border-yellow-500 bg-yellow-50 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
        case 'Rare': return 'border-purple-500 bg-purple-50 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
        default: return 'border-gray-300 bg-white';
    }
};

defineExpose({ startSpin });
</script>

<template>
  <div class="w-full flex flex-col items-center">
    
    <div 
        ref="containerRef"
        class="relative w-full h-48 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-800 mb-6 group"
    >
        
        <div class="absolute top-0 bottom-0 left-1/2 w-1 bg-red-600 z-30 transform -translate-x-1/2 shadow-[0_0_15px_rgba(220,38,38,1)]"></div>
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-red-600 z-30 text-3xl drop-shadow-md">▼</div>
        
        <div 
            class="flex items-center h-full absolute left-0 px-4 will-change-transform"
            :style="{ 
                transform: `translateX(${translateX}px)`,
                transition: isSpinning ? 'transform 6s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
            }"
        >
            <div 
                v-for="(item, index) in items" 
                :key="item.id"
                class="flex-shrink-0 w-[140px] h-[110px] mx-[8px] rounded-lg border-b-4 flex flex-col items-center justify-center relative transition-all duration-300"
                 :class="[
                    getRarityClass(item.rarity),
                    // Effet visuel quand c'est la carte gagnante ET que c'est fini
                    hasWon && index === WINNER_INDEX ? 'ring-4 ring-yellow-400 z-20 scale-105 brightness-110' : 'opacity-90'
                 ]"
            >
               <div class="text-4xl mb-1">{{ item.image || '🃏' }}</div>
               <div class="text-xs font-bold text-center px-1 truncate w-full text-gray-800">{{ item.name }}</div>
               <div class="text-[9px] uppercase font-black tracking-widest opacity-60 mt-1 text-gray-500">{{ item.rarity }}</div>
            </div>
        </div>
        
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-r from-gray-900 via-transparent to-gray-900 z-20 opacity-80"></div>
    </div>

    <div v-if="!isSpinning && !hasWon" class="text-gray-400 text-sm animate-pulse font-mono">
        &lt; En attente de synchronisation... /&gt;
    </div>

    <div v-if="hasWon" class="text-center animate-bounce-in">
        <h3 class="text-xl font-bold text-gray-600 mb-1">FÉLICITATIONS !</h3>
        <h2 class="text-2xl font-black text-gray-800 mb-4 bg-yellow-100 px-4 py-1 rounded-lg inline-block border-2 border-yellow-400">
            {{ winnerItem.name }}
        </h2>
        <br>
        <button 
            @click="$emit('close')"
            class="bg-ocean-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 active:translate-y-0"
        >
            AJOUTER À L'INVENTAIRE
        </button>
    </div>

  </div>
</template>

<style scoped>
@keyframes bounce-in {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); }
}
.animate-bounce-in {
    animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
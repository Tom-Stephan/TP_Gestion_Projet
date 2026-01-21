<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  availableCards: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'win']);

const isSpinning = ref(false);
const hasWon = ref(false);
const items = ref([]); // The long list of items in the carousel
const winnerItem = ref(null);
const translateX = ref(0);

// Configuration
const ITEM_WIDTH = 140; // px
const GAP = 16;         // px
const TOTAL_ITEMS = 100;
const WINNER_INDEX = 80; // Fixed index for the winner to land on

// Generate the chaotic list of items
const generateItems = () => {
  const generated = [];
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    // Randomly pick a card from available cards
    const randomCard = props.availableCards[Math.floor(Math.random() * props.availableCards.length)];
    generated.push({
      ...randomCard,
      id: `item-${i}-${Date.now()}` // Unique ID
    });
  }
  return generated;
};

// Start the spin animation
const startSpin = () => {
    if (isSpinning.value) return;
    
    // 1. Prepare items
    items.value = generateItems();
    
    // 2. Decide winner (at WINNER_INDEX)
    winnerItem.value = items.value[WINNER_INDEX];
    
    isSpinning.value = true;
    hasWon.value = false;
    translateX.value = 0; // Reset position

    // 3. Calculate target position
    // We want the WINNER_INDEX item to be centered.
    // Center of container (assuming ~350px wide modal) is roughly 175px
    // But easier: define a fixed window width or calculate dynamically.
    // Let's assume the "marker" is at offset 0 of the container's center.
    // Offset = (WINNER_INDEX * (ITEM_WIDTH + GAP)) - (ContainerCenterOffset) + (Random jitter within item width)
    
    // Let's refine: The container will be flexible. We want to shift LEFT.
    // To center the Nth item: - (N * (W + G)) + (ContainerWidth / 2) - (ItemWidth / 2)
    // We'll adjust via CSS variable or inline style.
    
    // Adding randomness so it doesn't always land on the exact same pixel of the card
    const jitter = Math.floor(Math.random() * (ITEM_WIDTH - 20)) + 10; 
    
    // Approximate target : ~80 items * 156px = ~12480px left shift
    setTimeout(() => {
        const winningPosition = (WINNER_INDEX * (ITEM_WIDTH + GAP)) - (350 / 2) + (ITEM_WIDTH / 2) + jitter; // 350 is approx container width
        translateX.value = -winningPosition;
    }, 100); // Tiny delay to allow DOM to render initial state

    // 4. End of spin logic
    setTimeout(() => {
        hasWon.value = true;
        emit('win', winnerItem.value);
    }, 6500); // Sync with CSS transition duration
};

const getRarityClass = (rarity) => {
    switch(rarity) {
        case 'Légendaire': return 'border-yellow-500 bg-yellow-900/10 shadow-yellow-500/50';
        case 'Rare': return 'border-purple-500 bg-purple-900/10 shadow-purple-500/50';
        default: return 'border-gray-400 bg-gray-100 shadow-gray-400/20';
    }
};

// Expose start method to parent
defineExpose({ startSpin });
</script>

<template>
  <div class="w-full flex flex-col items-center">
    
    <!-- Spinner Window -->
    <div class="relative w-full h-48 bg-gray-900 rounded-xl overflow-hidden shadow-inner border-4 border-gray-800 mb-6 group">
        
        <!-- The Marker (Red Line) -->
        <div class="absolute top-0 bottom-0 left-1/2 w-1 bg-red-500 z-30 transform -translate-x-1/2 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-500 z-30 text-2xl">▼</div>
        
        <!-- The Carousel Tape -->
        <div 
            class="flex items-center h-full absolute left-1/2 px-4 will-change-transform"
            :style="{ 
                transform: `translateX(${translateX}px)`,
                transition: isSpinning ? 'transform 6s cubic-bezier(0.1, 0.9, 0.2, 1)' : 'none'
            }"
        >
            <div 
                v-for="(item, index) in items" 
                :key="item.id"
                class="flex-shrink-0 w-[140px] h-[110px] mx-[8px] rounded-lg border-b-4 flex flex-col items-center justify-center bg-white relative transition-all duration-300"
                 :class="[
                    getRarityClass(item.rarity),
                    hasWon && index === WINNER_INDEX ? 'scale-110 z-20 brightness-110 ring-4 ring-white' : 'opacity-80'
                 ]"
            >
               <div class="text-3xl mb-1">{{ item.image || '🃏' }}</div>
               <div class="text-xs font-bold text-center px-1 truncate w-full">{{ item.name }}</div>
               <div class="text-[9px] uppercase font-black tracking-widest opacity-60 mt-1">{{ item.rarity }}</div>
            </div>
        </div>
        
        <!-- Glass overlay for depth -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-r from-gray-900 via-transparent to-gray-900 z-20"></div>
    </div>

    <!-- Controls -->
    <div v-if="!isSpinning && !hasWon" class="text-gray-400 text-sm animate-pulse">
        En attente d'ouverture...
    </div>

    <!-- Win Result -->
    <div v-if="hasWon" class="text-center animate-fade-in-up">
        <h3 class="text-2xl font-black text-gray-800 mb-2">
            <span class="text-yellow-500">VOUS AVEZ OBTENU :</span><br>
            {{ winnerItem.name }}
        </h3>
        <button 
            @click="$emit('close')"
            class="bg-ocean-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 active:translate-y-0"
        >
            RÉCUPÉRER
        </button>
    </div>

  </div>
</template>

<style scoped>
@keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out;
}
</style>

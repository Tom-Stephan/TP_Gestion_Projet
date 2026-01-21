<script setup>
import { ref, nextTick } from 'vue';
import LootboxSpinner from '../components/LootboxSpinner.vue';

const wallet = ref(1250); // Solde initial fictif
const isModalOpen = ref(false);
const lootboxCost = 500;
const spinnerRef = ref(null);

// Mock rewards
const rewards = [
    { id: 1, title: 'Bon Fnac 10€', cost: 1000, img: '🎫' },
    { id: 2, title: 'Place Cinéma', cost: 800, img: '🍿' },
    { id: 3, title: ' -20% BioCoop', cost: 300, img: '🥦' },
    { id: 4, title: 'Don Asso Mer', cost: 500, img: '🌊' },
];

const availableCards = [
    { name: "Crabe Vert", rarity: "Commune" },
    { name: "Goéland", rarity: "Commune" },
    { name: "Loutre", rarity: "Légendaire" },
    { name: "Dauphin", rarity: "Légendaire" },
    { name: "Etoile de Mer", rarity: "Rare" },
];

// Trigger purchase flow
const buyLootbox = async () => {
    if (wallet.value >= lootboxCost) {
        wallet.value -= lootboxCost;
        isModalOpen.value = true;
        // Wait for modal to render then start spin
        await nextTick();
        if(spinnerRef.value) {
            spinnerRef.value.startSpin();
        }
    } else {
        alert("Pas assez d'EcoCoins ! 😢");
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-24 font-sans">
    
    <!-- Fixed Header -->
    <div class="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-sm p-4 flex justify-between items-center border-b border-gray-100">
        <h1 class="text-xl font-black text-gray-800 uppercase tracking-tighter">Boutique</h1>
        <div class="px-4 py-2 bg-yellow-400 rounded-full shadow-lg flex items-center gap-2 font-black text-white transform scale-100 hover:scale-105 transition">
            <span>🪙</span>
            <span>{{ wallet }}</span>
        </div>
    </div>

    <div class="p-6">
        <!-- Section 1: Lootbox Highlight -->
        <section class="mb-10">
            <h2 class="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>🎁</span> Coffres Mystères
            </h2>
            
            <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden group">
                <!-- Background decoration -->
                <div class="absolute -right-10 -bottom-10 text-9xl opacity-20 transform rotate-12 group-hover:rotate-0 transition duration-500">🔮</div>
                
                <div class="relative z-10">
                    <h3 class="text-2xl font-black mb-1">Coffre Légendaire</h3>
                    <p class="text-indigo-100 text-sm mb-6 max-w-[70%]">Tentez de gagner des cartes rares pour votre collection de clan !</p>
                    
                    <div class="flex items-center justify-between mt-8">
                        <div class="text-3xl filter drop-shadow-md animate-bounce">📦</div>
                        <button 
                            @click="buyLootbox" 
                            class="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black py-3 px-6 rounded-xl shadow-[0_4px_0_rgb(200,150,0)] active:shadow-none active:translate-y-1 transition-all uppercase tracking-wide text-sm flex items-center gap-2"
                        >
                            <span>Ouvrir</span>
                            <span class="bg-yellow-600/20 px-2 rounded">{{ lootboxCost }} 🪙</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 2: Real Rewards -->
        <section>
            <h2 class="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>🎟️</span> Récompenses
            </h2>
            
            <div class="grid grid-cols-2 gap-4">
                <div v-for="reward in rewards" :key="reward.id" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                    <div class="text-4xl mb-3">{{ reward.img }}</div>
                    <div class="font-bold text-gray-800 text-sm leading-tight mb-3 h-10 flex items-center">{{ reward.title }}</div>
                    <button class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg text-xs transition">
                        {{ reward.cost }} 🪙
                    </button>
                </div>
            </div>
        </section>
    </div>

    <!-- Modal Lootbox -->
    <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Overlay -->
            <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeModal"></div>
            
            <!-- Modal Content -->
            <div class="bg-white rounded-3xl w-full max-w-md p-6 relative z-10 shadow-2xl animate-pop-in">
                <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50">✕</button>
                
                <h3 class="text-center text-xl font-black text-gray-800 mb-6">Ouverture en cours...</h3>
                
                <!-- The LootBox Spinner Component -->
                <div class="flex justify-center mb-4 min-h-[250px] items-center">
                   <LootboxSpinner 
                        ref="spinnerRef" 
                        :availableCards="availableCards" 
                        @close="closeModal"
                   />
                </div>
                
            </div>
        </div>
    </Teleport>

  </div>
</template>

<style scoped>
@keyframes pop-in {
    0% { transform: scale(0.9); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}
.animate-pop-in {
    animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>

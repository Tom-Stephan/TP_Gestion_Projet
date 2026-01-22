<script setup>
import { ref, nextTick, computed } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import LootboxSpinner from '../components/LootboxSpinner.vue';

const userStore = useUserStore();
const router = useRouter();

// Use store wallet or 0 if not connected
const wallet = computed(() => userStore.currentUser?.wallet_points || 0);

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

const buyLootbox = async () => {
    if (!userStore.currentUser) {
        router.push('/login');
        return;
    }

    if (wallet.value >= lootboxCost) {
        // Direct mutation is allowed in Pinia standard usage
        userStore.currentUser.wallet_points -= lootboxCost;
        // Persist change
        userStore.saveUserData();
        
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

const onLootboxWin = (winnerItem) => {
    // Add item to inventory (Store persistence handles this for session)
    if (userStore.currentUser) {
        // Mongoose schema uses array of strings. 
        // We push the name of the card.
        if (!userStore.currentUser.inventory_cards) {
            userStore.currentUser.inventory_cards = [];
        }
        userStore.currentUser.inventory_cards.push(winnerItem.name);
        
        // Award XP (Fixed amount as requested, e.g. 15 XP)
        userStore.addXp(15);
        
        // Save to DB and LocalStorage
        userStore.saveUserData();
        localStorage.setItem('user', JSON.stringify(userStore.currentUser));
    }
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-24 font-sans text-slate-800">
    
    <!-- Clean Header -->
    <div class="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center transition-all">
        <h1 class="text-xl font-bold tracking-tight text-slate-900">Boutique</h1>
        
        <!-- Subtle Coin Badge -->
        <div class="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200 shadow-sm">
            <span class="text-lg">🪙</span>
            <span class="text-sm font-semibold tabular-nums">{{ wallet }}</span>
        </div>
    </div>

    <div class="max-w-3xl mx-auto p-6 space-y-10">
        <!-- Section 1: Premium Offer (Lootbox) -->
        <section>
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                <!-- Image Area -->
                <div class="md:w-1/3 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100 relative group">
                    <div class="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition duration-700"></div>
                    <div class="text-7xl filter drop-shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition duration-500 cursor-pointer relative z-10" @click="buyLootbox">
                        🎁
                    </div>
                    <!-- Sparkles -->
                    <div class="absolute top-1/4 right-1/4 text-xl animate-pulse delay-75">✨</div>
                    <div class="absolute bottom-1/3 left-1/4 text-lg animate-pulse delay-150 text-yellow-400">✨</div>
                </div>

                <!-- Content Area -->
                <div class="p-8 flex-1 flex flex-col justify-center">
                    <div class="flex items-center gap-2 mb-2">
                         <span class="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">Populaire</span>
                    </div>
                    <h2 class="text-xl font-bold text-slate-900 mb-2">Coffre Légendaire</h2>
                    <p class="text-slate-500 text-sm mb-6 leading-relaxed">
                        Obtenez des cartes exclusives pour votre collection. Contient 3 items aléatoires avec une chance accrue de légendaires.
                    </p>

                    <div class="flex items-center justify-between mt-auto">
                        <span class="text-sm font-medium text-slate-400">Prix unitaire</span>
                        <button 
                            @click="buyLootbox" 
                            class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm flex items-center gap-2 active:scale-95"
                        >
                            <span>Ouvrir</span>
                            <span class="text-slate-300 font-normal">|</span>
                            <span>{{ lootboxCost }} 🪙</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 2: Rewards Grid -->
        <section>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold text-slate-800">Récompenses disponibles</h2>
                <span class="text-xs font-medium text-slate-400 cursor-pointer hover:text-slate-600">Tout voir</span>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="reward in rewards" :key="reward.id" class="group bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div class="aspect-square bg-gray-50 rounded-lg flex items-center justify-center text-4xl mb-4 group-hover:bg-indigo-50 transition-colors">
                        {{ reward.img }}
                    </div>
                    
                    <div class="space-y-3">
                        <div class="font-semibold text-slate-800 text-sm leading-tight h-10 flex items-center">{{ reward.title }}</div>
                        
                        <div class="flex items-center justify-between pt-3 border-t border-gray-50">
                             <span class="text-xs font-semibold text-slate-500">{{ reward.cost }} 🪙</span>
                             <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                 <span class="text-xs">+</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <!-- Modal Lootbox (Minimalist) -->
    <Teleport to="body">
        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
            
            <div class="bg-white rounded-2xl w-full max-w-sm p-0 shadow-2xl relative z-10 overflow-hidden transform transition-all">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 class="font-bold text-slate-800">Ouverture du coffre</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">✕</button>
                </div>

                <div class="p-8 flex justify-center min-h-[300px] items-center bg-white">
                   <LootboxSpinner 
                        ref="spinnerRef" 
                        :availableCards="availableCards" 
                        @close="closeModal"
                        @win="onLootboxWin"
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

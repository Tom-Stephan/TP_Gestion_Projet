<script setup>
import { ref } from 'vue';

// Mock Data
const user = ref({
  pseudo: 'Lucas_Breizh',
  level: 5,
  title: "Éboueur d'Élite",
  xp: 75, // Percentage
  wallet: 1250,
  stats: {
    weight: 42,
    missions: 12
  },
  clan: {
    name: 'Les Corsaires',
    faction: 'Corsaires'
  },
  inventory: [
    { id: 1, name: 'Crabe Vert', rarity: 'Commune', image: '🦀' },
    { id: 2, name: 'Loutre', rarity: 'Légendaire', image: '🦦' },
    { id: 3, name: 'Vieux Filet', rarity: 'Commune', image: '🕸️' },
    { id: 4, name: 'Etoile de Mer', rarity: 'Rare', image: '⭐' },
    { id: 5, name: 'Bouteille MSG', rarity: 'Rare', image: '🍾' },
  ],
  history: [
    { id: 1, action: 'Mission "Plage du Moulin" complétée', date: 'Il y a 2h', gain: '+500 XP' },
    { id: 2, action: 'Lootbox ouverte', date: 'Il y a 1j', gain: '+1 Carte' },
    { id: 3, action: 'Signalement validé', date: 'Il y a 2j', gain: '+50 Coins' },
  ]
});

const getRarityColor = (rarity) => {
    switch(rarity) {
        case 'Légendaire': return 'border-yellow-400 bg-yellow-50 text-yellow-700';
        case 'Rare': return 'border-purple-400 bg-purple-50 text-purple-700';
        default: return 'border-gray-300 bg-gray-50 text-gray-600';
    }
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 pb-24 font-sans">
    
    <!-- Header RPG Card -->
    <div class="bg-white rounded-2xl shadow-xl p-6 mb-6 border-t-8 border-ocean-blue relative overflow-hidden">
      <!-- Background pattern decoration -->
      <div class="absolute top-0 right-0 opacity-10 text-9xl transform translate-x-12 -translate-y-6 pointer-events-none">⚓</div>

      <div class="flex items-center gap-4 mb-4">
        <!-- Avatar -->
        <div class="relative">
          <div class="w-20 h-20 rounded-full border-4 border-gray-100 shadow-lg bg-gray-200 flex items-center justify-center text-4xl">
            🏴‍☠️
          </div>
          <div class="absolute -bottom-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">
            Lvl {{ user.level }}
          </div>
        </div>

        <!-- Info -->
        <div>
           <h1 class="text-2xl font-black text-gray-800">{{ user.pseudo }}</h1>
           <div class="text-sm font-semibold text-ocean-blue uppercase tracking-wide">{{ user.title }}</div>
           <div class="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
             🛡️ {{ user.clan.name }}
           </div>
        </div>
      </div>

      <!-- XP Bar -->
      <div class="w-full bg-gray-200 rounded-full h-4 shadow-inner mb-2">
        <div 
          class="bg-gradient-to-r from-blue-400 to-blue-600 h-4 rounded-full transition-all duration-1000 relative"
          :style="{ width: `${user.xp}%` }"
        >
          <!-- Shine -->
          <div class="absolute inset-0 bg-white/20 rounded-full"></div>
        </div>
      </div>
      <div class="text-xs text-right text-gray-500 font-medium">{{ user.xp }}% vers le niveau {{ user.level + 1 }}</div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-white p-3 rounded-xl shadow-md text-center border-b-4 border-yellow-500">
        <div class="text-2xl mb-1">💰</div>
        <div class="font-black text-gray-800 text-lg">{{ user.wallet }}</div>
        <div class="text-[10px] uppercase font-bold text-gray-400">EcoCoins</div>
      </div>
      <div class="bg-white p-3 rounded-xl shadow-md text-center border-b-4 border-forest-green">
        <div class="text-2xl mb-1">⚖️</div>
        <div class="font-black text-gray-800 text-lg">{{ user.stats.weight }}<small class="text-xs">kg</small></div>
        <div class="text-[10px] uppercase font-bold text-gray-400">Ramassés</div>
      </div>
      <div class="bg-white p-3 rounded-xl shadow-md text-center border-b-4 border-purple-500">
        <div class="text-2xl mb-1">🏆</div>
        <div class="font-black text-gray-800 text-lg">{{ user.stats.missions }}</div>
        <div class="text-[10px] uppercase font-bold text-gray-400">Missions</div>
      </div>
    </div>

    <!-- Inventory / Loot -->
    <div class="mb-6">
      <h2 class="text-xl font-black text-gray-800 mb-3 flex items-center gap-2">
        <span>🎒</span> Mon Butin
      </h2>
      <div class="flex gap-4 overflow-x-auto pb-4 snap-x">
        <div 
          v-for="item in user.inventory" 
          :key="item.id"
          class="min-w-[100px] bg-white rounded-xl p-3 shadow-md flex flex-col items-center justify-between border-2 snap-center"
          :class="getRarityColor(item.rarity)"
        >
          <div class="text-4xl mb-2">{{ item.image }}</div>
          <div class="text-xs font-bold text-center leading-tight mb-1">{{ item.name }}</div>
          <div class="text-[9px] uppercase font-extrabold opacity-70">{{ item.rarity }}</div>
        </div>
      </div>
    </div>

    <!-- History -->
    <div class="bg-white rounded-2xl shadow-sm p-5 border border-gray-200">
      <h3 class="text-lg font-bold text-gray-700 mb-4">Dernières Activités</h3>
      <div class="space-y-4">
        <div v-for="log in user.history" :key="log.id" class="flex items-start gap-3 relative pb-4 last:pb-0 last:border-0 border-l-2 border-dashed border-gray-200 pl-4">
          <div class="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-gray-400"></div>
          <div>
            <div class="font-semibold text-gray-800 text-sm">{{ log.action }}</div>
            <div class="flex justify-between items-center w-full gap-8">
               <span class="text-xs text-gray-400">{{ log.date }}</span>
               <span class="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{{ log.gain }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Hide scrollbar for clean horizontal scroll */
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.overflow-x-auto {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

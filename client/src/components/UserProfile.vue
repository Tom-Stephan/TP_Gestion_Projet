<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const cardMap = {
  // Mapping names from Shop/Lootbox
  'Crabe Vert': { rarity: 'Commune', image: '🦀' },
  'Loutre': { rarity: 'Légendaire', image: '🦦' },
  'Vieux Filet': { rarity: 'Commune', image: '🕸️' },
  'Etoile de Mer': { rarity: 'Rare', image: '⭐' },
  'Bouteille MSG': { rarity: 'Rare', image: '🍾' },
  'Goéland': { rarity: 'Commune', image: '🐦' },
  'Dauphin': { rarity: 'Légendaire', image: '🐬' },
  
  // Mapping IDs from Seed Data
  'card_001': { rarity: 'Commune', image: '🦀', name: 'Crabe Vert (Ancien)' },
  'card_005': { rarity: 'Rare', image: '🍾', name: 'Bouteille à la mer' },
  'card_010': { rarity: 'Légendaire', image: '🦦', name: 'Loutre' },
  'card_999': { rarity: 'Mythique', image: '👑', name: 'Couronne Perdue' },
  'card_777': { rarity: 'Rare', image: '⭐', name: 'Etoile de Mer' }
};

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};

const user = computed(() => {
  if (!userStore.currentUser) return null;
  // Merge with defaults to avoid undefined access
  const defaultUser = {
    stats: { weight: 0, missions: 0 },
    history: [],
    wallet_points: 0,
    inventory_cards: [],
    clan: { name: 'Sans Clan', faction: 'Aucune' },
    xp: 0,
    level: 1,
    title: 'Novice',
    pseudo: 'Inconnu'
  };

  // Deep merge or specific override is better to ensure nested stats exist
  return {
    ...defaultUser,
    ...userStore.currentUser,
    stats: { ...defaultUser.stats, ...(userStore.currentUser?.stats || {}) },
    clan: { ...defaultUser.clan, ...(userStore.currentUser?.clan || {}) },
    // Compute derived state locally for display
    xpRequired: userStore.getXpRequired(userStore.currentUser?.level || 1) 
  };
});

const progressPercent = computed(() => {
  if (!user.value) return 0;
  return Math.min(100, Math.round((user.value.xp / user.value.xpRequired) * 100));
});

const enrichedInventory = computed(() => {
  if (!user.value || !user.value.inventory_cards) return [];
  
  const inventory = user.value.inventory_cards || [];
  const counts = {};
  
  // Count occurrences
  inventory.forEach(itemName => {
    counts[itemName] = (counts[itemName] || 0) + 1;
  });

  // Map to enriched objects
  return Object.entries(counts).map(([itemName, count]) => {
    const details = cardMap[itemName] || { rarity: 'Commune', image: '❓' };
    return {
      id: itemName,
      name: details.name || itemName,
      count,
      ...details
    };
  });
});

onMounted(() => {
  if (!userStore.currentUser) {
    router.push('/login');
  }
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
  <div v-if="user" class="min-h-screen bg-white pb-40 font-sans text-slate-800">
    
    <!-- Clean Header -->
    <div class="max-w-4xl mx-auto p-6 pt-10">
        <div class="flex items-start justify-between mb-8">
            <div class="flex items-center gap-6">
                <!-- Avatar with Colorful Ring -->
                <div class="relative">
                    <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-400 to-teal-400 shadow-md">
                        <div class="w-full h-full bg-white rounded-full flex items-center justify-center text-5xl border-2 border-white">
                            🏴‍☠️
                        </div>
                    </div>
                    <div class="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border-4 border-white shadow-sm">
                        Lvl {{ user.level }}
                    </div>
                </div>
                
                <!-- Info -->
                <div>
                   <h1 class="text-3xl font-extrabold text-slate-800 tracking-tight mb-1">{{ user.pseudo }}</h1>
                   <div class="flex items-center gap-2 mb-3">
                        <span class="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">{{ user.title }}</span>
                        <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">{{ user.clan.name }}</span>
                   </div>
                   
                   <!-- Colored XP Bar -->
                   <div class="flex items-center gap-3 text-xs w-56">
                        <div class="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" :style="{ width: `${progressPercent}%` }"></div>
                        </div>
                        <span class="text-slate-400 font-bold tabular-nums">{{ user.xp }}/{{ user.xpRequired }}</span>
                   </div>
                </div>
            </div>

            <button 
              @click="handleLogout"
              class="group flex flex-col items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
              title="Se déconnecter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
        </div>

        <!-- Colorful Stats Row -->
        <div class="grid grid-cols-3 gap-4 mb-10">
            <div class="relative overflow-hidden bg-amber-50 rounded-2xl p-4 border border-amber-100 flex flex-col items-center justify-center group hover:shadow-md transition-all">
                <div class="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform">💰</div>
                <div class="text-3xl font-black text-amber-600 mb-1 filter drop-shadow-sm">{{ user.wallet_points }}</div>
                <div class="text-[10px] font-bold text-amber-800/60 uppercase tracking-widest">EcoCoins</div>
            </div>
            <div class="relative overflow-hidden bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex flex-col items-center justify-center group hover:shadow-md transition-all">
                 <div class="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform">⚖️</div>
                 <div class="text-3xl font-black text-emerald-600 mb-1 filter drop-shadow-sm">{{ user.stats.weight }}<span class="text-base font-bold ml-0.5 opacity-80">kg</span></div>
                 <div class="text-[10px] font-bold text-emerald-800/60 uppercase tracking-widest">Collectés</div>
            </div>
            <div class="relative overflow-hidden bg-purple-50 rounded-2xl p-4 border border-purple-100 flex flex-col items-center justify-center group hover:shadow-md transition-all">
                 <div class="absolute -right-4 -top-4 text-6xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform">🏆</div>
                 <div class="text-3xl font-black text-purple-600 mb-1 filter drop-shadow-sm">{{ user.stats.missions }}</div>
                 <div class="text-[10px] font-bold text-purple-800/60 uppercase tracking-widest">Missions</div>
            </div>
        </div>

        <!-- Main Layout Grid: Collection & History -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Column 1: Inventory / Collection -->
            <div>
              <div class="flex items-center justify-between mb-6">
                 <h2 class="text-lg font-bold text-slate-900 border-l-4 border-indigo-500 pl-3">Collection</h2>
                 <span class="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">{{ enrichedInventory.length }} items</span>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                <div 
                  v-for="(item, index) in enrichedInventory" 
                  :key="item.id"
                  class="group relative rounded-xl p-2 flex flex-col items-center justify-center aspect-[3/4] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-transparent"
                  :class="{
                    'bg-slate-50 hover:bg-slate-100': item.rarity === 'Commune',
                    'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100': item.rarity === 'Rare',
                    'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100': item.rarity === 'Légendaire',
                    'bg-gradient-to-br from-fuchsia-50 to-purple-50 border-fuchsia-100': item.rarity === 'Mythique'
                  }"
                >
                   <!-- Count Badge -->
                   <div v-if="item.count > 1" class="absolute top-1.5 right-1.5 bg-white text-slate-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10">
                     x{{ item.count }}
                   </div>

                   <div class="text-3xl mb-2 filter drop-shadow-sm transform group-hover:scale-110 transition-all duration-300 relative z-10">{{ item.image }}</div>
                   
                   <div class="text-center w-full relative z-10">
                       <div class="text-[10px] font-bold text-slate-700 truncate w-full mb-0.5">{{ item.name }}</div>
                       <div class="text-[8px] font-bold uppercase tracking-wider opacity-50">{{ item.rarity }}</div>
                   </div>
                </div>
                
                <!-- Empty State -->
                <div v-if="enrichedInventory.length === 0" class="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-slate-400 text-sm">
                    Votre collection est vide.
                </div>
              </div>
            </div>

            <!-- Column 2: History (Redesigned) -->
            <div>
                 <div class="flex items-center justify-between mb-6">
                    <h3 class="text-lg font-bold text-slate-900 border-l-4 border-emerald-500 pl-3">Activités récentes</h3>
                 </div>
                 
                 <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                     <div v-if="!user.history || user.history.length === 0" class="p-8 text-center text-slate-400 text-sm">
                         Aucune activité récente.
                     </div>

                     <div v-else class="divide-y divide-slate-50">
                         <div v-for="log in user.history.slice(0, 8)" :key="log.id" class="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                             <div class="flex items-center gap-4">
                                 <!-- Dynamic Icon based on action -->
                                 <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                                    :class="{
                                        'bg-emerald-100 text-emerald-600': log.action.includes('Missions') || log.action.includes('Poids'),
                                        'bg-red-100 text-red-600': log.action.includes('Attaque'),
                                        'bg-blue-100 text-blue-600': log.action.includes('Renfort') || log.action.includes('Quiz'),
                                        'bg-amber-100 text-amber-600': log.action.includes('Coffre'),
                                        'bg-slate-100 text-slate-500': !log.action.match(/Missions|Poids|Attaque|Renfort|Coffre/)
                                    }"
                                 >
                                    <span v-if="log.action.includes('Attaque')">⚔️</span>
                                    <span v-else-if="log.action.includes('Renfort')">🛡️</span>
                                    <span v-else-if="log.action.includes('Coffre')">🎁</span>
                                    <span v-else-if="log.action.includes('Quiz')">🧠</span>
                                    <span v-else>✨</span>
                                 </div>
                                 
                                 <div class="min-w-0">
                                     <div class="text-sm font-semibold text-slate-800 truncate group-hover:text-slate-900">{{ log.action }}</div>
                                     <div class="text-[11px] font-medium text-slate-400 mt-0.5">{{ log.date }}</div>
                                 </div>
                             </div>
                             
                             <div class="font-bold text-xs px-2.5 py-1 rounded-md bg-gray-50 text-slate-600 border border-gray-100 whitespace-nowrap ml-2">
                                {{ log.gain }}
                             </div>
                         </div>
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
/* Hide scrollbar for clean horizontal scroll */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

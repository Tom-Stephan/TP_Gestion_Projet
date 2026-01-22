<script setup>
import { RouterView, RouterLink } from 'vue-router'
import MissionOverlay from './components/MissionOverlay.vue';
</script>

<template>
  <!-- App Shell Layout -->
  <div class="h-screen w-screen overflow-hidden bg-gray-50 flex flex-col">
    <!-- Main Content Area (takes all space above nav) -->
    <div class="flex-1 overflow-hidden">
      <MissionOverlay />
      <RouterView />
    </div>

    <!-- Bottom Navigation Bar - Fixed, Sticky, with Backdrop Blur -->
    <nav class="h-20 bg-white/90 backdrop-blur-md border-t border-white/20 shadow-[0_-8px_24px_-6px_rgba(0,0,0,0.15)] z-50 flex-shrink-0">
      <div class="flex justify-around items-center h-full px-2">
        <!-- Map Link -->
        <RouterLink 
          to="/" 
          class="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-ocean-blue active:text-ocean-blue transition-colors duration-200 flex-1"
          active-class="text-ocean-blue"
        >
          <span class="text-2xl mb-1">🗺️</span>
          <span class="text-xs font-semibold">Carte</span>
        </RouterLink>

        <!-- Clan Link -->
        <RouterLink 
          to="/clan" 
          class="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-red-500 active:text-red-500 transition-colors duration-200 flex-1"
          active-class="text-alert-red"
        >
          <span class="text-2xl mb-1">⚔️</span>
          <span class="text-xs font-semibold">Clan</span>
        </RouterLink>

        <!-- Central Scan Button (Floating Action Button) -->
        <RouterLink 
          to="/scan" 
          class="flex flex-col items-center justify-center -mt-10 transform transition-all duration-200 hover:scale-110 active:scale-95 flex-1"
        >
          <div class="relative">
            <!-- Outer glow effect -->
            <div class="absolute inset-0 bg-gradient-to-br from-forest-green to-green-700 rounded-full blur-lg opacity-75 animate-pulse"></div>
            <!-- Button -->
            <div class="relative bg-gradient-to-br from-forest-green to-green-700 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white transform transition-transform">
              <span class="text-4xl">📷</span>
            </div>
          </div>
        </RouterLink>

        <!-- Shop Link -->
        <RouterLink 
          to="/shop" 
          class="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-yellow-600 active:text-yellow-600 transition-colors duration-200 flex-1"
          active-class="text-yellow-600"
        >
          <span class="text-2xl mb-1">🛒</span>
          <span class="text-xs font-semibold">Shop</span>
        </RouterLink>

        <!-- Profile Link -->
        <RouterLink 
          to="/profile" 
          class="flex flex-col items-center justify-center p-2 text-gray-500 hover:text-purple-600 active:text-purple-600 transition-colors duration-200 flex-1"
          active-class="text-purple-600"
        >
          <span class="text-2xl mb-1">👤</span>
          <span class="text-xs font-semibold">Profil</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
@keyframes pulse-button {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

:deep(.animate-pulse) {
  animation: pulse-button 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>

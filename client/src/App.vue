<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 pb-20"> <!-- pb-20 for bottom nav space -->
    <RouterView />

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
      <div class="flex justify-around items-center p-2">
        <RouterLink to="/" class="flex flex-col items-center p-2 text-gray-500 hover:text-ocean-blue active:text-ocean-blue transition" active-class="text-ocean-blue font-bold">
          <span class="text-2xl">🗺️</span>
          <span class="text-xs">Carte</span>
        </RouterLink>

        <RouterLink to="/clan" class="flex flex-col items-center p-2 text-gray-500 hover:text-alert-red active:text-alert-red transition" active-class="text-alert-red font-bold">
          <span class="text-2xl">⚔️</span>
          <span class="text-xs">Clan</span>
        </RouterLink>

        <RouterLink to="/scan" class="flex flex-col items-center justify-center -mt-8">
            <div class="bg-forest-green text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50 transform transition active:scale-95">
              <span class="text-3xl">📷</span>
            </div>
        </RouterLink>

        <RouterLink to="/shop" class="flex flex-col items-center p-2 text-gray-500 hover:text-yellow-600 active:text-yellow-600 transition" active-class="text-yellow-600 font-bold">
          <span class="text-2xl">🛒</span>
          <span class="text-xs">Shop</span>
        </RouterLink>

        <RouterLink to="/profile" class="flex flex-col items-center p-2 text-gray-500 hover:text-purple-600 active:text-purple-600 transition" active-class="text-purple-600 font-bold">
          <span class="text-2xl">👤</span>
          <span class="text-xs">Profil</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<style scoped>
</style>

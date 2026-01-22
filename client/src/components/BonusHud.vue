<script setup>
import { useGameStore } from '../stores/useGameStore';

const gameStore = useGameStore();
</script>

<template>
  <Transition name="slide-fade">
    <div 
      v-if="gameStore.isBonusActive" 
      class="fixed top-4 right-4 z-[90] flex items-center gap-3 bg-black/80 backdrop-blur-md border border-yellow-400/50 rounded-full py-2 px-4 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
    >
        <!-- Icon that pulses -->
        <div class="relative">
            <div class="absolute inset-0 bg-yellow-400 rounded-full opacity-75 animate-ping"></div>
            <div class="relative bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-black text-lg shadow-lg">
                ⚡
            </div>
        </div>

        <!-- Text Info -->
        <div class="flex flex-col leading-none">
            <span class="text-[0.6rem] font-bold text-yellow-400 uppercase tracking-widest mb-0.5">Bonus Actif</span>
            <div class="flex items-baseline gap-1">
                <span class="text-white font-black text-lg italic pr-1">X2</span>
                <span class="text-yellow-400 font-mono text-sm font-bold">{{ gameStore.remainingBonusTime }}</span>
            </div>
        </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>

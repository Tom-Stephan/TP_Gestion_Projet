<script setup>
defineProps({
  spot: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['play']);

const handlePlay = () => {
  emit('play', spot.id);
};
</script>

<template>
  <div class="arcade-popup-container">
    <div class="arcade-alert">
      <!-- Status Badge with Neon Effect -->
      <div class="arcade-status-badge">
        <span class="badge-icon">🎮</span>
        <span class="badge-text">DÉFI ARCADE</span>
      </div>

      <!-- Location Name - Pixel Style -->
      <h3 class="arcade-title">{{ spot.name }}</h3>

      <!-- Description with Energy -->
      <p class="arcade-description">{{ spot.description }}</p>

      <!-- Coin Animation Container -->
      <div class="coin-container">
        <span class="rotating-coin">🪙</span>
        <span class="coin-text">x2 BONUS</span>
      </div>

      <!-- Play Button - Pill Shape with Intense Glow -->
      <button @click="handlePlay" class="arcade-play-btn">
        <span class="btn-icon">⚡</span>
        <span class="btn-text">JOUER</span>
        <span class="btn-bonus">(Bonus x2)</span>
      </button>

      <!-- Neon Glow Pulse Background -->
      <div class="neon-pulse"></div>
    </div>
  </div>
</template>

<style scoped>
.arcade-popup-container {
  width: 100%;
  max-width: none;
}

.arcade-alert {
  position: relative;
  background: linear-gradient(135deg, #1a0033 0%, #2d0052 50%, #0f001a 100%);
  border-radius: 20px;
  padding: 16px 20px;
  overflow: hidden;
  box-shadow: 
    0 0 40px rgba(236, 72, 153, 0.7),
    0 0 80px rgba(139, 92, 246, 0.5),
    0 0 120px rgba(236, 72, 153, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(236, 72, 153, 0.8);
  animation: arcade-neon-pulse 2.5s ease-in-out infinite;
}

@keyframes arcade-neon-pulse {
  0%, 100% {
    box-shadow: 
      0 0 40px rgba(236, 72, 153, 0.7),
      0 0 80px rgba(139, 92, 246, 0.5),
      0 0 120px rgba(236, 72, 153, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(236, 72, 153, 0.8);
  }
  50% {
    box-shadow: 
      0 0 60px rgba(236, 72, 153, 0.9),
      0 0 100px rgba(139, 92, 246, 0.7),
      0 0 150px rgba(236, 72, 153, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(236, 72, 153, 1);
  }
}

/* Status Badge */
.arcade-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(236, 72, 153, 0.15);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #00ffff;
  border-right: 3px solid #ff00ff;
}

.badge-icon {
  font-size: 1.1rem;
  animation: arcade-bounce 0.6s ease-in-out infinite;
}

@keyframes arcade-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-4px) scale(1.1); }
}

.badge-text {
  color: #ff00ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #ff00ff, 0 2px 4px rgba(0, 0, 0, 0.8);
  font-family: 'Courier New', monospace;
  font-weight: bold;
}

/* Title - Pixel Art Style */
.arcade-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #00ffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  text-shadow: 
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 3px 10px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
  line-height: 1.2;
  font-family: 'Courier New', monospace;
}

/* Description */
.arcade-description {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0 0 12px 0;
  line-height: 1.4;
  text-shadow: 0 2px 8px rgba(236, 72, 153, 0.6);
  font-weight: 500;
  text-align: center;
}

/* Coin Animation Container */
.coin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(139, 92, 246, 0.4);
}

.rotating-coin {
  font-size: 1.5rem;
  display: inline-block;
  animation: coin-spin 1.5s linear infinite;
}

@keyframes coin-spin {
  0% { transform: rotateY(0deg) scale(1); }
  50% { transform: rotateY(90deg) scale(0.6); }
  100% { transform: rotateY(360deg) scale(1); }
}

.coin-text {
  font-size: 0.85rem;
  color: #00ffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 8px #00ffff;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

/* Play Button - Pill Shape */
.arcade-play-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #ff006e 0%, #8b5cf6 50%, #d946ef 100%);
  color: #ffffff;
  border: 2px solid #00ffff;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
  
  /* Intense Neon Glow */
  box-shadow: 
    0 0 20px rgba(236, 72, 153, 0.8),
    0 0 40px rgba(139, 92, 246, 0.6),
    0 0 60px rgba(0, 255, 255, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  
  animation: button-arcade-glow 1.5s ease-in-out infinite;
}

@keyframes button-arcade-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(236, 72, 153, 0.8),
      0 0 40px rgba(139, 92, 246, 0.6),
      0 0 60px rgba(0, 255, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: #00ffff;
  }
  50% {
    box-shadow: 
      0 0 30px rgba(236, 72, 153, 1),
      0 0 60px rgba(139, 92, 246, 0.8),
      0 0 100px rgba(0, 255, 255, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #ff00ff;
  }
}

.arcade-play-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 0 40px rgba(236, 72, 153, 1),
    0 0 80px rgba(139, 92, 246, 0.8),
    0 0 120px rgba(0, 255, 255, 0.6),
    0 6px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #ff3385 0%, #a78bfa 50%, #e879f9 100%);
}

.arcade-play-btn:active {
  transform: translateY(0) scale(1);
  box-shadow: 
    0 0 20px rgba(236, 72, 153, 0.8),
    0 0 40px rgba(139, 92, 246, 0.6),
    inset 0 3px 8px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.3rem;
  animation: lightning-flash 0.4s ease-in-out infinite;
}

@keyframes lightning-flash {
  0%, 100% { 
    text-shadow: 0 0 5px #ffff00;
    transform: scale(1);
  }
  50% { 
    text-shadow: 0 0 15px #ffff00, 0 0 25px #ff00ff;
    transform: scale(1.1);
  }
}

.btn-text {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 2px;
  font-family: 'Courier New', monospace;
}

.btn-bonus {
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.9;
  margin-left: 2px;
  color: #ffff00;
}

/* Neon Pulse Background Effect */
.neon-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: radial-gradient(circle at center, rgba(236, 72, 153, 0.15) 0%, transparent 70%);
  pointer-events: none;
  animation: neon-wave 2s ease-out infinite;
}

@keyframes neon-wave {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(1.1);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .arcade-alert {
    padding: 12px 16px;
  }

  .arcade-title {
    font-size: 1.15rem;
  }

  .arcade-description {
    font-size: 0.8rem;
  }

  .arcade-play-btn {
    padding: 12px 16px;
    font-size: 0.9rem;
    border-radius: 30px;
  }

  .btn-icon {
    font-size: 1.1rem;
  }

  .btn-text {
    letter-spacing: 1.5px;
  }

  .btn-bonus {
    font-size: 0.75rem;
  }
}
</style>

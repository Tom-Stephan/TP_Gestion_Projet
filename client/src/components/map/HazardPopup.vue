<script setup>
defineProps({
  spot: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['attack']);

const handleAttack = () => {
  emit('attack', spot.id);
};
</script>

<template>
  <div class="hazard-popup-container">
    <div class="hazard-alert">
      <!-- Status Badge with Pulsing Animation -->
      <div class="hazard-status-badge">
        <span class="badge-icon">⚠️</span>
        <span class="badge-text">ZONE MENACÉE</span>
      </div>

      <!-- Location Name -->
      <h3 class="hazard-title">{{ spot.name }}</h3>

      <!-- Description -->
      <p class="hazard-description">{{ spot.description }}</p>

      <!-- Attack Button - Primary CTA -->
      <button @click="handleAttack" class="hazard-attack-btn">
        <span class="btn-icon">⚔️</span>
        <span class="btn-text">ATTAQUER</span>
        <span class="btn-xp">(500 XP)</span>
      </button>

      <!-- Energy Pulse Effect -->
      <div class="energy-pulse"></div>
    </div>
  </div>
</template>

<style scoped>
.hazard-popup-container {
  /* Override Leaflet popup styles */
  width: 100%;
  max-width: none;
}

.hazard-alert {
  position: relative;
  background: linear-gradient(135deg, #cc0000 0%, #ff0000 50%, #cc0000 100%);
  border-radius: 20px;
  padding: 16px 20px;
  overflow: hidden;
  box-shadow: 
    0 0 30px rgba(255, 0, 0, 0.8),
    0 0 60px rgba(255, 100, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 200, 0, 0.6);
  animation: hazard-pulse 2s ease-in-out infinite;
}

@keyframes hazard-pulse {
  0%, 100% {
    box-shadow: 
      0 0 30px rgba(255, 0, 0, 0.8),
      0 0 60px rgba(255, 100, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 
      0 0 50px rgba(255, 0, 0, 1),
      0 0 100px rgba(255, 100, 0, 0.7),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

/* Status Badge */
.hazard-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid #ffff00;
}

.badge-icon {
  font-size: 1.1rem;
  animation: badge-bounce 1s ease-in-out infinite;
}

@keyframes badge-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.badge-text {
  color: #ffff00;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Title */
.hazard-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.6);
  letter-spacing: 0.5px;
  line-height: 1.2;
}

/* Description */
.hazard-description {
  font-size: 0.9rem;
  color: #ffffff;
  margin: 0 0 16px 0;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

/* Attack Button - The Hero Element */
.hazard-attack-btn {
  width: 100%;
  padding: 14px 16px;
  background: linear-gradient(135deg, #ff3333 0%, #cc0000 50%, #990000 100%);
  color: #ffffff;
  border: 3px dashed #ffcc00;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  
  /* Intense Glow Effect */
  box-shadow: 
    0 0 20px rgba(255, 204, 0, 0.8),
    0 0 40px rgba(255, 100, 0, 0.6),
    inset 0 2px 0 rgba(255, 255, 255, 0.2),
    inset 0 -2px 0 rgba(0, 0, 0, 0.3);
  
  animation: button-glow 2s ease-in-out infinite;
}

@keyframes button-glow {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(255, 204, 0, 0.8),
      0 0 40px rgba(255, 100, 0, 0.6),
      inset 0 2px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 0 rgba(0, 0, 0, 0.3);
    border-color: #ffcc00;
  }
  50% {
    box-shadow: 
      0 0 30px rgba(255, 204, 0, 1),
      0 0 60px rgba(255, 150, 0, 0.8),
      inset 0 2px 0 rgba(255, 255, 255, 0.3),
      inset 0 -2px 0 rgba(0, 0, 0, 0.4);
    border-color: #ffff00;
  }
}

.hazard-attack-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 40px rgba(255, 204, 0, 1),
    0 0 80px rgba(255, 100, 0, 0.8),
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #ff5555 0%, #ff3333 50%, #cc0000 100%);
}

.hazard-attack-btn:active {
  transform: translateY(0);
  box-shadow: 
    0 0 20px rgba(255, 204, 0, 0.8),
    0 0 40px rgba(255, 100, 0, 0.6),
    inset 0 4px 8px rgba(0, 0, 0, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
  animation: icon-shake 0.3s ease-in-out infinite;
}

@keyframes icon-shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-3deg); }
  75% { transform: rotate(3deg); }
}

.btn-text {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.btn-xp {
  font-size: 0.85rem;
  font-weight: 700;
  opacity: 0.95;
  margin-left: 2px;
}

/* Energy Pulse Background Effect */
.energy-pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  pointer-events: none;
  animation: pulse-wave 3s ease-out infinite;
}

@keyframes pulse-wave {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
  }
}

/* Override Leaflet Popup Styling */
:deep(.leaflet-popup-content-wrapper) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

:deep(.leaflet-popup-content) {
  margin: 0 !important;
  width: 100% !important;
  padding: 0 !important;
}

:deep(.leaflet-popup-tip-container) {
  display: none !important;
}

:deep(.leaflet-popup-tip) {
  display: none !important;
}

/* Responsive Design */
@media (max-width: 640px) {
  .hazard-alert {
    padding: 12px 16px;
  }

  .hazard-title {
    font-size: 1.1rem;
  }

  .hazard-description {
    font-size: 0.85rem;
  }

  .hazard-attack-btn {
    padding: 12px 14px;
    font-size: 0.95rem;
    border-width: 2px;
  }

  .btn-text {
    letter-spacing: 1px;
  }

  .btn-xp {
    font-size: 0.8rem;
  }
}
</style>

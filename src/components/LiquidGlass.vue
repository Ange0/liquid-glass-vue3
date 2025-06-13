<template>
  <component
    :is="tag"
    :class="[
      'liquid-glass',
      `liquid-glass--${variant}`,
      { 'liquid-glass--hover-effect': hoverEffect }
    ]"
    :style="computedStyle"
    v-bind="$attrs"
  >
    <div class="liquid-glass__effect"></div>
    <div class="liquid-glass__tint" :style="tintStyle"></div>
    <div class="liquid-glass__shine"></div>
    <div class="liquid-glass__content">
      <slot></slot>
    </div>
  </component>

  <!-- SVG Filter (injecté une seule fois) -->
  <svg v-if="!filterInjected" style="display: none" @vue:mounted="filterInjected = true">
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        :baseFrequency="turbulenceFrequency"
        numOctaves="1"
        :seed="turbulenceSeed"
        result="turbulence"
      />
      
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>

      <feGaussianBlur in="turbulence" :stdDeviation="blurIntensity" result="softMap" />

      <feSpecularLighting
        in="softMap"
        :surfaceScale="surfaceScale"
        specularConstant="1"
        specularExponent="100"
        lighting-color="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>

      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />

      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        :scale="displacementScale"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LiquidGlassProps } from '../index'

// Props avec types TypeScript
const props = withDefaults(defineProps<LiquidGlassProps>(), {
  tag: 'div',
  variant: 'default',
  tintColor: 'rgba(255, 255, 255, 0.25)',
  backdropBlur: '3px',
  hoverEffect: true,
  textColor: 'black',
  turbulenceFrequency: '0.01 0.01',
  turbulenceSeed: 50,
  blurIntensity: 100,
  surfaceScale: 5,
  displacementScale: 150,
  customStyles: () => ({})
})

// Refs
const filterInjected = ref(false)

// Computed
const computedStyle = computed(() => ({
  '--backdrop-blur': props.backdropBlur,
  '--text-color': props.textColor,
  ...props.customStyles
}))

const tintStyle = computed(() => ({
  background: props.tintColor
}))
</script>

<style scoped>
.liquid-glass {
  position: relative;
  display: flex;
  font-weight: 600;
  overflow: hidden;
  color: var(--text-color, black);
  cursor: pointer;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
}

.liquid-glass__effect {
  position: absolute;
  z-index: 0;
  inset: 0;
  backdrop-filter: blur(var(--backdrop-blur, 3px));
  filter: url(#glass-distortion);
  overflow: hidden;
  isolation: isolate;
}

.liquid-glass__tint {
  z-index: 1;
  position: absolute;
  inset: 0;
}

.liquid-glass__shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  box-shadow: 
    inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5),
    inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5);
}

.liquid-glass__content {
  z-index: 3;
  position: relative;
}

/* Variantes de style */
.liquid-glass--default {
  padding: 1rem;
  border-radius: 1rem;
}

.liquid-glass--menu {
  padding: 0.4rem;
  border-radius: 1.8rem;
  flex-direction: column;
}

.liquid-glass--dock {
  padding: 0.6rem;
  border-radius: 2rem;
  align-items: center;
  justify-content: center;
}

.liquid-glass--button {
  padding: 1.5rem 2.5rem;
  border-radius: 3rem;
  align-items: center;
  justify-content: center;
}

/* Effets de hover */
.liquid-glass--hover-effect.liquid-glass--menu:hover {
  padding: 0.6rem;
  transform: scale(1.05);
}

.liquid-glass--hover-effect.liquid-glass--dock:hover {
  padding: 0.8rem;
  border-radius: 2.5rem;
  transform: scale(1.05);
}

.liquid-glass--hover-effect.liquid-glass--button:hover {
  padding: 1.8rem 2.8rem;
  border-radius: 4rem;
  transform: scale(1.05);
}

.liquid-glass--hover-effect.liquid-glass--default:hover {
  transform: scale(1.05);
}

/* Styles pour le contenu du menu */
.liquid-glass--menu .liquid-glass__content > * {
  font-size: 20px;
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 0.8rem;
  transition: all 0.1s ease-in;
  cursor: pointer;
}

.liquid-glass--menu .liquid-glass__content > *:hover {
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: inset -2px -2px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}

/* Styles pour le dock */
.liquid-glass--dock .liquid-glass__content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.liquid-glass--dock img {
  width: 75px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
}

.liquid-glass--dock img:hover {
  transform: scale(0.95);
}

/* Styles pour les boutons */
.liquid-glass--button .liquid-glass__content {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
}

.liquid-glass--button:hover .liquid-glass__content {
  transform: scale(0.95);
}
</style>
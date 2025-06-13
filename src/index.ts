import type { App } from 'vue'
import LiquidGlass from './components/LiquidGlass.vue'

// Export du composant pour utilisation individuelle
export { LiquidGlass }

// Export par défaut pour installation comme plugin
export default {
  install(app: App) {
    app.component('LiquidGlass', LiquidGlass)
  }
}

// Types pour TypeScript
export interface LiquidGlassProps {
  tag?: string
  variant?: 'default' | 'menu' | 'dock' | 'button'
  tintColor?: string
  backdropBlur?: string
  hoverEffect?: boolean
  textColor?: string
  turbulenceFrequency?: string
  turbulenceSeed?: number
  blurIntensity?: number
  surfaceScale?: number
  displacementScale?: number
  customStyles?: Record<string, any>
}
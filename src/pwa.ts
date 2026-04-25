import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    console.log(`Service Worker registered: ${swUrl}`)
  },
  onRegisterError(error) {
    console.error('Service Worker registration error:', error)
  }
})

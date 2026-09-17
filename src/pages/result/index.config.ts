export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '你的灵魂画像' })
  : { navigationBarTitleText: '你的灵魂画像' }

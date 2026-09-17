export default typeof definePageConfig === 'function'
  ? definePageConfig({ navigationBarTitleText: '你最好的朋友' })
  : { navigationBarTitleText: '你最好的朋友' }

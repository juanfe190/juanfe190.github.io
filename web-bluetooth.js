let onButtonClicknormal
let executeAction

(function() {
  let device
  let server
  let manualDisconnect
  const actionFunctionByMode = {
    color: getColorHexString,
    normal: getNormalLightString,
    on: () => 'cc2333',
    off: () => 'cc2433'
  }

  function getDevice() {
    console.log('Requesting Bluetooth Device...')

    return navigator.bluetooth.requestDevice({
      filters: [{ name: 'LEDBlue-4C5C69BF' }],
      optionalServices: ['0000ffe5-0000-1000-8000-00805f9b34fb']
    })
  }

  function connect() {
    return device.gatt.connect()
  }

  async function _executeAction({ mode, brightness, hex='ffffff' }) {
    const service = await server.getPrimaryService('0000ffe5-0000-1000-8000-00805f9b34fb')
    const characteristic = await service.getCharacteristic('0000ffe9-0000-1000-8000-00805f9b34fb')
    const string = actionFunctionByMode[mode].call(null, [brightness, hex])
    const value = hexStringToByte(string)

    console.log('EXCECUTING', { mode, brightness, hex })

    await characteristic.writeValue(value)
  }

  function _disconnect() {
    manualDisconnect = true

    return device.gatt.disconnect()
  }

  async function _onButtonClick() {
    try {
      if(manualDisconnect) {
        manualDisconnect = false

        return
      }

      if(!device) {
        device = await getDevice()
        device.addEventListener('gattserverdisconnected', () => {
          console.log('RECONNECTING...')
          onButtonClick()
        })
      }

      if(!device.gatt.connected) {
        server = await connect()

    } catch(error) {
      console.log('Argh! ' + error)
    }
  }

  onButtonClick = _onButtonClick
  executeAction = _executeAction
  disconnect = _disconnect
})()

const socket = io('https://a2c9c22b.ngrok.io')

socket.on('action', (data) => executeAction(data))

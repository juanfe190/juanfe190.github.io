let device

async function onButtonClick() {
  try {
    console.log('Requesting Bluetooth Device...')

    if(!device || !device.gatt.connected) {
      device  = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'LEDBlue-4C5C69BF' }],
        optionalServices: [0xffe5]
      })
    }

    console.log('Connecting to GATT Server...')
    window.server = await device.gatt.connect()

    console.log(server, 'Getting Heart Rate Service...')
    let service = await server.getPrimaryService(0xffe5)
    console.log('TEST')

    console.log('Getting Heart Rate Control Point Characteristic...')
    let characteristic = await service.getCharacteristic('0000ffe9-0000-1000-8000-00805f9b34fb')

    console.log('Writing Heart Rate Control Point Characteristic...')
    // Writing 1 is the signal to reset energy expended.
    let value = '560000FF64f0aa'
    await characteristic.writeValue(value)

    console.log('> Energy expended has been reset.')
  } catch(error) {
    console.log('Argh! ' + error)
  }
}

function hexStringToByte(str) {
  if (!str) {
    return new Uint8Array();
  }

  var a = [];
  for (var i = 0, len = str.length; i < len; i+=2) {
    a.push(parseInt(str.substr(i,2),16));
  }

  return new Uint8Array(a);
}

function intToHex(int) {
  const hex = Number(int).toString(16)

  return hex.length > 1 ? hex :`0${hex}`
}

function getColorHexString(brightness = 100, hex) {
  return `56${hexColor}${intToHex(brightness)}f0aa`
}

function getNormalLightString(brightness = 100) {
  return `56000000${intToHex(brightness)}0faa`
}

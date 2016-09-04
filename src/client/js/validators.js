
function validateCoord(value) {
	if (!isInt(value)) {
		return false
	}
	let valueInt = parseInt(value);
	if (valueInt < -5000 || 5000 < valueInt) {
		return false;
	}
	return true;
}

function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}

module.exports.validateCoord = validateCoord;
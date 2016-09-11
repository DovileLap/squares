import $ from 'jquery';

class SetsApi {
	loadSets(callbacks={}) {
		$.ajax({
			url: '/sets',
			success: callbacks.success,
			error: callbacks.error,
			complete: callbacks.complete
		});
	}

	saveSet(name, points, callbacks={}) {
		$.ajax({
			url: '/set/'+ name,
			method: 'POST',
			contentType: "application/json",
			data: JSON.stringify({ 'points': points }),
			success: callbacks.success,
			error: callbacks.error,
			complete: callbacks.complete
		});
	}

	deleteSet(name, callbacks={}) {
		$.ajax({
			url: '/set/' + name,
			method: 'DELETE',
			success: callbacks.success,
			error: callbacks.error,
			complete: callbacks.complete
		});
	}

	loadSet(name, callbacks={}) {
		$.ajax({
			url: '/set/' + name,
			success: callbacks.success,
			error: callbacks.error,
			complete: callbacks.complete
		});
	}
}

module.exports = SetsApi;
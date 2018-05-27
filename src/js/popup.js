import "../css/popup.css";
import positive from 'positive-energy-encoder';
import { log } from './log';

let encoded = document.getElementById('encoded');
let decoded = document.getElementById('decoded');
let encodeBtn = document.getElementById('encode');
let decodeBtn = document.getElementById('decode');
let checkbox = document.getElementById('activateSelectDecode');

function asyncSetEncode(value) {
	setTimeout(() => {
		encoded.value = value;
	}, 0);
}

function asyncSetDecode(value) {
	setTimeout(() => {
		decoded.value = value;
	}, 0);
}

chrome.storage.local.get(['isActivated'], function(result) {
	log('isActivated ' + result.isActivated);
	if (result.isActivated === undefined) {
		chrome.storage.local.set({isActivated: true}, function() {
			// default is true
		  	log('Value is set to ' + true);
		  	checkbox.checked = true;
		});
	} else {
		checkbox.checked = result.isActivated;
	}
});

chrome.storage.local.get(['encoded'], function(result) {
	log('encoded ' + result.encoded);
	if (result.encoded === undefined) {
		chrome.storage.local.set({encoded: ''}, function() {
			// default is empty
		  	log('encoded is set to ', '[]', 'by stroage');
		  	// encoded.value = '';
		  	asyncSetEncode('');
		});
	} else {
		log('encoded is set to ', result.encoded, 'by stroage');
		// encoded.value = result.encoded;
		asyncSetEncode(result.encoded);
	}
});

chrome.storage.local.get(['decoded'], function(result) {
	log('decoded ' + result.decoded);
	if (result.decoded === undefined) {
		chrome.storage.local.set({decoded: ''}, function() {
			// default is empty
		  	log('decoded is set to ', '[]', 'by storage');
		  	// decoded.value = '';
		  	asyncSetDecode('');
		});
	} else {
		log('decoded is set to ', result.decoded, 'by stroage');
		// decoded.value = result.decoded;
		asyncSetDecode(result.decoded);
	}
});

encoded.addEventListener('change', function() {
	chrome.storage.local.set({encoded: encoded.value}, function() {
	  	log('encoded is set to ', encoded.value);
	});
});

decoded.addEventListener('change', function() {
	chrome.storage.local.set({decoded: decoded.value}, function() {
	  	log('decoded is set to ', decoded.value);
	});
});

encodeBtn.addEventListener('click', e => {
	const newEncodedVal = positive.encode(decoded.value);
    chrome.storage.local.set({encoded: newEncodedVal}, function() {
	  	log('encoded in storage is set to ', newEncodedVal, 'by button');
	    // encoded.value = newEncodedVal;
	    asyncSetEncode(newEncodedVal);
	});
});

decodeBtn.addEventListener('click', e => {
	const newDecodedVal = positive.decode(encoded.value);
    chrome.storage.local.set({decoded: newDecodedVal}, function() {
	  	log('decoded in storage is set to ', newDecodedVal, 'by storage');
	    // decoded.value = newDecodedVal;
	    asyncSetDecode(newDecodedVal);
	});
});

checkbox.addEventListener('click', e => {
	chrome.storage.local.set({isActivated: checkbox.checked}, function() {
	  	log('Value is set to ' + checkbox.checked);
	});
});

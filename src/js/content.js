import "../css/content.css";
import $ from 'jquery';
import positive from 'positive-energy-encoder';
import tippy from 'tippy.js';
import { log } from './log';
const REF_ID = 'positive-energy-encoder-ref';
let isActivated = true;

chrome.storage.local.get(['isActivated'], function(result) {
	if (result.isActivated === undefined) {
		chrome.storage.local.set({isActivated: true}, function() {
			// default is true
		  	isActivated = true;
		});
	} else {
		isActivated = result.isActivated;
	}
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (changes.isActivated) {
		// isActivated changed
		log('set isActivated to', changes.isActivated.newValue);
		isActivated = changes.isActivated.newValue;
		if (!changes.isActivated.newValue) {
			// from true to false
			destroyTip();
			log('tips has been destroyed');
		}
	}
});

function wrapTextNode(range, tipTxt) {
	let selectionContents = range.extractContents();
	const createdSpan = document.createElement('span');
	createdSpan.appendChild(selectionContents);
	$(createdSpan).attr('id', REF_ID).attr('title', tipTxt);
	range.insertNode(createdSpan);
}

function createShowTip() {
	const tippyOption = {
		interactive: true,
		arrow: true,
		hideOnClick: 'persistent',
		theme: 'custom',
		trigger: 'manual'
	}
	const instance = tippy.one(`#${REF_ID}`, tippyOption);
	log('before tip show');
	instance.show();
	log('after tip show');
}

function destroyAllTips() {
	const allTips = $('.tippy-popper');
	for (let i = 0 ; i < allTips.length ; i++) {
		log('destroying tip', allTips[i]);
		allTips[i]._tippy.hide();
		allTips[i]._tippy.destroy();
	}
}

function destroyTip() {
	const ref = $(`#${REF_ID}`);
	const allTips = $('.tippy-popper');
	// remove tips
	for (const tip of allTips) {
		log('destroying tips', tip);
		const instance = tip._tippy;
		instance.hide();
		instance.destroy();
	}
	// unwrap
	if (ref.length > 0) {
		log('unwrapping ref', ref);
		ref.contents().unwrap(`#${REF_ID}`);
	}
}

function isFiringInsideTip(event) {
	return $(event.target).closest('.tippy-popper').length !== 0;
}

$(document).on('mousedown', event => {
	if (!isActivated) return;
	const ref = $(`#${REF_ID}`);
	const allTips = $('.tippy-popper');
	if (ref.length > 0 || allTips.length > 0) {
		// there is some span existing
		// or there is tips existing
		if (!isFiringInsideTip(event)) {
			// click outside tip
			log('click outside tip. Unwrapping and destroying tips now...');
			destroyTip();
		}
	}
})

$(document).on('mouseup', event => {
	if (!isActivated) return;
	let select = window.getSelection();
	if (!isFiringInsideTip(event) && select && select.toString()) {
		// when user selects something other than txt inside tip
		const selectedText = select.toString().trim();
		const decoded = positive.decode(selectedText);
		const tipTxt = decoded ? decoded : '选择的内容未能被解读 :(';
		wrapTextNode(select.getRangeAt(0), tipTxt);
		createShowTip();
	}
});

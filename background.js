let enabled = false;

function toggleEnabled() {
	if (!enabled) {
		browser.browserAction.setIcon({ path: "icon-green.svg" });
	} else {
		browser.browserAction.setIcon({ path: "icon.svg" });
	}

	enabled = !enabled;
	browser.storage.sync.set({ enabled: enabled });
}

browser.browserAction.onClicked.addListener(() => {
	toggleEnabled();
});

browser.runtime.onMessage.addListener(msg => {
	if (msg === 'toggle')
		toggleEnabled();
});

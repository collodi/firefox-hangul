let enabled = false;

browser.browserAction.onClicked.addListener(() => {
	if (!enabled) {
		browser.browserAction.setIcon({ path: "icon-green.svg" });
	} else {
		browser.browserAction.setIcon({ path: "icon.svg" });
	}

	enabled = !enabled;
	browser.storage.sync.set({ enabled: enabled });
});

browser.browserAction.onClicked.addListener(() => {
	browser.browserAction.setIcon({ path: "icon-green.svg" });
	//browser.browserAction.setIcon({ path: "icon.svg" });
});

const clearDownloads = () => {
	const clearTime = 5000;

	setTimeout(() => {
		chrome.downloads.erase({state: "complete"});
	}, clearTime)
};

chrome.downloads.onChanged.addListener((e) => {
	if (typeof e.state !== "undefined") {
		if (e.state.current === "complete") clearDownloads();
	}
});

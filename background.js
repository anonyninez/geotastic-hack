let activeTabId = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    chrome.storage.local.remove(`lastResponse_${tabId}`, () => {
    //   console.log("Cleared old response on tab update.");
    });
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
  chrome.storage.local.get(`lastResponse_${activeTabId}`, (data) => {
    if (data[`lastResponse_${activeTabId}`]) {
    //   console.log("Restored response for tab switch.");
    }
  });
});

chrome.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.tabId === activeTabId && details.url.includes('GeoPhotoService.GetMetadata')) { // GeoPhotoService.GetMetadata
      try {
        const response = await fetch(details.url);
        const text = await response.text();
        const geodata = handleResponse(text);
        await chrome.storage.local.set({ [`lastResponse_${activeTabId}`]: text });
        chrome.tabs.sendMessage(activeTabId, { action: "responseCaptured", data: geodata }, (response) => {
        //   if (chrome.runtime.lastError) {
        //     console.error(`Could not send message to tab: ${chrome.runtime.lastError.message}`);
        //   }
        });
      } catch (error) {
        console.error("Failed to fetch response:", error);
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

function getNestedValue(obj, path, defaultValue) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : defaultValue, obj);
}


function handleResponse(raw){
    // let data = JSON.parse(raw.slice(5))[1][0];
    let regex = /_callbacks__.*?\(\s*(\[.*\])\s*\)/;
    let match = raw.match(regex);
    let data;
    if (match && match[1]) {
        try {
            data = JSON.parse(match[1])[1][0];
        } catch (e) {
            console.error("Failed to parse data:", e);
        }
    // console.log(code);
        
    const lat = getNestedValue(data, [5, 0, 1, 0, 2], '0');
    const lon = getNestedValue(data, [5, 0, 1, 0, 3], '0');
    const code = getNestedValue(data, [5, 0, 1, 4], '-');
    const street = getNestedValue(data, [3, 2, 0, 0], '-');
    const city = getNestedValue(data, [3, 2, 1, 0], '-');
    //     console.log(code);
        return {code:code, coord:{lat:lat, lon:lon}, metadata:{street:street, city:city}}
    }
    return null

}

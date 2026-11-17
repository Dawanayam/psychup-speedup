// The action tab is the explicit source, never a guessed active tab in another window.
chrome.action.onClicked.addListener(async tab => {
  if (!Number.isInteger(tab.id)) return;
  await chrome.tabs.create({url:chrome.runtime.getURL('modules/speedup/index.html')+'?sourceTab='+tab.id});
});


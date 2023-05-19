import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(() => {
  console.log('btc gas tracker extension installed');
  updateIcon();

});

async function updateIcon() {
  const gasPrice = await getCurrentGasPrice();
  console.log('update data');
  chrome.action.setBadgeText({ text: `${gasPrice}`});
}

chrome.alarms.create('update badge text', { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'update badge text') {
    updateIcon();
  }
});

async function getCurrentGasPrice() {
  const response = await fetch('https://mempool.space/api/v1/fees/recommended', { method: 'GET' });
      const data = await response.json();
      const fastGasPrice = data.fastestFee;
      const standardGasPrice = data.halfHourFee;
      const cheapGasPrice = data.hourFee;
      return standardGasPrice;
}
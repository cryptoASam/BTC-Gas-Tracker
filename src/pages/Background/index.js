import browser from 'webextension-polyfill';

let lastNotificationTime = 0;

browser.runtime.onInstalled.addListener(() => {
  console.log('btc gas tracker extension installed');
  updateIcon();

});

async function updateIcon() {
  const gasPrice = await getCurrentGasPrice();
  console.log('update data');
  chrome.action.setBadgeText({ text: `${gasPrice}`});
  setAlertIfNeed(gasPrice);
}

chrome.alarms.create('update badge text', { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'update badge text') {
    updateIcon();
  }
});

function setAlertIfNeed(gasPrice) {
  chrome.storage.sync.get(['notificationFrequency','gasFeeThreshold', 'notificationCondition','lastNotificationTime'], (result) => {
    const gasFeeThreshold = result.gasFeeThreshold || 50;
    console.log('gasFeeThreshold', gasFeeThreshold);
    const notificationCondition = result.notificationCondition || 'greater-than';
    console.log('notificationCondition', notificationCondition);
    const lastNotificationTime = result.lastNotificationTime || 0;
    const notificationFrequency = result.notificationFrequency || 30;
    console.log('notificationFrequency', notificationFrequency);
    const currentTime = Date.now();
    if (currentTime - lastNotificationTime >= notificationFrequency * 60 * 1000) {
      console.log('cannot send notification because of frequency');
    }
    // Check gas fee and send notification if it meets the condition
    if (notificationCondition === 'greater-than' && gasPrice > gasFeeThreshold) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icons/gas-pump.png',
        title: 'Gas fee is high',
        message: `Gas fee is ${gasPrice} sats/byte`
      });
      console.log('have send notification more than');
    } else if (notificationCondition === 'less-than' && gasPrice < gasFeeThreshold) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icons/gas-pump.png',
        title: 'Gas fee is low',
        message: `Gas fee is ${gasPrice} sats/byte`
      });
      console.log('have send notification less than');
    }
  });
}

async function getCurrentGasPrice() {
  const response = await fetch('https://mempool.space/api/v1/fees/recommended', { method: 'GET' });
      const data = await response.json();
      const fastGasPrice = data.fastestFee;
      const standardGasPrice = data.halfHourFee;
      const cheapGasPrice = data.hourFee;
      return standardGasPrice;
}

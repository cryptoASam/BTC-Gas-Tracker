import React, { useEffect, useRef } from 'react';
import './Options.css';


const Options = () => {
  const notificationFrequencyRef = useRef(null);
  const gasFeeThresholdRef = useRef(null);
  const notificationConditionRef = useRef(null);

  useEffect(() => {
    chrome.storage.sync.get(['notificationFrequency', 'gasFeeThreshold', 'notificationCondition'], (result) => {
      notificationFrequencyRef.current.value = result.notificationFrequency || 30;
      gasFeeThresholdRef.current.value = result.gasFeeThreshold || 50;
      notificationConditionRef.current.value = result.notificationCondition || 'greater-than';
    });
  }, []);

  const handleNotificationButtonClick = () => {
    const options = {
      type: 'basic',
      title: ' BTC Gas Tracker Notification',
      message: 'Test notification successfully',
      iconUrl: "assets/icons/bitcoin.png"
    };
    chrome.notifications.create(options);
  };

  const handleNotificationFrequencyChange = () => {
    // chrome.storage.sync.set({ notificationFrequency: notificationFrequencyRef.current.value });
  };

  const handleGasFeeThresholdChange = () => {
    // chrome.storage.sync.set({ gasFeeThreshold: gasFeeThresholdRef.current.value });
  };

  const handleNotificationConditionChange = () => {
    // chrome.storage.sync.set({ notificationCondition: notificationConditionRef.current.value });
  };

  const handleConfirmButtonClick = () => {
    chrome.storage.sync.set({ notificationCondition: notificationConditionRef.current.value });
    chrome.storage.sync.set({ gasFeeThreshold: gasFeeThresholdRef.current.value });
    chrome.storage.sync.set({ notificationFrequency: notificationFrequencyRef.current.value });
  };


  return (
    <div className="OptionsContainer">
      <label htmlFor="notification-frequency">Notification Frequency(minutes):</label>
      <input type="number" id="notification-frequency-input" name="notification-frequency-input" ref={notificationFrequencyRef} onChange={handleNotificationFrequencyChange} />

      
      <label htmlFor="notification-condition">Notification Condition:</label>
      <select id="notification-condition-input" name="notification-condition-input" ref={notificationConditionRef} onChange={handleNotificationConditionChange}>
        <option value="greater-than">Greater Than</option>
        <option value="less-than">Less Than</option>
      </select>

      <label htmlFor="gas-fee-threshold">Gas Fee Threshold(sats):</label>
      <input type="number" id="gas-fee-threshold-input" name="gas-fee-threshold-input" ref={gasFeeThresholdRef} onChange={handleGasFeeThresholdChange} />

      <button onClick={handleConfirmButtonClick}>Confirm</button>
      <button onClick={handleNotificationButtonClick}>Test notification</button>
      <div className="form-group text-left">
        <ul>
          <li><b>Notification Frequency:</b> Notifications Frequency:Notifications are sent once per 30 minutes if the condition
            is met. You can change the time interval</li>
          <li><b>Notification Condition:</b> The condition to use when comparing the gas fee threshold.</li>
          <li><b>Gas Fee Threshold:</b> The gas fee threshold at which to send a notification.</li>
          <li><b>Test notification:</b> Sends a test notification to ensure that notifications are working properly.</li>
        </ul>
      </div>
    </div>
    
  );
};





export default Options;
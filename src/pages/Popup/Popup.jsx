import * as React from 'react';
import browser from 'webextension-polyfill';
import './Popup.css';
import { useState, useEffect } from 'react';

function settingClick() {
  chrome.runtime.openOptionsPage();
}

const Popup = () => {
  const [price, setPrice] = useState(0);
  const [fastGasPriceText, setFastGasPriceText] = useState(0);
  const [standardGasPriceText, setStandardGasPriceText] = useState(0);
  const [cheapGasPriceText, setCheapGasPriceText] = useState(0);
  const [fastGasPriceTextUsd, setFastGasPriceTextUsd] = useState(0);
  const [standardGasPriceTextUsd, setStandardGasPriceTextUsd] = useState(0);
  const [cheapGasPriceTextUsd, setCheapGasPriceTextUsd] = useState(0);
  const [loading, setLoading] = useState(false);

  async function getGasPrice() {
    try {

      // get current gas fee from  Mempool.space API
      const response = await fetch('https://mempool.space/api/v1/fees/recommended', { method: 'GET' });
      const data = await response.json();
      const fastGasPrice = data.fastestFee;
      const standardGasPrice = data.halfHourFee;
      const cheapGasPrice = data.hourFee;

      // get bitcoin price from CoinGecko API 
      const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd', { method: 'GET' });
      const priceData = await priceResponse.json();
      const bitcoinPrice = priceData.bitcoin.usd;

      const blockNum = 140;
      //convert gas fee to usd
      const usdtPerSats = bitcoinPrice / 100000000;
      const fastGasPriceUsd = fastGasPrice * usdtPerSats * blockNum;
      const standardGasPriceUsd = standardGasPrice * usdtPerSats * blockNum;
      const cheapGasPriceUsd = cheapGasPrice * usdtPerSats * blockNum;

      chrome.action.setBadgeText({ text: `${standardGasPrice}`});

      //update gas fee text
      setFastGasPriceText(fastGasPrice + ' sat');
      setStandardGasPriceText(standardGasPrice + ' sat');
      setCheapGasPriceText(cheapGasPrice + ' sat');

      setFastGasPriceTextUsd('$'+fastGasPriceUsd.toFixed(2));
      setStandardGasPriceTextUsd('$'+standardGasPriceUsd.toFixed(2));
      setCheapGasPriceTextUsd('$'+cheapGasPriceUsd.toFixed(2));
      setPrice(bitcoinPrice);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getGasPrice();
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="popup">
      {loading && <div className="loading">loading</div>}
      <div className='topContainer'>
        {/* <div className='imgContainer'>
          
        </div> */}
        <img className='topIconImg' src= "../assets/icons/gas-pump.png" 
          alt="icon" width="26" height="26"
        />
        <div className='textContainer'>
            BTC Gas Tracker
        </div>
      </div>

      <div className='priceContainer'>
        <img className='peiceIconImg' src= "../assets/icons/btc.png" 
            alt="icon" width="20" height="20"/>
        <div className='priceTextContainer'>
        ${`${price}`}
        </div>
      </div>

      <div className='gasContainer'>
        <div className='gasTypeTextContainer'>
          High
        </div>
        <div className='gasTextContainer'>

          <div className='gasPriceContainer'>
              <div className='gasSingleText'>{`${fastGasPriceText}`}</div>
              <div className='gasSingleText'>{`${fastGasPriceTextUsd}`}</div>
           </div>
        </div>

      </div>
      <div className='gasContainer'>
        <div className='gasTypeTextContainer'>
          Medium
        </div>
        <div className='gasTextContainer'>
          <div className='gasPriceContainer'>
            <div className='gasSingleText'>{`${standardGasPriceText}`}</div>
            <div className='gasSingleText'>{`${standardGasPriceTextUsd}`}</div>
           </div>
        </div>
      </div>
      <div className='gasContainer'>
        <div className='gasTypeTextContainer'>
            Low
        </div>
        <div className='gasTextContainer'>
          <div className='gasPriceContainer'>
            <div className='gasSingleText'>{`${cheapGasPriceText}`}</div>
            <div className='gasSingleText'>{`${cheapGasPriceTextUsd}`}</div>
          </div>
        </div>
      </div>
      <button id="settings-btn" onClick={settingClick}>Settings</button>
    </div>
  );
};

export default Popup;

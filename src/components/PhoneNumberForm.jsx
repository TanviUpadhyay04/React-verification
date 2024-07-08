import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import './PhoneNumberForm.css';
import mobile from "../images/mobile.png";
import subpage from "../images/subpage.png";
import menu from "../images/menu.png";
import smartphone from "../images/smartphone.png";

const PhoneNumberForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionID, setSessionID] = useState('');

  const encryptionKey = 'FtmJ7frzTyWOzintybbqIWzwwclcPtaI'; 
  const accessToken = '0e186445-0647-417c-ae27-8098533f1914'; 

  const encrypt = (data, key) => {
    const iv = CryptoJS.enc.Utf8.parse(key.substring(0, 16));
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  };

  const decrypt = (data, key) => {
    const iv = CryptoJS.enc.Utf8.parse(key.substring(0, 16));
    const decrypted = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  };

  const validatePhoneNumber = (number) => {
    const phoneNumberPattern = /^9647[3-9][0-9]{8}$/; // Adjusted pattern for Iraqi phone numbers
    return phoneNumberPattern.test(number);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid Iraqi phone number starting with +9647 followed by 8 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transactionID = 'b5d7ab80-262e-4246-9dc0-a9ca3202cf74'; // Unique transaction ID for each request
      const requestBody = {
        DeviceInfo: {
          PackageName: 'com.test.com',
          LangCode: 'en',
          DeviceID: 'test_dev_doc'
        },
        Referrer: {
          Affiliate: {
            Campaign: '6a0fa162-fb4c-4074-a6d4-402744e3590b', // Replace with your campaign ID
            ClickID: 'your-click-id', // Replace with your click ID
            Pub_ID: 'your-pub-id', // Replace with your publisher ID
            Aff_ID: 'your-affiliate-id', // Replace with your affiliate ID
            extra: '',
            extra1: '',
            firstPageButtonID: 'msisdn-entry',
            secondPageButtonID: 'pin-entry',
            Country: 'IQ' // ISO 3166-1 alpha-2 country code for Iraq
          }
        },
        Request: {
          Action: 1, // Example action, adjust as per your API requirements
          TransactionID: transactionID,
          SessionID: sessionID,
          MSISDN: phoneNumber,
          PinCode: ''
        }
      };

      const encryptedBody = encrypt(requestBody, encryptionKey);

      const response = await axios.post(
        'https://d3398n96t5wqx9.cloudfront.net/UsersAquisition/',
        { data: encryptedBody },
        {
          headers: {
            'Content-Type': 'application/json',
            'AccessToken': accessToken
          }
        }
      );

      const decryptedResponse = decrypt(response.data, encryptionKey);
      console.log('Decrypted Response:', decryptedResponse);

      if (decryptedResponse.Error === 0) {
        setSessionID(decryptedResponse.SessionID);
        handleNextAction(decryptedResponse.NextAction); // Handle next action based on API response
      } else {
        setError(decryptedResponse.MessageToShow || 'Failed to verify the number. Please try again.');
      }
    } catch (error) {
      console.error('Error during API request:', error);
      setError('Failed to verify the number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextAction = (nextAction) => {
    switch (nextAction.Action) {
      case 'SendPin':
        alert('Send Pin action triggered.'); // Example handling, adjust as per your needs
        break;
      case 'VerifyPin':
        alert('Verify Pin action triggered.'); // Example handling, adjust as per your needs
        break;
      case 'ClicksFlow':
        alert('Clicks Flow action triggered.'); // Example handling, adjust as per your needs
        break;
      case 'ClickToSMS':
        alert('Click to SMS action triggered.'); // Example handling, adjust as per your needs
        break;
      case 'LoadURL':
        window.location.href = nextAction.URL; // Redirect to the provided URL
        break;
      case 'SendSMS':
        alert(`SMS Message: ${nextAction.Message}\nDestination: ${nextAction.Destination}`);
        break;
      case 'Close':
        alert('Subscription process completed successfully.');
        break;
      default:
        console.log('Unhandled NextAction:', nextAction);
        break;
    }
  };

  return (
    <div className="form-container">
      <header>
        <img src={menu} alt="Menu" className="maybe" />
        <div className="lang">
          <select id="language-selector">
            <option value="2023-01">ENG</option>
          </select>
        </div>
      </header>
      <div className="timeline">
        <div className="step-container">
          <img src={subpage} alt="Subpage" className="goodness" />
          <span className="step">STEP 1/2</span>
          <div className="progress-bar">
            <div className="progress" style={{ width: '50%' }}></div>
          </div>
        </div>
      </div>
      <img src={mobile} alt="Mobile" className="good" />
      <h2>Enter your phone number</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="phone-number">Mobile number</label>
          <div className="phone-input">
            <span><img src={smartphone} alt="Smartphone" className="maybe-1" /></span>
            <input
              type="tel"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+964"
              maxLength="12" 
              required
            />
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="continue-button" disabled={loading}>
          {loading ? 'Loading...' : 'CONTINUE'}
        </button>
      </form>
      <p className="disclaimer">
        Entertainment is a subscription service that will automatically renew for 1 USD/ 7 Day(s). You can unsubscribe from the service at any time, by sending STOP to **** for (operator). To make use of this service, you must be 18 or more unless you have received permission from your parents or the person who is authorized to pay your bill.
        <br />
        <a href="#">Terms & Conditions</a> - <a href="#">Privacy Policy</a>
      </p>
    </div>
  );
};

export default PhoneNumberForm;

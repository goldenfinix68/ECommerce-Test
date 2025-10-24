import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CryptoIntegration.css";

const CryptoIntegration = () => {
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [ethPrice, setEthPrice] = useState(null);
  const [showPrice, setShowPrice] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);


  const getEthereumProvider = () => {
    if (typeof window === "undefined") return null;
    
    if (window.ethereum?.isMetaMask) {
      return window.ethereum;
    }
    
    if (window.ethereum?.providers) {
      return window.ethereum.providers.find(provider => provider.isMetaMask);
    }
    
    return window.ethereum;
  };

  const connectWallet = async () => {
    const provider = getEthereumProvider();
    
    if (!provider) {
      setError("MetaMask is not installed. Please install MetaMask and refresh this page.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      if (error.code === 4001) {
        setError("Connection cancelled. Please approve the connection in MetaMask.");
      } else if (error.code === -32002) {
        setError("MetaMask is already processing a request. Please try again.");
      } else {
        setError("Connection failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setIsConnected(false);
    setError("");
  };

  const fetchEthPrice = async () => {
    try {
      setPriceLoading(true);
      setError("");
      
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      
      const price = response.data.ethereum.usd;
      setEthPrice(price);
      setShowPrice(true);
    } catch (error) {
      setError("Failed to fetch ETH price. Please try again.");
    } finally {
      setPriceLoading(false);
    }
  };

  const fetchRecipientAddress = async () => {
    try {
      setAddressLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/api/crypto/address`, {
        timeout: 5000
      });
      
      if (response.data && response.data.success) {
        setRecipientAddress(response.data.address);
      } else {
        setRecipientAddress("0x1234567890123456789012345678901234567890");
      }
    } catch (error) {
      setRecipientAddress("0x1234567890123456789012345678901234567890");
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    const provider = getEthereumProvider();
    
    if (provider) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);

      provider
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        });

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
        }
      };
    }

    fetchRecipientAddress();
  }, []);

  return (
    <div className="crypto-gateway">
      <div className="crypto-container">
        <div className="crypto-header">
          <h1 className="crypto-title">Ethereum Gateway</h1>
          <p className="crypto-subtitle">
            Secure, fast, and reliable cryptocurrency payments
          </p>
          <hr className="crypto-divider" />
        </div>
        {error && (
          <div className="crypto-error">
            <div className="crypto-error-content">
              <div className="crypto-error-message">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '12px'}}>
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>
                  <strong>Error:</strong> {error}
                </div>
              </div>
              <button className="crypto-error-close" onClick={() => setError("")}>
                ×
              </button>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="crypto-card">
              <div className="crypto-card-header">
                <div className="crypto-icon-container wallet">
                  <svg width="32" height="32" fill="white" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="crypto-card-title">Wallet Connection</h3>
                  <p className="crypto-card-subtitle">Connect your MetaMask wallet</p>
                </div>
              </div>

              {!isConnected ? (
                <div>
                  <p style={{color: '#718096', marginBottom: '24px', lineHeight: '1.6'}}>
                    Connect your MetaMask wallet to begin secure cryptocurrency transactions. 
                    Ensure you have sufficient ETH for transaction fees.
                  </p>
                  
                  {!getEthereumProvider() ? (
                    <div style={{textAlign: 'center', marginBottom: '24px'}}>
                      <div style={{
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '16px',
                        marginBottom: '20px'
                      }}>
                        <h6 style={{margin: '0 0 12px 0', fontWeight: '600'}}>MetaMask Not Detected</h6>
                        <p style={{margin: '0 0 16px 0', fontSize: '0.9rem', opacity: '0.9'}}>
                          Install MetaMask browser extension to continue
                        </p>
                        <a
                          href="https://metamask.io/download/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          Install MetaMask
                        </a>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="crypto-btn"
                      onClick={connectWallet}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="crypto-spinner"></div>
                          Connecting...
                        </>
                      ) : (
                        "Connect Wallet"
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="crypto-status">
                    <div className="crypto-status-header">
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{marginRight: '8px'}}>
                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                      </svg>
                      Connected Successfully
                    </div>
                    <div className="crypto-status-address">
                      {account}
                    </div>
                  </div>
                  <button
                    className="crypto-btn secondary"
                    onClick={disconnectWallet}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="crypto-card">
              <div className="crypto-card-header">
                <div className="crypto-icon-container price">
                  <svg width="32" height="32" fill="white" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM11 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 17 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 15.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                    <path d="M3 3h10a.5.5 0 0 1 .5.5v10a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-10A.5.5 0 0 1 3 3z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="crypto-card-title">Market Price</h3>
                  <p className="crypto-card-subtitle">Real-time ETH/USD rate</p>
                </div>
              </div>

              <p style={{color: '#718096', marginBottom: '24px', lineHeight: '1.6'}}>
                Get the current Ethereum market price to calculate your payment amount accurately.
              </p>
              
              <button
                className="crypto-btn price"
                onClick={fetchEthPrice}
                disabled={priceLoading}
              >
                {priceLoading ? (
                  <>
                    <div className="crypto-spinner"></div>
                    Loading...
                  </>
                ) : (
                  "Get Current Price"
                )}
              </button>
              
              {showPrice && ethPrice && (
                <div className="crypto-price-display">
                  <div className="crypto-price-value">
                    ${ethPrice.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="crypto-price-label">USD per ETH</div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="crypto-card">
              <div className="crypto-card-header">
                <div className="crypto-icon-container address">
                  <svg width="32" height="32" fill="white" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="crypto-card-title">Payment Address</h3>
                  <p className="crypto-card-subtitle">Destination wallet address</p>
                </div>
              </div>

              {addressLoading ? (
                <div style={{textAlign: 'center', padding: '40px 0', color: '#718096'}}>
                  <div className="crypto-spinner" style={{margin: '0 auto 16px', borderColor: '#e2e8f0', borderTopColor: '#a0aec0'}}></div>
                  <p style={{marginBottom: '16px'}}>Loading payment address...</p>
                  <button 
                    onClick={fetchRecipientAddress}
                    style={{
                      background: 'none',
                      border: '1px solid #cbd5e0',
                      color: '#4a5568',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : recipientAddress ? (
                <div>
                  <p style={{color: '#718096', marginBottom: '20px', lineHeight: '1.6'}}>
                    Send your Ethereum payment to the following secure address:
                  </p>
                  
                  <div className="crypto-address-display">
                    <div className="crypto-address-label">
                      Recipient Address
                    </div>
                    <div className="crypto-address-value">
                      {recipientAddress}
                    </div>
                  </div>
                  
                  <div className="crypto-warning">
                    <svg width="20" height="20" fill="#ffc107" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <div className="crypto-warning-text">
                      Always verify the address before sending funds. Transactions are irreversible.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '40px 0', color: '#718096'}}>
                  <p>Unable to load payment address</p>
                  <button 
                    onClick={fetchRecipientAddress}
                    style={{
                      background: 'none',
                      border: '1px solid #cbd5e0',
                      color: '#4a5568',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      marginTop: '16px'
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="crypto-instructions">
          <h2 className="crypto-instructions-title">How to Complete Your Payment</h2>
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="crypto-step">
                <div className="crypto-step-number step-1">1</div>
                <div className="crypto-step-content">
                  <h6>Connect Wallet</h6>
                  <small>Link your MetaMask account securely</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="crypto-step">
                <div className="crypto-step-number step-2">2</div>
                <div className="crypto-step-content">
                  <h6>Check Price</h6>
                  <small>Get current ETH market rate</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="crypto-step">
                <div className="crypto-step-number step-3">3</div>
                <div className="crypto-step-content">
                  <h6>Send Payment</h6>
                  <small>Transfer to the provided address</small>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="crypto-step">
                <div className="crypto-step-number step-4">4</div>
                <div className="crypto-step-content">
                  <h6>Confirm</h6>
                  <small>Approve transaction in MetaMask</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoIntegration;
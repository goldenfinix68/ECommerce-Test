# Project Demo

This is a test project for full stack + blockchain developers

## Getting Started

Design and implement a small, self‑contained enhancement to this app to demonstrate full‑stack skills, code quality, and UX judgment. Keep scope tight; prefer clear, well‑tested code over breadth.


## What you will build

Enable crypto payment using MetaMask:

- Add MetaMask account connection
- "Today's ETH price" toggle button
- Show the MetaMask address of the server

## Detailed documents

https://docs.google.com/document/d/117Z5_tMnUQD5ke62rJsk42Gx97g60zbrNA2sqmj0rpQ/edit?tab=t.0

## How To Install
```sh
$ npm install --legacy-peer-deps
$ npm start
```

## ✅ Crypto Payment Implementation

### Features Implemented

1. **MetaMask Integration** - Complete wallet connection with ethers.js
2. **ETH Price Fetching** - Real-time price from CoinGecko API  
3. **Recipient Address Display** - Backend API serving ETH wallet address
4. **Bootstrap UI** - Clean, responsive interface

### Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment Setup:**
   - Update `.env` file with your ETH wallet address:
   ```
   ETH_WALLET_ADDRESS=0x1234567890123456789012345678901234567890
   ```

3. **Test Backend API:**
   ```bash
   # Start backend only
   node ./server/app.js
   
   # Test crypto address endpoint
   curl http://localhost:8000/api/crypto/address
   ```

4. **Access Crypto Payment Page:**
   - Navigate to: `http://localhost:3000/crypto-payment`
   - Or add a navigation link to the existing app

### Testing Steps

1. **MetaMask Connection:**
   - Click "Connect Wallet" button
   - Approve MetaMask connection
   - Verify wallet address display

2. **ETH Price:**
   - Click "Today's ETH Price" button
   - Verify price fetches from CoinGecko API

3. **Recipient Address:**
   - Verify recipient address loads from backend
   - Address should match .env configuration

### Files Created/Modified

- `src/components/shop/crypto/CryptoIntegration.js` - Main React component
- `server/routes/cryptoRoutes.js` - Backend API route
- `src/components/index.js` - Added routing
- `server/app.js` - Added crypto routes
- `.env` - Added ETH_WALLET_ADDRESS

### Technology Stack

- **Frontend:** React, ethers.js, Bootstrap, axios
- **Backend:** Express.js, Node.js
- **External API:** CoinGecko API for ETH pricing

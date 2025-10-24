const express = require("express");
const router = express.Router();

// Get ETH wallet address route
router.get("/crypto/address", (req, res) => {
  const ethWalletAddress = process.env.ETH_WALLET_ADDRESS;
  
  if (!ethWalletAddress) {
    return res.status(500).json({
      error: "ETH wallet address not configured"
    });
  }
  
  res.json({
    success: true,
    address: ethWalletAddress
  });
});

module.exports = router;
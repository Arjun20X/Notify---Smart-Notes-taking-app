// This file contains helper functions for generating OTPs

// Generate a 6-digit OTP as a string
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Return the expiry timestamp set to 5 minutes from now
  const getExpiry = () => Date.now() + 5 * 60 * 1000; // 5 minutes
  
  export{
    generateOtp,
    getExpiry
};
  
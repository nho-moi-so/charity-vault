import { ethers } from "ethers";

/**
 * Convert Wei to VND
 * @param {string|number} weiAmount - Amount in Wei
 * @param {number} ethPriceVND - ETH price in VND (default: 80,000,000)
 * @returns {number} Amount in VND
 */
export const weiToVND = (weiAmount, ethPriceVND = 80000000) => {
  if (!weiAmount || weiAmount === "0") return 0;

  try {
    // Convert Wei to ETH
    const ethAmount = parseFloat(ethers.formatEther(weiAmount.toString()));
    // Convert ETH to VND
    const vndAmount = ethAmount * ethPriceVND;
    return Math.round(vndAmount);
  } catch (error) {
    console.error("Error converting Wei to VND:", error);
    return 0;
  }
};

/**
 * Convert VND to Wei
 * @param {number} vndAmount - Amount in VND
 * @param {number} ethPriceVND - ETH price in VND (default: 80,000,000)
 * @returns {string} Amount in Wei
 */
export const vndToWei = (vndAmount, ethPriceVND = 80000000) => {
  if (!vndAmount) return "0";

  try {
    // Convert VND to ETH
    const ethAmount = vndAmount / ethPriceVND;
    // Convert ETH to Wei
    const weiAmount = ethers.parseEther(ethAmount.toString());
    return weiAmount.toString();
  } catch (error) {
    console.error("Error converting VND to Wei:", error);
    return "0";
  }
};

/**
 * Detect if a number is likely Wei (very large) or VND
 * @param {string|number} amount
 * @returns {boolean} true if likely Wei, false if likely VND
 */
export const isLikelyWei = (amount) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  // If number is larger than 1 billion, it's likely Wei
  return numAmount > 1000000000;
};

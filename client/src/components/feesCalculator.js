import axios from "axios";

export default async function calculateTransactionCost(transactionResponse) {
  try {
    console.log("gas price:", transactionResponse.gasPrice);
    console.log("gas limit:", transactionResponse.gasLimit);

    const gasPrice = BigInt(transactionResponse.gasPrice); // Gas price in wei
    const gasLimit = BigInt(transactionResponse.gasLimit); // Gas limit

    // Calculate total gas cost in wei
    const gasCostInWei = gasPrice * gasLimit;
    console.log("Gas Cost in Wei:", gasCostInWei.toString());

    // Convert wei to Ether
    const gasCostInEther = Number(gasCostInWei) / 10 ** 18;
    console.log("Gas Cost in Ether:", gasCostInEther);

    // Fetch Ether price in USD and INR
    const ethPriceData = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,inr"
    );
    const ethPriceInUSD = ethPriceData.data.ethereum.usd;
    const ethPriceInINR = ethPriceData.data.ethereum.inr;

    // Calculate total cost in fiat currencies
    const totalCostInUSD = gasCostInEther * ethPriceInUSD;
    const totalCostInINR = gasCostInEther * ethPriceInINR;

    console.log("Gas Cost in USD:", totalCostInUSD);
    console.log("Gas Cost in INR:", totalCostInINR);

    return {
      gasCostInEther,
      totalCostInUSD,
      totalCostInINR,
    };
  } catch (error) {
    console.error("Error calculating transaction cost:", error);
    return null;
  }
}

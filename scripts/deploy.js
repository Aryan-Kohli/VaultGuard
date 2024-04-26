const hre = require("hardhat");

async function main()
{
    const Upload = await hre.ethers.deployContract("Upload2");
    await Upload.waitForDeployment();

    console.log("Upload deployed to:", Upload.target);
}
main().catch((error)=>{
  console.log(error);
  process.exit(1);  
})
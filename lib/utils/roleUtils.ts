import { UserRole } from "@/types/auth";
import BerrySupplyChainClient from "../api/berrySupplyChainClient";

// Addresses could be stored in environment variables or fetched from contract
const MANAGER_ADDRESS = "0xb49dB08aC802D01bF9D46511165C09E7c5C83623";

export async function determineRole(address: string): Promise<UserRole> {
  // Case insensitive comparison for addresses
  const normalizedAddress = address.toLowerCase();
  const normalizedManagerAddress = MANAGER_ADDRESS.toLowerCase();

  // Check if address is the manager
  if (normalizedAddress === normalizedManagerAddress) {
    return UserRole.MANAGER;
  }

  // Check if address is a registered farmer
  const client = new BerrySupplyChainClient();
  try {
    const isFarmer = await checkFarmerRegistration(address);
    if (isFarmer) {
      return UserRole.FARMER;
    }
  } catch (error) {
    console.error("Error checking farmer status:", error);
  }

  // Default to investor role
  return UserRole.INVESTOR;
}

export async function checkFarmerRegistration(
  address: string
): Promise<boolean> {
  // This would actually call your smart contract to check if the address is registered as a farmer
  const client = new BerrySupplyChainClient();

  try {
    // Replace with actual contract call
    const response = await client.callConnectionAction(
      "educhain",
      "check-farmer-status",
      { address }
    );

    return response.is_farmer === true;
  } catch (error) {
    console.error("Error checking farmer status:", error);
    return false;
  }
}

export async function registerFarmer(farmerAddress: string): Promise<boolean> {
  const client = new BerrySupplyChainClient();

  try {
    // Replace with actual contract call
    const response = await client.callConnectionAction(
      "educhain",
      "register-farmer",
      { address: farmerAddress }
    );

    return response.success === true;
  } catch (error) {
    console.error("Error registering farmer:", error);
    return false;
  }
}

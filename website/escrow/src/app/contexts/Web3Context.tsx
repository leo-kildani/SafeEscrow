import { Contract, ethers, JsonRpcProvider, ContractFactory } from "ethers";
import { createContext, ReactNode, useEffect, useState } from "react";
import escrowArtifact from "../../../artifacts/contracts/Escrow.sol/Escrow.json";

interface Web3ContextType {
  provider: JsonRpcProvider | null;
  sellerAccount: string | null;
  deployContract: (itemValue: bigint) => Promise<Contract>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [seller, setSeller] = useState<string | null>(null);

  const initializeProvider = async () => {
    try {
      const hardhatProvider = new JsonRpcProvider("http://127.0.0.1:8545/");
      setProvider(hardhatProvider);

      const accounts = await hardhatProvider.listAccounts();
      const seller = await accounts[
        Math.floor(Math.random() * accounts.length)
      ].getAddress();
      setSeller(seller);
    } catch (error) {
      console.error("Failed to initialize provider", error);
    }
  };

  const deployContract = async (itemValue: bigint) => {
    if (!provider) {
      throw new Error("Provider not specified.");
    }
    if (!seller) {
      throw new Error("Seller not specified.");
    }
    const signer = await provider.getSigner(seller);
    const contractFactory =
      ContractFactory.fromSolidity(escrowArtifact).connect(signer);

    const contract = await contractFactory.deploy(itemValue, {
      value: itemValue * 2n,
    });

    await contract.waitForDeployment();
    return contract;
  };

  useEffect(() => {
    initializeProvider();
  }, []);
}

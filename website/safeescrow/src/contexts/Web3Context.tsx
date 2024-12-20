import { JsonRpcProvider } from "ethers";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Escrow } from "@contract-types/Escrow";
import { Escrow__factory } from "@contract-types/factories/Escrow__factory";

interface Web3ContextType {
  provider: JsonRpcProvider | null;
  seller: string | null;
  getRandomBuyer: () => Promise<string>;
  deployContract: (itemValue: bigint) => Promise<Escrow>;
  getContract: (
    deployedAddress: string,
    signerAddress?: string
  ) => Promise<Escrow>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [seller, setSeller] = useState<string | null>(null);

  const initializeSeller = async (provider: JsonRpcProvider) => {
    const accounts = await provider.listAccounts();
    return await accounts[0].getAddress();
  };

  const initializeProvider = async () => {
    try {
      const hardhatProvider = new JsonRpcProvider("http://127.0.0.1:8545/");
      setProvider(hardhatProvider);

      // Only set seller if not already set
      if (!seller) {
        const sellerAccount = await initializeSeller(hardhatProvider);
        setSeller(sellerAccount);
      }
    } catch (error) {
      console.error("Failed to initialize provider", error);
    }
  };

  const getRandomBuyer = async () => {
    if (!provider) {
      throw new Error("Provider not specified.");
    }
    if (!seller) {
      throw new Error("Seller not specified.");
    }
    const accounts = await provider.listAccounts();
    let buyer;
    do {
      buyer = await accounts[
        Math.floor(Math.random() * accounts.length)
      ].getAddress();
    } while (buyer === seller);
    return buyer;
  };

  const deployContract = async (itemValue: bigint) => {
    if (!provider) {
      throw new Error("Provider not specified.");
    }
    if (!seller) {
      throw new Error("Seller not specified.");
    }

    const signer = await provider.getSigner(seller);
    console.log("Contract seller address:", seller);
    console.log("Signer address:", await signer.getAddress());
    // Use the Escrow__factory to create and deploy the contract
    const factory = new Escrow__factory(signer);
    const contract = await factory.deploy(itemValue, {
      value: itemValue * 2n,
    });

    await contract.waitForDeployment();
    return contract;
  };

  const getContract = async (
    deployedAddress: string,
    signerAddress?: string
  ): Promise<Escrow> => {
    if (!provider) {
      throw new Error("Provider not specified.");
    }
    if (!seller) {
      throw new Error("Seller not specified.");
    }

    // Use the provided signerAddress or fall back to seller
    const actualSigner = signerAddress || seller;
    const signer = await provider.getSigner(actualSigner);

    return Escrow__factory.connect(deployedAddress, signer);
  };

  useEffect(() => {
    initializeProvider();
  }, []);

  const value = {
    provider,
    seller,
    getRandomBuyer,
    deployContract,
    getContract,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
}

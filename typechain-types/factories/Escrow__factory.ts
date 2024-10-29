/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BigNumberish,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { PayableOverrides } from "../common";
import type { Escrow, EscrowInterface } from "../Escrow";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_itemValue",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ContractLocked",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectPaymentAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientContractBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidState",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyBuyer",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlySeller",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DeliveryCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "FundsDistributed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "ItemDelivered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "enum Escrow.PackageState",
        name: "previousState",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum Escrow.PackageState",
        name: "newState",
        type: "uint8",
      },
    ],
    name: "StateChanged",
    type: "event",
  },
  {
    inputs: [],
    name: "buyer",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "buyerDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cancelPurchase",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmDelivery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmPurchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "confirmShipping",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEscrowStatus",
    outputs: [
      {
        internalType: "enum Escrow.PackageState",
        name: "currentState",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "contractBalance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "buyerDepositAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sellerDepositAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "itemValue",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "seller",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "sellerDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "state",
    outputs: [
      {
        internalType: "enum Escrow.PackageState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c0604052604051611977380380611977833981810160405281019061002591906101e0565b6000810361005f576040517f6992e1ff00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b80600261006c919061023c565b34146100a4576040517f6992e1ff00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250508060808181525050346002819055506001600360016101000a81548160ff0219169083600581111561010d5761010c61027e565b5b021790555060a05173ffffffffffffffffffffffffffffffffffffffff167f0b05f0d1cd0819f155b8a61f60baf7767c1ee49d04aeaab701df236140eb93f9344260405161015c9291906102bc565b60405180910390a27fe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d86000600160405161019792919061032d565b60405180910390a150610356565b600080fd5b6000819050919050565b6101bd816101aa565b81146101c857600080fd5b50565b6000815190506101da816101b4565b92915050565b6000602082840312156101f6576101f56101a5565b5b6000610204848285016101cb565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610247826101aa565b9150610252836101aa565b9250828202610260816101aa565b915082820484148315176102775761027661020d565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6102b6816101aa565b82525050565b60006040820190506102d160008301856102ad565b6102de60208301846102ad565b9392505050565b600681106102f6576102f561027e565b5b50565b6000819050610307826102e5565b919050565b6000610317826102f9565b9050919050565b6103278161030c565b82525050565b6000604082019050610342600083018561031e565b61034f602083018461031e565b9392505050565b60805160a0516115bd6103ba60003960008181610258015281816102de015281816106bf0152818161078001528181610b4a01528181610c5c0152610d1f01526000818161061c0152818161064e015281816110ca015261128d01526115bd6000f3fe6080604052600436106100a75760003560e01c80637150d8ae116100645780637150d8ae14610189578063a0579587146101b4578063ab460a26146101df578063c19d93fb146101f6578063d696069714610221578063ff3cc6b01461022b576100a7565b806308551a53146100ac5780634a93e1e1146100d75780634c1786ea146100ee5780635e10177b146101195780636234216d146101305780636f9fb98a1461015e575b600080fd5b3480156100b857600080fd5b506100c1610256565b6040516100ce91906112f0565b60405180910390f35b3480156100e357600080fd5b506100ec61027a565b005b3480156100fa57600080fd5b50610103610474565b6040516101109190611324565b60405180910390f35b34801561012557600080fd5b5061012e61047a565b005b34801561013c57600080fd5b506101456109c4565b60405161015594939291906113b6565b60405180910390f35b34801561016a57600080fd5b506101736109ef565b6040516101809190611324565b60405180910390f35b34801561019557600080fd5b5061019e6109f7565b6040516101ab91906112f0565b60405180910390f35b3480156101c057600080fd5b506101c9610a1b565b6040516101d69190611324565b60405180910390f35b3480156101eb57600080fd5b506101f4610a21565b005b34801561020257600080fd5b5061020b610f7e565b60405161021891906113fb565b60405180910390f35b610229610f91565b005b34801561023757600080fd5b5061024061128b565b60405161024d9190611324565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000081565b600360009054906101000a900460ff16156102c1576040517f6f5ffb7e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600360006101000a81548160ff0219169083151502179055507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610361576040517f85d1f72600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60028060058111156103765761037561133f565b5b600360019054906101000a900460ff1660058111156103985761039761133f565b5b146103cf576040517fbaf3f0f700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600360019054906101000a900460ff16905060038060016101000a81548160ff021916908360058111156104085761040761133f565b5b02179055507fe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d881600360019054906101000a900460ff1660405161044d929190611416565b60405180910390a150506000600360006101000a81548160ff021916908315150217905550565b60025481565b600360009054906101000a900460ff16156104c1576040517f6f5ffb7e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600360006101000a81548160ff02191690831515021790555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610561576040517f86efbb5500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60038060058111156105765761057561133f565b5b600360019054906101000a900460ff1660058111156105985761059761133f565b5b146105cf576040517fbaf3f0f700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001546002546105df919061146e565b471015610618576040517f786e0a9900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60007f000000000000000000000000000000000000000000000000000000000000000060015461064891906114a2565b905060007f000000000000000000000000000000000000000000000000000000000000000060025461067a919061146e565b90506000600360019054906101000a900460ff1690506004600360016101000a81548160ff021916908360058111156106b6576106b561133f565b5b021790555060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168360405161070190611507565b60006040518083038185875af1925050503d806000811461073e576040519150601f19603f3d011682016040523d82523d6000602084013e610743565b606091505b505090508061077e576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff167f080babe757d4e5c7db3b7bd10606a7bf07a9857f660977ada6ca7a4d329376c884426040516107e692919061151c565b60405180910390a260008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168560405161083590611507565b60006040518083038185875af1925050503d8060008114610872576040519150601f19603f3d011682016040523d82523d6000602084013e610877565b606091505b50509050806108b2576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f080babe757d4e5c7db3b7bd10606a7bf07a9857f660977ada6ca7a4d329376c8864260405161091a92919061151c565b60405180910390a27fd2f1cdd76b4e7bfba9c07af47c5c4f187ffbbd992b4fa1afce4df6a00a166e85426040516109519190611324565b60405180910390a17fe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d883600360019054906101000a900460ff16604051610999929190611416565b60405180910390a15050505050506000600360006101000a81548160ff021916908315150217905550565b600080600080600360019054906101000a900460ff1647600154600254935093509350935090919293565b600047905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b600360009054906101000a900460ff1615610a68576040517f6f5ffb7e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600360006101000a81548160ff0219169083151502179055506002806005811115610a9857610a9761133f565b5b600360019054906101000a900460ff166005811115610aba57610ab961133f565b5b14610af1576040517fbaf3f0f700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614158015610b9957507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614155b15610bd0576040517fe6c4247b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600154600254610be0919061146e565b471015610c19576040517f786e0a9900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000600360019054906101000a900460ff1690506005600360016101000a81548160ff02191690836005811115610c5357610c5261133f565b5b021790555060007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16600254604051610ca090611507565b60006040518083038185875af1925050503d8060008114610cdd576040519150601f19603f3d011682016040523d82523d6000602084013e610ce2565b606091505b5050905080610d1d576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff167f080babe757d4e5c7db3b7bd10606a7bf07a9857f660977ada6ca7a4d329376c860025442604051610d8792919061151c565b60405180910390a260008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600154604051610dd890611507565b60006040518083038185875af1925050503d8060008114610e15576040519150601f19603f3d011682016040523d82523d6000602084013e610e1a565b606091505b5050905080610e55576040517f90b8ec1800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f080babe757d4e5c7db3b7bd10606a7bf07a9857f660977ada6ca7a4d329376c860015442604051610ebf92919061151c565b60405180910390a23373ffffffffffffffffffffffffffffffffffffffff167fccc59847af7a167ec8b2425941698e5398a4eab0218fa343acee62e5f01f564342604051610f0d9190611324565b60405180910390a27fe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d883600360019054906101000a900460ff16604051610f55929190611416565b60405180910390a1505050506000600360006101000a81548160ff021916908315150217905550565b600360019054906101000a900460ff1681565b600360009054906101000a900460ff1615610fd8576040517f6f5ffb7e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600360006101000a81548160ff02191690831515021790555060018060058111156110085761100761133f565b5b600360019054906101000a900460ff16600581111561102a5761102961133f565b5b14611061576040517fbaf3f0f700000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b33600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036110c8576040517fe6c4247b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000060026110f59190611545565b341461112d576040517f6992e1ff00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550346001819055506000600360019054906101000a900460ff1690506002600360016101000a81548160ff021916908360058111156111ae576111ad61133f565b5b021790555060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f0b05f0d1cd0819f155b8a61f60baf7767c1ee49d04aeaab701df236140eb93f9344260405161121b92919061151c565b60405180910390a27fe8a97ea87e4388fa22d496b95a8ed5ced6717f49790318de2b928aaf37a021d881600360019054906101000a900460ff16604051611263929190611416565b60405180910390a15050506000600360006101000a81548160ff021916908315150217905550565b7f000000000000000000000000000000000000000000000000000000000000000081565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006112da826112af565b9050919050565b6112ea816112cf565b82525050565b600060208201905061130560008301846112e1565b92915050565b6000819050919050565b61131e8161130b565b82525050565b60006020820190506113396000830184611315565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b6006811061137f5761137e61133f565b5b50565b60008190506113908261136e565b919050565b60006113a082611382565b9050919050565b6113b081611395565b82525050565b60006080820190506113cb60008301876113a7565b6113d86020830186611315565b6113e56040830185611315565b6113f26060830184611315565b95945050505050565b600060208201905061141060008301846113a7565b92915050565b600060408201905061142b60008301856113a7565b61143860208301846113a7565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006114798261130b565b91506114848361130b565b925082820190508082111561149c5761149b61143f565b5b92915050565b60006114ad8261130b565b91506114b88361130b565b92508282039050818111156114d0576114cf61143f565b5b92915050565b600081905092915050565b50565b60006114f16000836114d6565b91506114fc826114e1565b600082019050919050565b6000611512826114e4565b9150819050919050565b60006040820190506115316000830185611315565b61153e6020830184611315565b9392505050565b60006115508261130b565b915061155b8361130b565b92508282026115698161130b565b915082820484148315176115805761157f61143f565b5b509291505056fea2646970667358221220e6bae1f4d22d7040d55341658a19f14d2aa5961fbbd90d5502b31f9b9661855e64736f6c634300081c0033";

type EscrowConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EscrowConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Escrow__factory extends ContractFactory {
  constructor(...args: EscrowConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _itemValue: BigNumberish,
    overrides?: PayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_itemValue, overrides || {});
  }
  override deploy(
    _itemValue: BigNumberish,
    overrides?: PayableOverrides & { from?: string }
  ) {
    return super.deploy(_itemValue, overrides || {}) as Promise<
      Escrow & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): Escrow__factory {
    return super.connect(runner) as Escrow__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EscrowInterface {
    return new Interface(_abi) as EscrowInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): Escrow {
    return new Contract(address, _abi, runner) as unknown as Escrow;
  }
}
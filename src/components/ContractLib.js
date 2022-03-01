import Web3 from "web3";
import IBEP20 from "../contracts/abi/IBEP20.json";
import FUND_ME from "../contracts/abi/FUND_ME.json";

const web3 = new Web3(window.ethereum)

export const pancake_contract = new web3.eth.Contract(IBEP20, '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82');

export const fund_me_contract = new web3.eth.Contract(FUND_ME, "0x301AC83E3DFCeCAe49C1d4096587255f3201FFd5");

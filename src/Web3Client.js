import Web3 from "web3";
import IBEP20 from "./contracts/abi/IBEP20.json";

let selectedAccount;
let pancake_contract;
let isInitialized = false;
let web3;

export const init = async () => {
    let provider = window.ethereum;
    if (typeof provider !== 'undefined') {
        provider.request({ method: 'eth_requestAccounts' }).then(accounts => {
            selectedAccount = accounts[0]
        }).catch(err => {
            console.log(err);
            return
        })

        window.ethereum.on('accountsChanged', function (accounts) {
            selectedAccount = accounts[0]
        })
    }

    web3 = new Web3(provider)
    const networkId = await web3.eth.net.getId()

    const pancake_address = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
    pancake_contract = new web3.eth.Contract(IBEP20, pancake_address)
    isInitialized = true
    return web3
}

export const balanceOf = async (address, token = 'bnb') => {
    web3 = new Web3(window.ethereum)
    if (!isInitialized) {
        await init()
    }
    if (token == 'pancake') {
        return pancake_contract.methods.balanceOf(address).call().then(balance => {
            return Web3.utils.fromWei(balance);
        });
    } else if (token == 'bnb') {
        return web3.eth.getBalance(address).then(balance => {
            return Web3.utils.fromWei(balance)
        })

    }

}

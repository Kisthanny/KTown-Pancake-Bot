import Web3 from "web3";
const web3 = new Web3(window.ethereum)
export function getPrivateWallet() {
    const private_arr = JSON.parse(localStorage.getItem('KTown-Private'))
    if (!private_arr) {
        return []
    }
    let privateAccount_list = []
    private_arr.forEach(privateKey => {
        privateAccount_list.push(web3.eth.accounts.privateKeyToAccount(privateKey))
    });
    return privateAccount_list
}

export function getPublicWallet() {
    const address_arr = JSON.parse(localStorage.getItem('KTown-Public'))
    if (!address_arr) {
        return []
    }
    let publicAccount_list = []
    address_arr.forEach(address => {
        publicAccount_list.push({ address: address })
    });
    return publicAccount_list
}
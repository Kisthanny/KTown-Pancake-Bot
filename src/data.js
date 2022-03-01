import Web3 from "web3";
const web3 = new Web3(window.ethereum)
export function getWallet() {
    const pkArr = JSON.parse(localStorage.getItem('test_Account'))
    if (!pkArr) {
        return []
    }
    let account_list = []
    for (let index = 0; index < pkArr.length; index++) {
        const pk = pkArr[index];
        account_list.push(web3.eth.accounts.privateKeyToAccount(pk))
    }
    return account_list
}

export function getAddressBook() {
    const address_arr = JSON.parse(localStorage.getItem('public_address'))
    if (!address_arr) {
        return []
    }
    let address_book = []
    for (let index = 0; index < address_arr.length; index++) {
        const address = address_arr[index];
        address_book.push({ address: address })
    }
    return address_book
}
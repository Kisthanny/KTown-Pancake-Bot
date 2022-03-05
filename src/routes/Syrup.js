import { ContractTable } from "../components/ContractTable";
import { getPrivateWallet } from "../data";
export default function Syrup() {
    const privateWallet = getPrivateWallet()
    return (
        <ContractTable privateWallet={privateWallet}></ContractTable>
    );
}
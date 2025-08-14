import { useAppSelector } from "@/hooks/rtk"
import Deposit from "./deposit"
import Withdraw from "./withdraw"
import WithdrawInfo from "./withdraw-info"


const Modals = () => {
    const modal = useAppSelector(state => state.shared.modal)

    if (!modal) return null

    if (modal === 'deposit') return <Deposit />
    if (modal === 'withdraw') return <Withdraw />
    if (modal === 'withdraw-info') return <WithdrawInfo />

    return <></>
}

export default Modals
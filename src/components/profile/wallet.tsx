import "./wallet.css"
import LockIcon  from "@/assets/icons/lock.svg?react"
import CashBackIcon  from "@/assets/icons/cashback-wallet.svg?react"
import InfoIcon  from "@/assets/icons/info.svg?react"
import { useAppDispatch, useAppSelector } from "@/hooks/rtk";
import type { User, Wallet } from "@/types/auth";
import { currencyList } from "@/utils/currencyList";
import { useSetDefaultWalletMutation } from "@/services/authApi";
import { toast } from "react-toastify";
import { setModal } from "@/slices/sharedSlice";


const WalletPage = () => {
  
  const user: User = useAppSelector(state => state?.auth?.user)
  const [setDefaultWallet, { isLoading }] = useSetDefaultWalletMutation()
  const dispatch = useAppDispatch()

  return <div className="wallet-page">
    <div className="PageSectionTitle WalletTitle">
      <div className="PageSectionTitle-Content">
        <p
          className="m-text m-fs18 m-fw600 m-lh140"
          style={{ color: "var(--color-light-grey-5)" }}
        >
          <div>Wallet</div>
        </p>
      </div>
    </div>
    <div className="wallet-page-row">
      {user.wallets?.map((w: Wallet) => <div className="WalletCard">
        <div className="WalletCard-Content">
          <div className="WalletCardHeader">
            <button className="WalletCardHeader-Currency">
              {w.slug.toUpperCase()}
            </button>
            <div className="m-dropdown withdrawal-limits-tooltip">
              <div className="m-dropdown-activator">
                <button
                  className={`withdrawal-limits-tooltip__btn m-button m-gradient-border m-button--${w.default ? 'primary' : 'secondary'} m-button--m`}
                  onClick={() => {
                    if (w.default) {
                      toast.warn(('This wallet is already default'));
                      return;
                    }
                    setDefaultWallet({
                      currency: w.slug.toUpperCase()
                    })
                  }}
                  disabled={isLoading}
                >
                  <p
                    className="m-text m-fs10 m-fw700 m-lh160"
                    style={{ color: "var(--color-mid-grey-3)" }}
                  >
                    {w.default ? <div>Default</div> : <div>Set default</div>}
                  </p>
                  <InfoIcon className="m-icon m-icon-loadable" />
                </button>
              </div>
            </div>

          </div>
          <div className="WalletCardAmount">
            <div className="WalletCardAmount-Title"><div>Total balance</div></div>
            <div className="WalletCardAmount-Balance TextOverflow">{(+w.balance / 100).toLocaleString('en-EN', {
              minimumFractionDigits: w.decimal_places,
              maximumFractionDigits: w.decimal_places,
            })} {' '}
              {/* @ts-ignore */}
              {currencyList[w.slug.toUpperCase()].symbol_native}</div>
          </div>
          <div id="wallet-footer" className="WalletCardActions">
            <button 
              disabled={!w.limits.can_pay_with_now_payments}
              onClick={() => dispatch(setModal({
                modal: 'withdraw'
              }))} 
              className="m-button m-gradient-border m-button--secondary m-button--m WalletCardActions-Btn">
              <div className="m-button-content"><div>Withdraw</div></div>
            </button>
            <button
              disabled={!w.limits.can_pay_with_now_payments}
              onClick={() => dispatch(setModal({
                modal: 'deposit'
              }))} 
              className="m-button m-gradient-border m-button--primary m-button--m WalletCardActions-Btn">
              <div className="m-button-content"><div>Deposit</div></div>
            </button>
          </div>
        </div>
        <div className="WalletCardFooter">
          <div className="WalletCardFooter-Column">
            <div className="WalletCardFooter-Text"><div>Real money</div></div>
            <div className="WalletCardFooter-Amount TextOverflow">
              <CashBackIcon className="m-icon m-icon-loadable" />
              {(+w.balance / 100).toLocaleString('en-EN', {
                minimumFractionDigits: w.decimal_places,
                maximumFractionDigits: w.decimal_places,
              })} {" "}
              {/* @ts-ignore */}
              {currencyList[w.slug.toUpperCase()].symbol_native}
            </div>
          </div>
          <div className="WalletCardFooter-Column">
            <div className="WalletCardFooter-Text"><div>Bonus money</div></div>
            <div className="WalletCardFooter-Amount TextOverflow">
              <LockIcon className="m-icon m-icon-loadable" />
              0.00
            </div>
          </div>
        </div>
      </div>)}
    </div>
  </div>
}

export default WalletPage
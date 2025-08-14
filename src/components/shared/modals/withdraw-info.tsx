
;
import InfoBlockIcon  from '@/assets/icons/infoblock.svg?react';
import Modal from "../modal";
import { useAppDispatch } from "@/hooks/rtk";
import { setModal } from "@/slices/sharedSlice";

const WithdrawInfo = () => {
    const dispatch = useAppDispatch();
    
    return <Modal title={`Withdraw`} onClose={() => dispatch(setModal({ modal: null }))}>

        <div className="m-info-block m-info-block--large m-info-block--secondary deposit-section">
            <div className="m-info-block-icon m-info-warning-color">
                <InfoBlockIcon className="m-icon m-icon-loadable" />
            </div>
        </div>
        <h2
            className="m-text m-fs28 m-fw600 m-lh160 m-text-center play-demo-modal__title"
            style={{ color: "var(--color-white)" }}
        >
            <div>Withdraw is under review!</div>
        </h2>
        <p
            className="m-text m-fs18 m-fw500 m-lh140 m-text-center"
            style={{ color: "var(--color-mid-grey-5)" }}
        >
            <div>Soon you will receive information for your funds status!</div>
        </p>

        <div className="m-modal-footer">
            <button onClick={() => dispatch(setModal({ modal: null }))} className="m-button m-gradient-border m-button--secondary m-button--m">
                <div className="m-button-content"><div>Okay</div></div>
            </button>
        </div>
    </Modal>
}

export default WithdrawInfo
import {ChevronLeftIcon} from "lucide-react";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";
import AgentPaymentTable from "@/components/profile/profile/AgentPaymentTable.tsx";

const AgentPayments = () => {
    const navigate = useNavigate();

    return (
        <section className={"min-h-screen text-black bg-background"}>
            <div className="container m-0 mx-auto flex w-full min-h-screen flex-col gap-2 text-[12px]">
                <div className={'h-10  flex  text-muted bg-background border-b border-b-popover items-center'}>
                    <div className={'w-10 h-full border-r border-popover flex items-center'} onClick={()=>navigate(-1)}>
                        <ChevronLeftIcon className={'w-10'} />
                    </div>
                    <div className={'w-full text-center text-base pr-10 space-x-1 flex justify-center'}>
                        <Trans>Payments</Trans>
                    </div>
                </div>
                <AgentPaymentTable/>
            </div>
        </section>

    );
};

export default AgentPayments;

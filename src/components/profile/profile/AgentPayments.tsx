import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";
import {TicketCheck, X} from "lucide-react";
import AgentPaymentTable from "@/components/profile/profile/AgentPaymentTable.tsx";
import Footer from "@/components/shared/v2/footer.tsx";

const AgentPayments = () => {
    const navigate = useNavigate();

    return (
        <section className={"min-h-screen w-full bg-[var(--grey-600)] flex flex-col justify-between"}>
            <div className={'min-h-max w-[calc(94dvw_-_60px)] max-w-300 ml-auto mr-[3dvw] min-[1440px]:mr-auto flex flex-col items-center py-0'}>
                <div className={'h-10 w-full flex items-center mt-6'}>
                    <div className={'w-max text-2xl font-bold text-white text-center pr-10 space-x-1 flex gap-1 justify-center mr-auto'}>
                        <TicketCheck className={'ml-1 mt-0.5 size-8 text-[var(--grey-100)]'}/>
                        <p><Trans>Payments</Trans></p>
                    </div>
                    <div className={'w-10 h-full text-[var(--grey-200)] hover:text-white flex items-center'} onClick={()=>navigate(-1)}>
                        <X className={'w-10'} />
                    </div>
                </div>
                <AgentPaymentTable/>
            </div>
            <Footer />
        </section>

    );
};

export default AgentPayments;

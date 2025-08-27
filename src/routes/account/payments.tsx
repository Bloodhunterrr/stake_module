import { ChevronLeft } from "lucide-react";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";
import PaymentsHistoryTable from "@/components/profile/v2/payments-history-table";

const PaymentsHistoryPage = () => {
  const navigate = useNavigate();

  return (
      <section className={"bg-white"}>
          <div className="container m-0 mx-auto flex w-full min-h-screen bg-white flex-col gap-2 text-[12px]">
              <div className="flex items-center gap-2 pt-5 text-base font-medium text-accent-foreground">
                  <ChevronLeft size={18} onClick={() => navigate(-1)}/>
                  <Trans>Payments History</Trans>
              </div>

              <PaymentsHistoryTable/>
          </div>
      </section>

  );
};

export default PaymentsHistoryPage;

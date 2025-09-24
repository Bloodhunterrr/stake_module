import { ChevronLeftIcon } from "lucide-react";
import { Trans } from "@lingui/react/macro";
import { useNavigate } from "react-router-dom";
import PaymentsHistoryTable from "@/components/profile/v2/payments-history-table";

const PaymentsHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <section className={"bg-white"}>
      <div className="container m-0 mx-auto flex w-full min-h-screen bg-white flex-col gap-3 text-[12px]">
        <div className={"h-14  flex  items-center"}>
          <div
            className={"w-10 h-full  text-black flex items-center"}
            onClick={() => navigate(-1)}
          >
            <ChevronLeftIcon className={"w-10"} />
          </div>
          <div
            className={
              "w-full  text-start text-black  text-lg pr-10 space-x-1 flex justify-start"
            }
          >
            <Trans>Payments History</Trans>
          </div>
        </div>

        <PaymentsHistoryTable />
      </div>
    </section>
  );
};

export default PaymentsHistoryPage;

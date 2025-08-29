import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Trans } from "@lingui/react/macro";
import CasinoHistoryTable from "@/components/profile/v2/casino-history-table";

const CasinoHistoryPage = () => {
  const navigate = useNavigate();

  return (
      <section className={"bg-white"}>
          <div className="container mx-auto flex w-full min-h-screen flex-col gap-2  text-[12px]">
              <div className="flex items-center gap-2 pt-5 text-base font-medium text-accent-foreground">
                  <ChevronLeft size={18} onClick={() => navigate(-1)}/>
                  <Trans>Casino History</Trans>
              </div>

              <CasinoHistoryTable/>
          </div>
      </section>

  );
};

export default CasinoHistoryPage;

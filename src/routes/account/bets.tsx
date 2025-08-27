import {Trans} from "@lingui/react/macro";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import BettingHistoryTable from "@/components/profile/v2/betting-history-table";

const BetsHistoryPage = () => {
  const navigate = useNavigate();

  return (
      <section className={'bg-white'}>
          <div className="container m-0 mx-auto flex w-full min-h-screen  bg-white flex-col gap-2  text-[12px]">
              <div className="flex items-center gap-2 pt-5 text-base font-medium text-accent-foreground">
                  <ChevronLeft size={18} onClick={() => navigate(-1)}/>
                  <Trans>Betting History</Trans>
              </div>
              <BettingHistoryTable/>
          </div>
      </section>

  );
};

export default BetsHistoryPage;

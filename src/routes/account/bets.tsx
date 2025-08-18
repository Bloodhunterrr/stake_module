import BettingHistoryTable from "@/components/profile/v2/betting-history-table";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

const BetsHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container m-0 mx-auto flex w-full min-h-screen  bg-white flex-col gap-2  text-[12px]">
      <div className="flex items-center gap-2 px-2 pt-10 text-base font-medium text-accent-foreground">
        <ChevronLeft size={18} onClick={() => navigate(-1)} />
        Betting History
      </div>
      <BettingHistoryTable />
    </div>
  );
};

export default BetsHistoryPage;

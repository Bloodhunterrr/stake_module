import CasinoHistoryTable from "@/components/profile/v2/casino-history-table";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

const CasinoHistoryPage = () => {
  const navigate = useNavigate();

  return (
      <section className={"bg-white"}>
          <div className="container mx-auto flex w-full min-h-screen flex-col gap-2  text-[12px]">
              <div className="flex items-center gap-2 px-2 pt-10 text-base font-medium text-accent-foreground">
                  <ChevronLeft size={18} onClick={() => navigate(-1)}/>
                  Casino History
              </div>

              <CasinoHistoryTable/>
          </div>
      </section>

  );
};

export default CasinoHistoryPage;

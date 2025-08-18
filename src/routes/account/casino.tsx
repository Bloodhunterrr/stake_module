import CasinoHistoryTable from "@/components/shared/v2/profile/casino-history-table";

const CasinoPageHistory = () => {
  return (
    <div className="container m-0 mx-auto flex w-full min-h-screen  bg-white flex-col gap-2  text-[12px]">
      <div className="text-lg px-5 pt-10 font-medium text-accent-foreground">Casino</div>
      <CasinoHistoryTable />
    </div>
  );
};

export default CasinoPageHistory;

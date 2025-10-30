import { useState } from "react";
import type { Subcategory } from "@/types/main";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SearchIcon } from "lucide-react";
import Search from "@/components/shared/v2/casino/search.tsx";
import LobbyBannerSlider from "@/components/casino/lobbyBannerSlider";
import { Trans } from "@lingui/react/macro";

type Props = {
  data: Record<string, { subcategories: Subcategory[] }>[];
  paramsSubcategory?: string;
  showBanner?: boolean;
  searchClassName?: string;
};

const SubcategorySlider = ({
  showBanner = false,
  searchClassName,
}: Props) => {
  const [searchModal, setSearchModal] = useState(false);

  return (
    <>
      <div onClick={() => setSearchModal(true)}
        className={`relative flex items-center gap-4 pl-3.5 px-3 h-12 rounded-lg bg-[var(--grey-700)]
        border-2 border-solid border-[var(--grey-400)] lg:hover:border-[var(--grey-300)]
        transition-all duration-[0.25s] w-full${searchClassName ? ` ${searchClassName}` : ""}`}>
        <SearchIcon className="size-5 text-[var(--grey-300)]" />
        <span className={"font-normal text-md text-[#566671]"}>
          <Trans>Search your game or event</Trans>
        </span>
      </div>
      {showBanner && (
        <div className={"pt-10 lg:pb-3 container mx-auto"}>
          <LobbyBannerSlider />
        </div>
      )}

      <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
        <DialogContent
          showCloseButton={false}
          className="border-none rounded-none pt-0 px-3.5 overflow-y-auto shrink-0 p-0 top-[calc(50%_+_30px)] left-[calc(50%_+_30px)] z-100 grid w-[calc(100%-60px)] max-w-[calc(100%-60px)] min-w-[calc(100%-60px)] max-md:left-1/2 max-md:w-full max-md:max-w-full max-md:min-w-full !h-[calc(100%-60px)] translate-x-[-50%] translate-y-[-50%]">
          <Search setSearchModal={setSearchModal}
            onCloseSearchModal={() => setSearchModal(false)}/>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubcategorySlider;

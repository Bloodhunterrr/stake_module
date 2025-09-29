import Search from "./search";
import config from "@/config";
import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import type { Subcategory } from "@/types/main";
import { useNavigate, useParams } from "react-router";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import FeedbackIcon from "@/assets/icons/feedback-category-icon.svg?react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type Props = {
  data: Record<string, { subcategories: Subcategory[] }>[];
};

export default function SubcategorySlider({ data }: Props) {
  const [searchModal, setSearchModal] = useState(false);
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  const selectedCategory = data.find(
    (entry) => Object.keys(entry)[0] === categorySlug
  );

  const subcategories = selectedCategory?.[categorySlug as string]?.subcategories ?? [];

  if (subcategories.length <= 1) {
    return null;
  }

  return (
    <>
      <section className="space-y-4">
        <Carousel opts={{
            align: "start",
            loop: false,
          }} className="w-full" >
          <CarouselContent>
            {subcategories.map((subcategory: Subcategory) => (
              <CarouselItem key={subcategory.id}
                className="basis-full sm:basis-1/2 md:basis-1/4 lg:basis-1/7 pl-2"
                onClick = {() => navigate(`/${categorySlug}/games/${subcategory.slug}`) }>
                <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition">
                  {subcategory.icon && (
                    <img src={`${config.baseUrl}/storage/${subcategory.icon}`}
                      alt={subcategory.name}
                      className="w-8 h-8 object-contain shrink-0"/>
                  )}
                  <span className="text-sm">{subcategory.name}</span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div onClick={() => setSearchModal(true)}
          className="flex items-center gap-2 mt-4 cursor-pointer p-3 border rounded-lg hover:bg-accent transition">
          <FeedbackIcon className="w-6 h-6" />
          <Trans>Providers</Trans>
        </div>
      </section>

      <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
        <DialogContent className="overflow-auto max-h-[80%]">
          <DialogTitle><Trans>Search</Trans></DialogTitle>
          <Search onCloseSearchModal={() => setSearchModal(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
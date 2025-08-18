import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Subcategory } from "@/types/main";
import { Dialog  , DialogContent} from "@/components/ui/dialog";
import {cn} from "@/lib/utils.ts";
import { SearchIcon } from 'lucide-react';
import Search from "@/components/shared/v2/casino/search.tsx";
type Props = {
    data: Record<string, { subcategories: Subcategory[] }>[];
    paramsSubcategory?: string;
};

const SubcategorySlider = ({ data , paramsSubcategory }: Props) => {
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
            <div
                onClick={() => setSearchModal(true)}
                className="flex h-10  rounded-full items-center gap-2 mt-4 cursor-pointer px-3 bg-popover  hover:bg-popover/80 transition"
            >
                <SearchIcon className="size-5"/>
                <span className={'font-semibold text-sm'}>Search</span>
            </div>
            <section className="space-y-4 sticky top-0">
                <div className={'flex items-center justify-center w-full'}>
                    <div className="overflow-x-auto items-center  no-scrollbar flex py-5">
                        <div
                            className={cn("w-fit ml-3 shrink-0  text-[11px] cursor-pointer  ", {
                                "decoration-2 text-card underline underline-offset-8 ": paramsSubcategory === undefined
                            })}
                            onClick={() =>
                                navigate(`/${categorySlug}`)
                            }
                        >
                            {"All"}
                        </div>
                        {
                            subcategories.map((subcategory: Subcategory, index: number) => {
                                    return (
                                        <div
                                            key={subcategory.id}
                                            className={cn("w-fit ml-3 shrink-0  text-[11px] cursor-pointer ", {
                                                "ml-3": index === 0,
                                                "mr-3": index === subcategories.length - 1,
                                                "decoration-2 text-card underline underline-offset-8 ": subcategory.slug === paramsSubcategory
                                            })}
                                            onClick={() =>
                                                navigate(`/${categorySlug}/games/${subcategory.slug}`)
                                            }
                                        >
                                            {subcategory.name}
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div>


            </section>

            <Dialog open={searchModal} onOpenChange={() => setSearchModal(false)}>
                <DialogContent
                    showCloseButton={false}
                    className="border-none rounded-none pt-0 px-3.5 overflow-y-auto shrink-0 max-w-screen w-full h-full scale-100 ">
                    <Search setSearchModal={setSearchModal} onCloseSearchModal={() => setSearchModal(false)}/>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default SubcategorySlider;

import type {Subcategory} from "@/types/main.ts";

interface CategoriesSliderProps {
    categories: {
        subcategories: Subcategory[];
    };
    onSubcategoryClick?: (subcategoryId: string | null) => void;
    activeSubcategory?: string | null;
    casino?: string | null;
}

export default function CategoriesSlider({ categories, onSubcategoryClick, activeSubcategory, casino }: CategoriesSliderProps) {
    return (
        <div className="bg-[var(--grey-700)] p-1.5 rounded-full overflow-auto scrollX">
            <div className="relative flex gap-3">
                {/* All Categories Button */}
                <div className={`inline-flex relative items-center gap-2 justify-center py-[0.625rem] px-[1.25rem] rounded-full 
                                ${!activeSubcategory ? 'bg-[var(--grey-400)] ' : 'bg-transparent'} 
                                lg:hover:bg-[var(--grey-400)] text-white [&_svg]:text-white cursor-pointer capitalize`}
                    onClick={() => onSubcategoryClick?.(null)}>
                    All {casino?.replaceAll("-"," ")}
                </div>

                {/* Subcategory Buttons */}
                {categories?.subcategories.map((subcategory, index) => (
                    <CategoryBtn
                        key={index}
                        subcategory={subcategory}
                        isActive={activeSubcategory === subcategory.id.toString()}
                        onClick={() => onSubcategoryClick?.(subcategory.id.toString())}
                    />
                ))}
            </div>
        </div>
    );
}

const CategoryBtn = ({
                         subcategory,
                         isActive,
                         onClick
                     }: {
    subcategory: Subcategory;
    isActive: boolean;
    onClick: () => void;
}) => {
    return (
        <div className={`inline-flex relative items-center gap-2 justify-center py-[0.625rem] px-[1.25rem] rounded-full 
                         ${isActive ? 'bg-[var(--grey-400)]' : 'bg-transparent'} 
                         lg:hover:bg-[var(--grey-400)] text-white [&_svg]:text-white cursor-pointer capitalize`}
            onClick={onClick}>
            {subcategory.name}
        </div>
    );
}
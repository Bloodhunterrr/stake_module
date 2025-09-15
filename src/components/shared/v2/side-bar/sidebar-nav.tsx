import config from "@/config.ts";
import type { Routes } from "@/types/main.ts";
import { Button } from "@/components/ui/button.tsx";

type SidebarNavProps = {
  sidebarOpen: boolean;
  data?: Routes[];
  categorySlug?: string;
  onNavigate: (url: string) => void;
};

export default function SidebarNav({
  sidebarOpen,
  data,
  categorySlug,
  onNavigate,
}: SidebarNavProps) {
  return (
    <nav className="flex flex-col space-y-1">
      {data?.map((category) => {
        const hasSubcategories = category.subcategories?.length > 0;
        if (!category.is_sportbook && !hasSubcategories) {
          return null;
        }

        const handleCategoryClick = () => onNavigate(`/${category.slug}`);
        const isActiveCategory = categorySlug === category.slug;

        return (
          <div key={category.id} className="group bg-primary/60 text-white rounded-sm">
            <Button
              variant="ghost"
              className={`w-full justify-start rounded-lg font-normal transition-all duration-300
                ${
                  sidebarOpen
                    ? "px-3 py-2"
                    : "px-0 py-2 w-12 h-12 justify-center"
                }
                ${
                  isActiveCategory
                    ? "bg-primary text-white"
                    : "hover:bg-popover hover:text-white"
                }`}
              onClick={handleCategoryClick}
            >
              {category.icon && (
                <img
                  src={config.baseUrl + "/storage/" + category.icon}
                  alt={category.name}
                  width={20}
                  height={20}
                  className={`${sidebarOpen ? "mr-3" : ""} shrink-0`}
                />
              )}
              {sidebarOpen && <span className="truncate">{category.name}</span>}
            </Button>

            {/* {hasSubcategories && sidebarOpen && (
              <ul className="pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                {!category.is_sportbook && (
                  <li
                    className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={handleCategoryClick}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Lobby</span>
                  </li>
                )}
                {category.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center space-x-2 py-1 px-2 rounded-md hover:bg-accent cursor-pointer"
                    onClick={() =>
                      onNavigate(`/${category.slug}/games/${sub.slug}`)
                    }
                  >
                    {sub.icon && (
                      <img
                        src={config.baseUrl + "/storage/" + `/${sub.icon}`}
                        alt={sub.name}
                        width={16}
                        height={16}
                      />
                    )}
                    <span>{sub.name}</span>
                  </li>
                ))}
              </ul>
            )} */}
          </div>
        );
      })}
    </nav>
  );
}


import React from "react";

export type HeaderProps = {
    isDesktop: boolean;
    sideBarOpen: boolean;
    toggleSideBar: React.Dispatch<React.SetStateAction<boolean>>;
    openOptionalSideBar: boolean;
    setOpenOptionalSideBar: React.Dispatch<React.SetStateAction<boolean>>;
    location: string;
    isNoCategoryOrSportsbook: boolean;
};

export type Category = {
    id: number;
    slug: string;
    name: string;
    icon: string;
    is_sportbook: boolean;
    subcategories: any[];
};

export type SidebarProps = {
    data: Category[] | undefined;
    location: string;
    isHovered: boolean;
    setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
    filterStyle: React.CSSProperties;
    handleMouseEnter: (e: React.MouseEvent<HTMLButtonElement>, R: Category) => void;
    handleMouseLeave: (e: React.MouseEvent<HTMLButtonElement>, R: Category) => void;
    showPopupId: number | null;
    popupTop: number | null;
    headersTranslations: Record<string, any>;
    accordionValue: string;
    setAccordionValue: React.Dispatch<React.SetStateAction<string>>;
};

export type ProfileDropdownProps = {
    user: import("@/types/auth").User;
    showBalance: boolean;
    toggleShowBalance: () => void;
    isNoCategoryOrSportsbook: boolean;
    isDesktop: boolean;
};
// components/header/AuthModals.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Login from "@/components/shared/v2/login";
import SignUp from "@/components/shared/v2/signup";
import Search from "@/components/casino/search";
import { Trans } from "@lingui/react/macro";
import type { Dispatch, SetStateAction } from "react";

interface AuthModalsProps {
    loginModalOpen: boolean;
    setLoginModalOpen: Dispatch<SetStateAction<boolean>>;
    signUpModalOpen: boolean;
    setSignUpModalOpen: Dispatch<SetStateAction<boolean>>;
    searchModalOpen: boolean;
    setSearchModalOpen: Dispatch<SetStateAction<boolean>>;
    openOptionalSideBar: boolean;
}

export default function AuthModals({
                                       loginModalOpen,
                                       setLoginModalOpen,
                                       signUpModalOpen,
                                       setSignUpModalOpen,
                                       searchModalOpen,
                                       setSearchModalOpen,
                                       openOptionalSideBar
                                   }: AuthModalsProps) {
    return (
        <>
            <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
                <DialogContent showCloseButton={false}
                    overlayClassName={cn("bg-black/75 mt-[44px] lg:mt-15", {
                        "mt-[88px] lg:mt-15": openOptionalSideBar,
                    })}
                    className={cn("rounded-md bg-cover border-transparent bg-center fixed w-full min-w-[200px] " +
                        "flex flex-col overflow-hidden max-w-[630px] sm:max-w-[630px] h-full max-h-[716px] p-0 " +
                        "-translate-1/2 top-1/2 left-1/2",)}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}>
                    <Login setLoginModalOpen={setLoginModalOpen} />
                </DialogContent>
            </Dialog>

            <Dialog open={signUpModalOpen} onOpenChange={setSignUpModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <SignUp />
                </DialogContent>
            </Dialog>

            <Dialog open={searchModalOpen} onOpenChange={setSearchModalOpen}>
                <DialogContent className="overflow-auto w-full h-full">
                    <DialogHeader>
                        <DialogTitle>
                            <Trans>Search</Trans>
                        </DialogTitle>
                    </DialogHeader>
                    <Search onCloseSearchModal={() => setSearchModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}
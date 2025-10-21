import { Trans } from "@lingui/react/macro";
import LanguageSwitcher from "@/components/shared/v2/language-switcher.tsx";
import logo from "@/assets/images/logo.svg";


export default function Footer() {
    return (
        <section className="w-full md:w-[calc(100vw-60px)] ml-auto bg-[var(--grey-800)] relative bottom-0">
            <div className="w-[calc(94dvw_-_60px)] mx-auto pb-8">
                <nav className="border-b-2 border-[var(--grey-500)] mb-10 py-2.5 sm:py-[30px] pb-[20px]">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-y-6">
                        <div className="grid gap-3 gap-x-6 text-sm font-semibold text-[var(--grey-200)] w-full grid-cols-2 sm:grid-cols-4 sm:[grid-template-rows:repeat(5,auto)]">
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Promotions</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>About Us</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>About BTC</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>AML Policy</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Terms &amp; Conditions</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Bonus Terms</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Fairness &amp; RNG Testing Methods</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Dispute Resolution</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Self-Exclusion</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Responsible Gaming</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Risk Warnings</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Privacy Policy</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Cookie Policy</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>FAQ</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>KYC Policies</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Sport Betting Terms</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Reviews</Trans>
                            </a>
                            <a href="#" className="block hover:text-white hover:[text-decoration-line:underline] hover:[text-decoration-style:solid] hover:[text-underline-offset:25%] transition-colors">
                                <Trans>Affiliates</Trans>
                            </a>
                        </div>

                        <div className="flex sm:hidden items-center gap-1.5 bg-gray-800 rounded w-full py-1 px-2 mb-5 relative cursor-pointer">
                            <img className="w-10 m-1 z-10"
                                src="https://cdn.beton-static.com/front/components/home/app/appButton-icon.png"
                                alt="App"/>
                            <div className="flex flex-col">
                                <p className="text-xs font-bold leading-6">Casino App</p>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="flex items-center mb-4">
                    {/* License */}
                    <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                        <Trans>License</Trans>
                    </button>

                    <div className="flex items-center gap-6 ml-auto">
                        <div className="hidden sm:flex items-center gap-1.5 bg-gray-800 rounded py-0 px-2 relative cursor-pointer">
                            <img
                                className="w-7 m-0.5 z-10"
                                src="https://cdn.beton-static.com/front/components/home/app/appButton-icon.png"
                                alt="App"
                            />
                            <div className="flex flex-col">
                                <p className="text-xs font-bold leading-6">Casino App</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <img
                                src="https://cdnwl.beton-static.com/front/components/landings/icons/18.svg?react"
                                alt="18+"
                                className="h-6"
                            />
                            <img
                                src="https://cdnwl.beton-static.com/front/components/landings/icons/ssl.svg?react"
                                alt="SSL"
                                className="h-6"
                            />
                            <img
                                src="https://cdnwl.beton-static.com/front/components/landings/icons/identity.svg?react"
                                alt="Identity"
                                className="h-6"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-10 text-center flex items-center justify-center">
                    <LanguageSwitcher triggerClassName={"bg-[var(--grey-500)] px-5 py-2.5 rounded-lg font-semibold"} />
                </div>
                <div className="mt-10 text-center flex items-center justify-center">
                    <img src={logo} alt="logo" className="h-[20px]" />
                </div>
                <div className="mt-10 text-center flex items-center justify-center">
                    <div className="flex items-center gap-3.5">
                        <a href="https://cert.gcb.cw/certificate?id=" target="_blank" rel="noreferrer">
                            <img src="https://cdn.aramuz.net/images/file/uploads/384161177553054706.png"
                                alt="license" className="w-[106px] rounded-sm"/>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

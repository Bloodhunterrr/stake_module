import config from "@/config.ts";
import { Trans } from "@lingui/react/macro";
import LanguageSwitcher from "@/components/shared/v2/language-switcher.tsx";
import logo from "@/assets/images/logo.svg"; 


export default function Footer() {
    return (
        <section className="w-[calc(100svw-44px)] lg:w-[calc(100svw-60px)] ml-auto bg-[var(--grey-800)] relative bottom-0">
            <div className="container mx-auto pb-[70px] sm:pb-[54px] sm:pt-6">
                <nav className="border-b-2 border-[var(--grey-500)] mb-10 py-2.5 sm:py-[30px] pb-[40px]">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <a href="/public" className="block">
                            <img
                                src={logo}
                                alt={`${config.skinName} logo`}
                                className="max-w-[152px] h-[40px]"/>
                        </a>

                        <div className="grid gap-3 gap-x-6 text-[12px] font-semibold text-gray-400 w-full sm:w-auto grid-cols-2 [grid-template-rows:repeat(10,auto)] sm:grid-cols-4 sm:[grid-auto-flow:column] sm:[grid-template-rows:repeat(5,auto)]">
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Promotions</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>About Us</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>About BTC</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>AML Policy</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Terms &amp; Conditions</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Bonus Terms</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Fairness &amp; RNG Testing Methods</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Dispute Resolution</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Self-Exclusion</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Responsible Gaming</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Risk Warnings</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Privacy Policy</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Cookie Policy</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>FAQ</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>KYC Policies</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Sport Betting Terms</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
                                <Trans>Reviews</Trans>
                            </a>
                            <a href="#" className="block hover:text-white transition-colors">
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
                    <div className="flex items-center gap-3.5">
                        <a
                            href="https://cert.gcb.cw/certificate?id="
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img
                                src="https://cdn.aramuz.net/images/file/uploads/384161177553054706.png"
                                alt="license"
                                className="max-h-[33px] max-w-[107px]"
                            />
                        </a>
                    </div>

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

                        <div>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                        <Trans>License</Trans>
                    </button>
                </div>
            </div>
        </section>
    );
}

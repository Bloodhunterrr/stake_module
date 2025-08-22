import config from "@/config";
import LanguageSwitcher from "../v2/language-switcher";

const logo = "https://hayaspin.com/static/media/logo.eb0ca820ea802ba28dd2.svg";

export default function Footer() {
  return (
    <section className="container mx-auto">
      <div className="pb-[70px] sm:pb-[54px] sm:pt-6">
        <nav className="border-b border-gray-700 mb-10 py-2.5 sm:py-[30px] pb-[40px]">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <a href="/" className="block">
              <img
                src={logo}
                alt={`${config.skinName} logo`}
                className="max-w-[152px] h-[40px]"
              />
            </a>

            <div
              className="grid gap-3 text-sm font-semibold text-gray-400 w-full sm:w-auto 
              grid-cols-2 [grid-template-rows:repeat(10,auto)] 
              sm:grid-cols-4 sm:[grid-auto-flow:column] sm:[grid-template-rows:repeat(5,auto)]"
            >
              {[
                "Promotions",
                "About Us",
                "About BTC",
                "AML Policy",
                "Terms & Conditions",
                "Bonus Terms",
                "Fairness & RNG Testing Methods",
                "Dispute Resolution",
                "Self-Exclusion",
                "Responsible Gaming",
                "Risk Warnings",
                "Privacy Policy",
                "Cookie Policy",
                "FAQ",
                "KYC Policies",
                "Sport Betting Terms",
                "Reviews",
                "Affiliates",
              ].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="flex sm:hidden items-center gap-1.5 bg-gray-800 rounded w-full py-1 px-2 mb-5 relative cursor-pointer">
              <img
                className="w-10 m-1 z-10"
                src="https://cdn.beton-static.com/front/components/home/app/appButton-icon.png"
                alt="App"
              />
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

            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
            License
          </button>
        </div>
      </div>
    </section>
  );
};
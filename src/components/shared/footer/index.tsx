import {loadAsset} from "@/utils/loadAsset"
import ArrowDown from "@/assets/icons/arrow-down.svg?react"
import config from "@/config"
import './style.css'

import {ALLOWED_LANGUAGES} from "@/types/lang"
import {useIsDesktop} from "@/hooks/useIsDesktop"

const logo = loadAsset('images/logo.svg?react')


const Language = () => {
    const currentLang = ALLOWED_LANGUAGES['en' as keyof typeof ALLOWED_LANGUAGES];

    return (
        <>
            <button className="m-button m-gradient-border m-button--secondary m-button--m lang-switcher-btn">
                <div className="m-button-content">
                    <span className="lang-switcher-country">{currentLang.name}</span>
                </div>
                <div className="m-icon-container">
                    <ArrowDown/>
                </div>
            </button>

        </>
    );
};


const Footer = () => {
    const isDesktop = useIsDesktop();

    return <section>
        <div className="footer">
            <nav className="footer-nav">
                <div className="footer-nav__content">
                    <div className="footer-nav__socials">
                        <a aria-current="page" href="/"
                           className="router-link-active router-link-exact-active nav-logo">
                            <img src={logo} width={'100%'} alt={config.skinName + ' logo'}/>
                        </a>
                    </div>
                    <div className={`FooterLinks footer-nav__links ${isDesktop ? '' : "mobile"}`}>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Promotions</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">About Us</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">About BTC</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">AML Policy</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Terms &amp; Conditions</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Bonus Terms</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Fairness &amp; RNG Testing Methods</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Dispute Resolution</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Self-Exclusion</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Responsible Gaming</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Risk Warnings</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Privacy Policy</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Cookie Policy</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">FAQ</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">KYC Policies</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Sport Betting Terms</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Reviews</a>
                        <a href="#" className="m-text m-fs12 m-fw600 m-lh160">Affiliates</a>
                    </div>
                    {!isDesktop && <div className="footer-app-button footer-app-button--mobile">
                        <img className="footer-app-button-image"
                             src="https://cdn.beton-static.com/front/components/home/app/appButton-icon.png"/>
                        <div className="footer-app-button-text">
                            <p className="m-text m-fs12 m-fw700 m-lh160">Casino App</p>
                        </div>
                    </div>}
                </div>
            </nav>
            <div className="footer-row">
                <div className="footer-license">
                    <a href="https://cert.gcb.cw/certificate?id=" target="_blank">
                        <img src="https://cdn.aramuz.net/images/file/uploads/384161177553054706.png"
                             className="footer-license__logo" alt="license"/>
                    </a>
                </div>
                <div className="footer-col">
                    {isDesktop && <div className="footer-app-button footer-app-button--squeezed">
                        <img className="footer-app-button-image"
                             src="https://cdn.beton-static.com/front/components/home/app/appButton-icon.png"/>
                        <div className="footer-app-button-text">
                            <p className="m-text m-fs12 m-fw700 m-lh160">Casino App</p>
                        </div>
                    </div>}
                    <div className="footer-icons">
                        <img width="24" height="25" className="footer-icons__image"
                             src="https://cdnwl.beton-static.com/front/components/landings/icons/18.svg?react"/>
                        <img width="51" height="23" className="footer-icons__image"
                             src="https://cdnwl.beton-static.com/front/components/landings/icons/ssl.svg?react"/>
                        <img width="84" height="25" className="footer-icons__image"
                             src="https://cdnwl.beton-static.com/front/components/landings/icons/identity.svg?react"/>
                    </div>
                    {isDesktop && <Language/>}
                </div>
            </div>
            <div className="footer-disclaimer">
                <div className="footer-disclaimer__button">License</div>
            </div>
        </div>
    </section>
}

export default Footer
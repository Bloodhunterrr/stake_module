import './style.css'
import {useEffect, useState} from "react";
import {useIsDesktop} from "@/hooks/useIsDesktop";
import banner from "@/assets/images/install-app-banner-desktop.png"

export default function InstallAppBanner() {
    const isDesktop = useIsDesktop(480);
    const textSizeClass = isDesktop ? "m-fs28" : "m-fs16";
    const buttonSizeClass = isDesktop ? "m-button--l" : "m-button--s";
    const paragraphSizeClass = isDesktop ? "m-fs14" : "m-fs12";

    const [supportsPWA, setSupportsPWA] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        const handler = (e: BeforeInstallPromptEvent) => {
            e.preventDefault();
            window.deferredPrompt = e;
            setSupportsPWA(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        const handleInstalled = () => {
            setIsInstalled(true);
        };

        window.addEventListener('appinstalled', handleInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, []);

    const handleInstallClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the install prompt");
                } else {
                    console.log("User dismissed the install prompt");
                }
                window.deferredPrompt = null;
            });
        }
    };

    if (isInstalled || !supportsPWA) {
        return null;
    }

    return (
        <section>
            <div className="pwa-banner">
                <img
                    className="pwa-banner__image"
                    src={banner}
                    alt="Phone"
                    loading="lazy"
                />
                <div>
                    <h2
                        className={`m-text m-fw700 m-lh160 ${textSizeClass}`}
                        style={{color: "var(--color-white)"}}
                    >
                        <div>Best in the App</div>
                    </h2>
                    <p
                        className={`m-text m-fw500 m-lh160 ${paragraphSizeClass}`}
                        style={{color: "var(--color-w060)"}}
                    >
                        <div>For a better experience!</div>
                    </p>
                </div>
                <button
                    className={`m-button m-gradient-border m-button--primary ${buttonSizeClass}`}
                    onClick={handleInstallClick}
                    disabled={!supportsPWA}
                >
                    <div className="m-button-content">
                        <div>Install</div>
                    </div>
                </button>
            </div>
        </section>
    );
};
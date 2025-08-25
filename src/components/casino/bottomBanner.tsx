import {Trans} from "@lingui/react/macro";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import bottomBannerImg from "@/assets/images/crypto-image-min.png";

const BottomBanner = () => {
  const isDesktop = useIsDesktop();

  return (
    <section className="hidden">
      {!isDesktop && (
        <div className="bottom-banner-mobile-title">
          <h2><Trans>Recharge et retire en Crypto.</Trans></h2>
          <h2><Trans>Bientôt disponible</Trans></h2>
        </div>
      )}

      <div className="bottom-banner">
        {isDesktop && (
          <div className="bottom-banner-content">
            <h2>
                <Trans>Recharge et retire en Crypto.</Trans>
              <br />
                <Trans>Bientôt disponible</Trans>
            </h2>
          </div>
        )}

        <img
          src={bottomBannerImg}
          alt="Crypto"
          className="bottom-banner-image"
        />
      </div>
    </section>
  );
};

export default BottomBanner;

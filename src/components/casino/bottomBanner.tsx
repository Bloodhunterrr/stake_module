import bottomBannerImg from "@/assets/images/crypto-image-min.png";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import "./bottomBanner.css";

const BottomBanner = () => {
  const isDesktop = useIsDesktop();

  return (
    <section>
      {!isDesktop && (
        <div className="bottom-banner-mobile-title">
          <h2>Recharge et retire en Crypto.</h2>
          <h2>Bientôt disponible</h2>
        </div>
      )}

      <div className="bottom-banner">
        {isDesktop && (
          <div className="bottom-banner-content">
            <h2>
              Recharge et retire en Crypto.
              <br />
              Bientôt disponible
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

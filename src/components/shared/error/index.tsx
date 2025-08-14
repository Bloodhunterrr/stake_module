
import "./style.css";
import { loadAsset } from "@/utils/loadAsset";
import { useNavigate } from "react-router";

const errorImg = loadAsset('images/not-found.png');

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="error-page">
      <img
        loading="lazy"
        src={errorImg}
        alt="Page you were looking for was not found"
        className="error-page__img"
      />

      <div className="error-page__text">
        <h2 className="m-text Header-Bold-L m-text-center">
          <div>Page you were looking for was not found.</div>
        </h2>

        <p
          className="m-text Body-Regular-L m-text-center"
          style={{ color: "var(--color-white)" }}
        >
          <div>
            Sorry, we couldn't find the page you were looking for. We suggest
            that you return to main page.
          </div>
        </p>
      </div>

      <button className="m-button m-gradient-border m-button--primary m-button--m">
        <div onClick={() => navigate(-1)} className="m-button-content">
          <div>Go back</div>
        </div>
      </button>
    </div>
  );
};

export default ErrorPage;

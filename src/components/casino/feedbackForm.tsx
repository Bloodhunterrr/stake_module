
import { useIsDesktop } from "@/hooks/useIsDesktop";
import FeedbackIcon  from "@/assets/icons/feedback-category-icon.svg?react";
import "./feedback.css";
import { useForm } from "react-hook-form";

const FeedbackForm = () => {
  const isDesktop = useIsDesktop();
  const { register, handleSubmit } = useForm<any>({
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("data", data);
  };

  return (
    <section>
      <div className="feedback-section">
        <div
          className={`feedback-header feedback-section-column${
            !isDesktop ? " feedback-header--centered" : ""
          }`}
        >
          <h1
            className="m-text m-fs20 m-fw700 m-lh140"
            style={{ color: "var(--color-light-grey-5)" }}
          >
            <div>Help us improve your experience</div>
          </h1>
          <p
            className="m-text m-fs16 m-fw500 m-lh150"
            style={{ color: "var(--color-mid-grey-5)" }}
          >
            <div>
              Please leave some feedback or report a bug/issue you have faced.
            </div>
          </p>
        </div>

        <form
          className="feedback-form feedback-section-column"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="m-form-field">
            <div className="m-dropdown m-select">
              <div className="m-dropdown-activator">
                <div className="m-input m-gradient-border m-input--dark m-input--m">
                  <div className="m-icon-container m-input-prepend">
                    <FeedbackIcon className="w-6 h-6"/>
                  </div>
                  <div className="m-input-content">
                    <input
                      type="text"
                      placeholder=" "
                      {...register("category", {
                        required: ({ id: "Category is required" }),
                      })}
                    />
                    <div className="m-input-content-label">
                      <div>Select category of problem</div>
                    </div>
                  </div>
                  <div className="m-input-append">
                    <div className="m-icon-container" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="m-form-field feedback-form-textarea-wrapper">
            <div className="m-input m-gradient-border m-input--dark m-input--m feedback-form-textarea m-textarea">
              <div className="m-input-content">
                <textarea
                  data-qa="textarea"
                  className="feedback-form-textarea m-textarea"
                  placeholder=""
                  {...register("content", {
                    required: ({ id: "Content is required" }),
                  })}
                ></textarea>
                <div className="m-input-content-label">
                  <div>Enter the text</div>
                </div>
              </div>
            </div>
            <div className="m-textarea-counter">
              <span>0</span> / 500 <div>characters left</div>
            </div>
          </div>

          <div
            className={`feedback-form-submit${
              !isDesktop ? " feedback-form-submit--small" : ""
            }`}
          >
            <button
              className="m-button m-gradient-border m-button--primary m-button--m"
              type="submit"
            >
              <div className="m-button-content">
                {isDesktop ? (
                  <div>Leave a message</div>
                ) : (
                  <div>Send message</div>
                )}
              </div>
            </button>
            <span>
              <div>Thank you for making our service better</div>
            </span>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;

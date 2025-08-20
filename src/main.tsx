import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import routes from "@/routes";
import { i18n } from "@lingui/core";
import { I18nProvider, useLingui } from "@lingui/react";
import { Provider } from "react-redux";
import { store } from "@/store.ts";
import { ThemeProvider } from "@/hooks/useTheme";
import './index.css'; 

const DEFAULT_LOCALE = localStorage.getItem("lang") || "en";

function LangUpdater() {
  const { i18n } = useLingui();
  useEffect(() => {
    document.documentElement.lang = i18n.locale;
  }, [i18n.locale]);
  return null;
}

async function bootstrap() {
  const { messages } = await import(`./locales/${DEFAULT_LOCALE}/messages.js`);
  i18n.load(DEFAULT_LOCALE, messages);
  i18n.activate(DEFAULT_LOCALE);

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nProvider i18n={i18n}>
          <ThemeProvider>
            <LangUpdater />
            <RouterProvider router={routes} />
          </ThemeProvider>
        </I18nProvider>
      </Provider>
    </React.StrictMode>
  );
}

bootstrap();

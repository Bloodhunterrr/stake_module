import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router";
import routes from "@/routes";
import {i18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
import {Provider} from "react-redux";
import {store} from "@/store.ts";
import {ThemeProvider} from "@/hooks/useTheme";
import {ALLOWED_LANGUAGES} from "@/types/lang";
import "./index.css";
import {GameWindowsManagerProvider} from "@/contexts/gameWindowsManagerContext.tsx";

const DEFAULT_LOCALE = localStorage.getItem("lang") || "en";

async function bootstrap() {
    await Promise.all(
        Object.keys(ALLOWED_LANGUAGES).map(async (locale) => {
            const {messages} = await import(`./locales/${locale}/messages.po`);
            i18n.load(locale, messages);
        })
    );

    i18n.activate(DEFAULT_LOCALE);
    document.documentElement.lang = DEFAULT_LOCALE;

    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <Provider store={store}>
                <I18nProvider i18n={i18n}>
                    <ThemeProvider>
                        <GameWindowsManagerProvider>
                            <RouterProvider router={routes}/>
                        </GameWindowsManagerProvider>
                    </ThemeProvider>
                </I18nProvider>
            </Provider>
        </React.StrictMode>
    );
}

bootstrap();
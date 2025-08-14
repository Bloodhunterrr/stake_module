import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import routes from "@/routes";
import {Provider} from 'react-redux';
import {ThemeProvider} from '@/hooks/useTheme';
import {store} from "@/store.ts";

async function bootstrap() {

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <Provider store={store}>
                    <ThemeProvider>
                        <RouterProvider router={routes}/>
                    </ThemeProvider>
            </Provider>
        </StrictMode>
    );
}

bootstrap()
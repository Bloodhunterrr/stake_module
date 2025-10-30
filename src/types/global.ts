import type Pusher from "pusher-js";

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Tawk_API?: {
            onLoad?: () => void;
            setAttributes?: (
                attrs: {
                    name?: string;
                    email?: string;
                    role?: string;
                    wallets?: string;
                },
                callback?: (error?: any) => void
            ) => void;
            hideWidget?: () => void;
            maximize?: () => void;
            minimize?: () => void;
            toggle?: () => void;
            showWidget?: () => void;
            reset?: () => void;
        };
    }
}

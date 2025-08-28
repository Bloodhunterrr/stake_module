import React from "react";
import { Loader2 } from "lucide-react";

const Loading: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
                <Loader2 className="animate-spin  w-8 h-8 !text-card" />
            </div>
        </div>
    );
};

export default Loading;

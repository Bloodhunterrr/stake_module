import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselBtnsProps {
    prevOnClick?: () => void;
    prevDisabled?: boolean;
    nextOnClick?: () => void;
    nextDisabled?: boolean;
    className?: string;
    prevClassName?: string;
    nextClassName?: string;
}

export default function CarouselBtns({
                                         prevOnClick,
                                         prevDisabled = false,
                                         nextOnClick,
                                         nextDisabled = false,
                                         className,
                                         prevClassName,
                                         nextClassName
                                     }: CarouselBtnsProps) {
    return (
        <div className={cn("relative w-max flex")}>
            <Button variant="outline" size="icon" className={cn(className, prevClassName)} disabled={prevDisabled} onClick={prevOnClick}>
                <ArrowLeft />
            </Button>
            <Button variant="outline" size="icon" className={cn(className, nextClassName)} disabled={nextDisabled} onClick={nextOnClick}>
                <ArrowRight />
            </Button>
        </div>
    );
}
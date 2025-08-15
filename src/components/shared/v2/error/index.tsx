import {useNavigate} from "react-router";
import {Button} from '@/components/ui/button.tsx';


export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 p-4">
            <div
                className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full">
                <img
                    loading="lazy"
                    src="https://placehold.co/300x300/fecaca/991b1b?text=Page+Not+Found"
                    alt="Illustration of a missing page"
                    className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full shadow-lg"
                />

                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-red-600 dark:text-red-400">
                        404
                    </h1>
                    <h2 className="text-3xl font-semibold">
                        Oops! The page you were looking for doesn't exist.
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        It looks like you've followed a broken link or entered a URL that
                        doesn't exist on this site.
                    </p>

                    <div className="flex space-x-4 mt-6">
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="px-6 py-3"
                        >
                            Go Back
                        </Button>
                        <a href="/public">
                            <Button className="px-6 py-3">
                                Go to Homepage
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

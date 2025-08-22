import {useNavigate} from "react-router-dom";
import {Button} from '@/components/ui/button.tsx';

export default function ErrorPage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center bg-white h-screen w-screen font-poppins">
            <div className="flex justify-center">
                <div className="text-center  text-black">
                    <div
                        className="bg-center bg-cover h-96"
                        style={{backgroundImage: `url(/dribbble.gif?react)`}}
                        aria-label="404 illustration"
                    >
                        <h1 className="text-6xl font-bold">404</h1>
                    </div>

                    <div className="mt-[-50px]">
                        <h3 className="text-2xl font-semibold mb-4">Look like you're lost</h3>
                        <p className="mb-6">The page you are looking for is not available!</p>
                        <Button
                            variant="outline"
                            className={'text-white w-full px-6 py-2 rounded-lg '}
                            onClick={() => navigate('/')}
                        >
                            Go Home
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
import React from "react"
import './style.css'
import { loadAsset } from "@/utils/loadAsset"
import { useIsDesktop } from "@/hooks/useIsDesktop"
const logo = loadAsset('images/logo.svg?react')


const Loader: React.FC = () => {
    const isTablet = useIsDesktop(480);

    return (<div className="mf-container mf-container--loading">
        <div className="loader-container loader-container--default">
            <img
                alt="logo"
                style={{ width: (!isTablet ? '120px' : '200px') }}
                className="loader-container-logo"
                src={logo}
            />
        </div>
    </div>)
}

export const LoaderSpinner: React.FC = () => {
    return <div className="loader-spinner-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#08FF00" stroke="#08FF00" stroke-width="15" r="15" cx="40" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#08FF00" stroke="#08FF00" stroke-width="15" r="15" cx="100" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#08FF00" stroke="#08FF00" stroke-width="15" r="15" cx="160" cy="100"><animate attributeName="opacity" calcMode="spline" dur="2" values="1;0;1;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
    </div>
}

export default Loader
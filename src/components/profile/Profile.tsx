
import { Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router";
import './Profile.css'

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        {
            label: <div>General</div>,
            path: "/profile/general",
        },
        {
            label: <div>Security</div>,
            path: "/profile/security",
        },
    ];

    return                     <div className="user-page">
                        <div className="m-text Body-Semi-Bold-XL PageTitle page-title">
                            <div>Profile</div>
                        </div>
                        <div className="m-tabs m-tabs--primary m-tabs--m profile-general-tabs">

                            {tabs.map((tab) => (
                                <div
                                    key={tab.path}
                                    className={`m-tabs-item ${location.pathname === tab.path ? "m-tabs-item--active" : ""}`}
                                    onClick={() => navigate(tab.path)}
                                >
                                    <div className="m-tabs-item-content">
                                        <span>{tab.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <Outlet />
                        </div>
                    </div>
}

export default Profile
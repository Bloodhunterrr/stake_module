
import "./history.css"

import { Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router";

const History = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      label: <div>Transactions history</div>,
      path: "/profile/history",
    },
    {
      label: <div>Casino History</div>,
      path: "/profile/history/casino",
    },
    {
      label: <div>Betting History</div>,
      path: "/profile/history/sport",
    },
  ];

  return <div className="history-page">
    <div className="m-text Body-Semi-Bold-XL PageTitle page-title">
      <div>History</div>
    </div>
    <div className="m-tabs m-tabs--primary m-tabs--m">
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
    <Outlet />
  </div>
}

export default History

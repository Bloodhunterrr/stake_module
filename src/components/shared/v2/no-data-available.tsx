import { Trans } from "@lingui/react/macro";
import { CircleQuestionMark } from "lucide-react";

interface NoDataAvailableProps {
  info?: string | null;
}

const NoDataAvailable: React.FC<NoDataAvailableProps> = ({ info }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg text-center">
      <div className="text-white/70">
        <CircleQuestionMark size={40} />
      </div>
      <div className="text-white/70 font-semibold text-lg">
        <Trans>No data available</Trans> 
      </div>
      {info && <div className="text-white/70 text-sm">{info}</div>}
    </div>
  );
};

export default NoDataAvailable;

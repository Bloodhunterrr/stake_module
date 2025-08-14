import QuestionCircle  from '@/assets/icons/question-circle.svg?react';


interface NoDataAvailableProps {
    info: string | null
}

const NoDataAvailable: React.FC<NoDataAvailableProps> = ({
    info
}) => {
    return <div className="m-info-block m-info-block--medium m-info-block--secondary">
        <div className="m-info-block-icon">
            <QuestionCircle className="m-icon m-icon-loadable" />
        </div>
        <div className="m-info-block-title">
            <div><div>No data available</div></div>
        </div>
        {info && <div className="m-info-block-message">
            <div>{info}</div>
        </div>}
    </div>
}

export default NoDataAvailable
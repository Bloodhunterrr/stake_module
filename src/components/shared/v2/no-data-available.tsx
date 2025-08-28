interface NoDataAvailableProps {
    info: string | null
}

const NoDataAvailable: React.FC<NoDataAvailableProps> = ({
                                                             info
                                                         }) => {
    return <div className="m-info-block m-info-block--medium m-info-block--secondary">
        <div className="m-info-block-icon text-white/70">
            add svg here
        </div>
        <div className="m-info-block-title text-white/70">
            <div>
                <div>No data available</div>
            </div>
        </div>
        {info && <div className="m-info-block-message text-white/70">
            <div>{info}</div>
        </div>}
    </div>
}

export default NoDataAvailable;
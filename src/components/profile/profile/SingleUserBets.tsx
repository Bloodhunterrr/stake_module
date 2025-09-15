import {useParams} from "react-router";
import {useLazyGetSingleUsersTicketsQuery} from "@/services/authApi.ts";
import {useEffect, useState} from "react";
import {format} from "date-fns";

export default function SingleUserBets() {
    const { singleBetsId }  =  useParams()

    const [fetchSingleTicketData, { isLoading, isError, isFetching }] = useLazyGetSingleUsersTicketsQuery();

    const [data, setData] = useState<any>()
    useEffect(() => {
        fetchSingleTicketData({
            user_id : singleBetsId,
        }).unwrap().then(data =>{
            setData(data?.tickets?.data)
        })
    },[])

    console.log(data , isFetching , isError , isLoading)

    return (
        <div className={'container mx-auto'}>
            <div className={'flex flex-col gap-y-2 pt-5'}>
                {
                    data?.map((singleTicket : any) => {
                        return <div className={'border flex flex-col'}>
                            <div className={'flex flex-row items-center px-2 gap-x-2 h-12'}>
                                <p>{singleTicket?.user_name}</p>
                                <p>{singleTicket?.bet_type}</p>
                                <p>{singleTicket?.amount }</p>
                                <p>{format(singleTicket?.created_at , 'dd/MM/yyyy')}</p>
                            </div>
                            <div className={'flex flex-col min-h-12 border'} id={'details'}>
                                {
                                    <div  className={'flex flex-col border'}>
                                        <div className={'flex flex-row gap-x-2'}>
                                            <p>{singleTicket?.details.result_payload?.action}</p>
                                            <p className={'border p-3 bg-red-200'}>{singleTicket?.details.vendor_status}</p>
                                        </div>
                                    </div>
                                }
                                {
                                    singleTicket?.details.odds.map((singleBets : any) =>{
                                        return <div  className={'flex flex-col border'}>
                                            <div className={'flex flex-row gap-x-2'}>
                                                <p>{singleBets.event?.inf}</p>
                                                <p>{singleBets.event?.team1}</p>
                                                <p>{singleBets.event?.team2}</p>
                                            </div>
                                        </div>
                                    })
                                }

                            </div>
                        </div>
                    })
                }
            </div>
            <pre>{JSON.stringify(data , null , 2)}</pre>
        </div>
    );
}
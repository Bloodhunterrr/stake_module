'use client'
import {useLazyGetMessagesQuery , useLazyGetSingleMessageQuery} from "@/services/authApi.ts";
import Loading from "@/components/shared/v2/loading.tsx";
import {formatDateToDMY} from "@/utils/formatDate.ts";
import {useEffect, useState} from 'react';
import {cn} from "@/lib/utils.ts";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type {MessageResponse, SingleMessageResponse} from "@/types/auth.ts";

interface MessagesState {
    sent: MessageResponse[];
    received: MessageResponse[];
}
function Messages() {
    const [fetchMessages, { isLoading, isError, isFetching }] = useLazyGetMessagesQuery();
    const [messages, setMessages] = useState<MessagesState>({
        sent : [],
        received : []
    })

    // UserContext
    // import {useAppSelector} from "@/hooks/rtk.ts";
    // const user = useAppSelector((state) => state.auth.user);
    // console.log(user)

    console.log(messages)

    const [refresh, setRefresh] = useState<boolean>(true);
    useEffect(() => {
        if (refresh) {
            // Fetch sent messages
            fetchMessages({ type: 'sent' })
                .unwrap()
                .then((response : any) => {
                    setMessages({
                        ...messages,
                        sent: response ?? [],
                    });
                })
                .catch((error) => {
                    console.error('Error fetching sent messages:', error);
                    setMessages((prev) => ({ ...prev, sent: [] }));
                });

            fetchMessages({ type: 'received' })
                .unwrap()
                .then((response: any) => {
                    console.log(response)
                    setMessages({
                        ...messages,
                        received: response ?? [],
                    });
                })
                .catch((error) => {
                    console.error('Error fetching received messages:', error);
                    setMessages((prev) => ({ ...prev, received: [] }));
                });
        }
        setRefresh(false);
    }, [refresh]);

    console.log(isError)

    return (
        <div className={'bg-background'}>
            <div className={' min-h-screen text-accent gap-y-2 flex flex-col justify-start pt-2  container mx-auto '}>
                <p className={'w-fit cursor-pointer border-[1px] rounded-2xl p-2'} onClick={()=>setRefresh(true)}>Refresh</p>
                <div className={cn('w-full h-full p-2' , {
                    "animate-pulse min-h-12 bg-accent/40" : isFetching
                })}>
                    <p>Received Messages</p>
                    { isLoading  ? <Loading/> :
                        messages?.received.length > 0 ? messages.received.map((message:any) => {
                            console.log(message.length)
                            return <SingleMessage message={message} />
                        }) : <p className={'py-2 pl-2 bg-popover '}>Not Received any messages yet</p>
                    }
                </div>
                <div className={cn('w-full h-full  flex flex-col gap-y-2 p-2' , {
                    "animate-pulse min-h-12 bg-accent/40" : isFetching
                })}>
                    <p>Sent Messages</p>
                    <div className={'flex flex-col gap-y-3'}>
                        { isLoading  ? <Loading/> :
                            messages?.sent.length > 0 && messages.sent.map((message:any) => {
                                return <SingleMessage message={message} />
                            })
                        }
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Messages;


const SingleMessage = ({message} : {message : any}) => {
    const [fetchSingleMessage , {isError , isLoading}] = useLazyGetSingleMessageQuery()
    const [data, setData] = useState<SingleMessageResponse | undefined>(undefined);
    return (
        <div className={'flex items-center gap-x-3 py-1 px-1 rounded border'} onClick={()=>{
            fetchSingleMessage({id : message.id}).unwrap().then((data : SingleMessageResponse ) =>{
                setData(data)
            })
        }}>
            <Dialog>
                <DialogTrigger className={'w-full flex flex-row items-center gap-x-4'}>
                    <p>{formatDateToDMY(message?.created_at)}</p>
                    <p className={'w-full text-start truncate'}>{message?.subject}</p>
                </DialogTrigger>
                <DialogContent className={'border-none text-accent'}>
                    <DialogHeader className={'text-accent text-start'}>
                        <DialogTitle>Message</DialogTitle>
                        { ( isLoading)  ? <Loading/> :
                            (isError ? <p>There has been an error</p> : <div className={'flex flex-col  text-start'}>
                                <div className={'w-full'}>
                                    {data?.sender?.name}
                                </div>
                                <div>{data?.subject}</div>
                                <div>{data?.body}</div>
                            </div>)
                        }

                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}
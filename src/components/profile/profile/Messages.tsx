'use client'
import {useLazyGetMessagesQuery , useLazyGetSingleMessageQuery} from "@/services/authApi.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loading from "@/components/shared/v2/loading.tsx";
import {formatDateToDMY} from "@/utils/formatDate.ts";
import {useEffect, useState} from 'react';
import {cn} from "@/lib/utils.ts";
import {useAppSelector} from "@/hooks/rtk.ts";
import { Send , CheckCheck } from 'lucide-react';


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type {MessageResponse, SingleMessageResponse} from "@/types/auth.ts";
import {Trans} from "@lingui/react/macro";
import {useNavigate} from "react-router-dom";

interface MessagesState {
    sent: MessageResponse[];
    received: MessageResponse[];
}
export default function Messages() {
    const [fetchMessages, { isLoading, isError, isFetching }] = useLazyGetMessagesQuery();
    const [messages, setMessages] = useState<MessagesState>({
        sent : [],
        received : []
    })

    const navigate = useNavigate()

    // import {useAppSelector} from "@/hooks/rtk.ts";
    const user = useAppSelector((state) => state.auth.user);
    const [refresh, setRefresh] = useState<boolean>(true);

    useEffect(() => {
        if (refresh) {
            // Fetch sent messages
            fetchMessages({ type: 'sent' })
                .unwrap()
                .then((response : any) => {
                    setMessages({
                        ...messages,
                        sent: response ??(messages?.sent ?? []),
                    });
                })
                .catch((error) => {
                    console.error('Error fetching sent messages:', error);
                    setMessages((prev) => ({ ...prev, sent: [] }));
                });

            fetchMessages({ type: 'received' })
                .unwrap()
                .then((response: any) => {
                    setMessages({
                        ...messages,
                        received: response ?? (messages?.received ?? []),
                    });
                })
                .catch((error) => {
                    console.error('Error fetching received messages:', error);
                    setMessages((prev) => ({ ...prev, received: [] }));
                });
        }
        setRefresh(false);
    }, [refresh]);

    if(isError){
        navigate('/')
    }


    return (
        <div className={'bg-[var(--grey-700)]'}>
           <section className={'container mx-auto flex flex-row'}>
               <Tabs onValueChange={() => { setRefresh(true) }} defaultValue="received" className="w-full px-2 pt-2">
                   <TabsList>
                       <p className={'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 cursor-pointer min-w-20'} onClick={()=>setRefresh(true)}>{isFetching ? <Loading/> : <Trans>Refresh</Trans>}</p>
                       { user && user.is_agent &&
                           <TabsTrigger value="sent" className={'data-[state=active]:bg-background/30 data-[state=active]:text-background'}><Trans>Sent</Trans></TabsTrigger>
                       }
                       <TabsTrigger value="received" className={'data-[state=active]:bg-background/30 data-[state=active]:text-background'}><Trans>Received</Trans></TabsTrigger>
                   </TabsList>
                   <TabsContent value="sent">
                       <div className={'w-full min-h-screen text-accent gap-y-2 flex flex-col justify-start pt-2'}>
                           { user && user.is_agent &&
                               <div className={cn('w-full h-full flex flex-col gap-y-2 p-2', {
                                   "animate-pulse min-h-12 bg-accent/40" : isFetching
                               })}>
                                   <div className={'flex flex-col py-2 gap-y-3'}>
                                       { isLoading
                                           ? <Loading/>
                                           : messages?.sent.length > 0 &&
                                               messages.sent.map((message:any) => {
                                                   return <SingleMessage message={message} type={'sent'} />
                                               })
                                       }
                                   </div>
                               </div>
                           }
                       </div>
                   </TabsContent>
                   <TabsContent value="received">
                       <div className={'w-full min-h-[calc(100vh-140px)] text-accent gap-y-2 flex flex-col justify-start pt-2'}>
                           <div className={cn('w-full h-full', {
                               "animate-pulse min-h-12 bg-accent/40" : isFetching
                           })}>
                               <div className={'flex flex-col py-2 gap-y-3 min-h-[calc(100vh-140px)]'}>
                               { isLoading
                                   ? <Loading/>
                                   : messages?.received.length > 0
                                       ? messages.received.map((message:any) => {
                                           return <SingleMessage message={message} type={'received'} />
                                       })
                                       : <p className={'m-auto bg-transparent'}><Trans>Not Received any messages yet</Trans></p>
                               }
                               </div>
                           </div>
                       </div>
                   </TabsContent>
               </Tabs>
           </section>
        </div>
    );
}

const SingleMessage = ({message , type} : {message : any , type : string}) => {
    const [fetchSingleMessage , {isError , isLoading}] = useLazyGetSingleMessageQuery()
    const [data, setData] = useState<SingleMessageResponse | undefined>(undefined);
    return (
        <div className={'flex items-center gap-x-3 py-2 px-2 rounded-lg border-[1px] border-popover'} onClick={()=>{
            fetchSingleMessage({id : message.id}).unwrap().then((data : SingleMessageResponse ) =>{
                setData(data)
            })
        }}>
            <Dialog>
                <DialogTrigger className={'w-full flex flex-row items-center gap-x-4'}>
                    <div>
                        { type === 'received' &&
                            <p className={'size-10 relative rounded-full shrink-0 border '}>
                                <span className={'absolute h-fit top-1/2 left-1/2 -translate-x-1/2 leading-0 -translate-y-1/2'}>{message?.sender?.name?.charAt(0)}</span>
                            </p>
                        }
                    </div>
                    <p className={'text-xs flex flex-col text-start gap-y-1'}>
                        { type === 'received' &&
                            <span>
                                {message?.sender?.name}
                            </span>
                        }
                        {formatDateToDMY(message?.created_at).replaceAll("-" , '/')}
                    </p>
                    <p className={'w-full text-start truncate'}>{message?.subject}</p>
                    { type === "sent"
                        ? <Send className={'text-card shrink-0'} size={20}/>
                        : <CheckCheck className={'text-card shrink-0'} size={20}/>
                    }
                </DialogTrigger>
                <DialogContent className={'border-none text-accent'}>
                    <DialogHeader className={'text-accent text-start'}>
                        <DialogTitle><Trans>Message</Trans></DialogTitle>
                        { ( isLoading)
                            ? <Loading/>
                            : (isError
                                ? <p><Trans>There has been an error</Trans></p>
                                : <div className={'flex flex-col text-start'}>
                                    <div className={'w-full'}>{data?.sender?.name}</div>
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
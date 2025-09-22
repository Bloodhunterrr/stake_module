'use client'
import {useLazyGetMessagesQuery , useLazyGetSingleMessageQuery} from "@/services/authApi.ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Loading from "@/components/shared/v2/loading.tsx";
import {formatDateToDMY} from "@/utils/formatDate.ts";
import {useEffect, useState} from 'react';
import {cn} from "@/lib/utils.ts";
import {useAppSelector} from "@/hooks/rtk.ts";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type {MessageResponse, SingleMessageResponse} from "@/types/auth.ts";
import {Trans} from "@lingui/react/macro";

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
    console.log(messages)



    return (
        <div className={'bg-background'}>
           <section className={'container mx-auto flex flex-row'}>
               <Tabs defaultValue="received" className="w-full px-2 pt-2">
                   <TabsList>
                       <p className={'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 cursor-pointer min-w-20'} onClick={()=>setRefresh(true)}>{isFetching ? <Loading/> : <Trans>Refresh</Trans>}</p>
                       {
                           user && user.is_agent && <TabsTrigger value="sent" className={'data-[state=active]:bg-background/30 data-[state=active]:text-background'}><Trans>Sent</Trans></TabsTrigger>
                       }
                       <TabsTrigger value="received" className={'data-[state=active]:bg-background/30 data-[state=active]:text-background'}><Trans>Received</Trans></TabsTrigger>
                   </TabsList>
                   <TabsContent value="sent">
                       <div className={'w-full min-h-screen text-accent gap-y-2 flex flex-col justify-start pt-2   '}>
                           {
                               user && user.is_agent &&
                               <div className={cn('w-full h-full  flex flex-col gap-y-2 p-2' , {
                                   "animate-pulse min-h-12 bg-accent/40" : isFetching
                               })}>
                                   <div className={'flex flex-col gap-y-3'}>
                                       { isLoading  ? <Loading/> :
                                           messages?.sent.length > 0 && messages.sent.map((message:any) => {
                                               console.log(message)
                                               return <SingleMessage message={message} />
                                           })
                                       }
                                   </div>

                               </div>
                           }

                       </div>
                   </TabsContent>
                   <TabsContent value="received">
                       <div className={'w-full min-h-screen text-accent gap-y-2 flex flex-col justify-start pt-2   '}>
                           <div className={cn('w-full h-full' , {
                               "animate-pulse min-h-12 bg-accent/40" : isFetching
                           })}>
                               { isLoading  ? <Loading/> :
                                   messages?.received.length > 0 ? messages.received.map((message:any) => {
                                       return <SingleMessage message={message} />
                                   }) : <p className={'py-2 pl-2 bg-popover '}><Trans>Not Received any messages yet</Trans></p>
                               }
                           </div>
                       </div>
                   </TabsContent>
               </Tabs>
           </section>
        </div>
    );
}

export default Messages;


const SingleMessage = ({message} : {message : any}) => {
    const [fetchSingleMessage , {isError , isLoading}] = useLazyGetSingleMessageQuery()
    const [data, setData] = useState<SingleMessageResponse | undefined>(undefined);
    return (
        <div className={'flex items-center gap-x-3  p-1 rounded border'} onClick={()=>{
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
                        <DialogTitle><Trans>Message</Trans></DialogTitle>
                        { ( isLoading)  ? <Loading/> :
                            (isError ? <p><Trans>There has been an error</Trans></p> : <div className={'flex flex-col  text-start'}>
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
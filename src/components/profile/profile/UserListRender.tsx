import { cn } from "@/lib/utils.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { Trans } from "@lingui/react/macro";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button.tsx";
import type { UsersResponse } from "@/types/auth.ts";
import Loading from "@/components/shared/v2/loading.tsx";
import { ChevronDown, ChevronLeftIcon, ChevronRight } from "lucide-react";
import { useLazyGetUserListQuery, usePutBlockUserMutation } from '@/services/authApi.ts';

function UserItem({
                      user,
                      handleChildClick,
                      loadedChildren,
                      isFetching,
                      openIds,
                      toggleOpen,
                      isOpen
                  }: {
    user: any;
    handleChildClick: (id: number) => void;
    loadedChildren: Set<number>;
    isFetching: boolean;
    openIds: Set<number>;
    toggleOpen: (id: number) => void;
    isOpen: boolean;
}) {
    const hasChildren = user.children && user.children.length > 0;
    const navigate = useNavigate();
    const euroBalance = user.wallets.find((wallet : any) => wallet.slug === "eur") ?? []
    const otherBalance = user.wallets.find((wallet : any) => wallet.slug === "usd") ?? []
    const childrens = (user.children_count)
    return (
        <div className={cn("border-b border-black/20 bg-white/40 text-black", {
            'animate-pulse bg-white/50': isFetching,
            "border-none" : hasChildren && isOpen
        })}>
            <div
                className={cn("w-full grid  grid-cols-4 pl-2 justify-between items-center cursor-pointer py-1.5", {
                })}>

                <div
                    onClick={() => {
                        if (hasChildren) {
                            toggleOpen(user.id);
                        } else if (user.is_agent) {
                            handleChildClick(user.id);
                        }
                    }}
                    className={'flex items-center  truncate w-full justify-start gap-x-3'}>
                    <p className={'min-w-32 flex items-center gap-x-1.5 flex-row'}>
                        <span className={cn('size-2 rounded-full  bg-destructive ',{
                            'bg-card' : !user.is_blocked
                        })}></span>
                        <span>{user.username}</span>
                        <span>{childrens === 0 ? "" : `(${childrens})`}</span>
                    </p>
                </div>
                <div
                    onClick={()=>{
                        navigate(`edit/${user.id}`)
                    }}
                    className={'text-center lg:text-start'}>
                    {(Number((euroBalance.balance ?? 0) / 100)).toLocaleString("en-EN", {
                        minimumFractionDigits: euroBalance.decimal_places,
                        maximumFractionDigits: euroBalance.decimal_places,
                    })}
                </div>
                <div
                    onClick={()=>{
                        navigate(`edit/${user.id}`)
                    }}
                    className={'text-center lg:text-start'}>
                    {(Number((otherBalance.balance ?? 0) / 100)).toLocaleString("en-EN", {
                        minimumFractionDigits: otherBalance.decimal_places,
                        maximumFractionDigits: otherBalance.decimal_places,
                    })}
                </div>
                <p className={'pr-2 flex items-center justify-end'}>
                    {(hasChildren || !!user.is_agent) &&
                        <span>
              {isOpen ? (
                  <ChevronDown
                      className={"size-5"}
                      onClick={() => {
                          if (hasChildren) {
                              toggleOpen(user.id);
                          } else if (user.is_agent) {
                              handleChildClick(user.id);
                          }
                      }}
                  />
              ) : (
                  <ChevronRight
                      className={"size-5"}
                      onClick={() => {
                          if (hasChildren) {
                              toggleOpen(user.id);
                          } else if (user.is_agent) {
                              handleChildClick(user.id);
                          }
                      }}
                  />
              )}
            </span>
            }
                </p>
            </div>
            {hasChildren && isOpen && user.children && user.children.length > 0 && (
                <div className={cn(" " , {
                    'bg-black/5': isOpen,
                })}>
                    {user.children.map((child: typeof user.children[0]) => {
                        const childIsOpen = openIds.has(child.id);
                        return (
                            <UserItem
                                key={child.id}
                                user={child}
                                handleChildClick={handleChildClick}
                                loadedChildren={loadedChildren}
                                isFetching={isFetching}
                                openIds={openIds}
                                toggleOpen={toggleOpen}
                                isOpen={childIsOpen}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function LoggedUser({data} : { data : any }){
    return <div className={'border-x text-white text-xs border-t border-popover'}>
        <div className={'p-2 border-b bg-chart-2 border-popover'}>
            <Trans>My balance</Trans>
        </div>
        <div className={''}>
            <div className={cn('grid w-full text-end mr-12 grid-cols-4' , {
                "grid-cols-4" : ((data?.wallets?.length ?? 2) + 1 === 3) ,
            })}>
                <p className={'opacity-0'}>{data?.username ?? ""}</p>
                {
                    data?.wallets.length > 0 && data?.wallets?.map((wallet : any ) => {
                        return <div className={'py-2 border-b text-start border-popover '}>
                            <p className={'w-full'}>{wallet.name}</p>
                        </div>
                    })
                }
            </div>
            <div className={cn('grid w-full  text-foreground bg-muted/90 text-start grid-cols-4' , {
                "grid-cols-4" : ((data?.wallets?.length ?? 2) + 1 === 3) ,
            })}>

                <p className={'w-full text-start flex items-center pl-2'}>{data?.username ?? ""}</p>
                {
                    data?.wallets.length > 0 && data?.wallets?.map((wallet : any) => {
                        return <div className={'py-2'}>
                            <p className={'text-start '}>
                                {(Number(wallet.balance) / 100).toLocaleString("en-EN", {
                                    minimumFractionDigits: wallet.decimal_places,
                                    maximumFractionDigits: wallet.decimal_places,
                                })}
                            </p>
                        </div>
                    })
                }

            </div>
        </div>

    </div>
}

function UserListRender() {
    const [combinedData, setCombinedData] = useState<UsersResponse | null>(null);
    const [fetchUserList, { isLoading, isError, isFetching }] = useLazyGetUserListQuery();
    const [putBlockUser] = usePutBlockUserMutation();
    const navigate = useNavigate();
    const [loadedChildren, setLoadedChildren] = useState<Set<number>>(new Set());
    const [openIds, setOpenIds] = useState<Set<number>>(new Set());
    const [trigger, setTrigger] = useState(true)

    const handleChildClick = async (childId: number) => {
        const isAlreadyOpen = openIds.has(childId);
        if (!isAlreadyOpen) {
            toggleOpen(childId);
        }

        if (!loadedChildren.has(childId)) {
            try {
                const result = await fetchUserList({ user_id: childId }).unwrap();
                setCombinedData(prevData => {
                    if (!prevData) return null;
                    const insertChildrenRecursively = (node: any): any => {
                        if (node.id === result.user.id) {
                            return {
                                ...node,
                                children: [
                                    ...(node.children || []),
                                    ...result.children?.map((c: any) => ({ ...c, children: c.children || [] })) || []
                                ],
                            };
                        }
                        if (node.children && node.children.length > 0) {
                            return {
                                ...node,
                                children: node.children.map(insertChildrenRecursively),
                            };
                        }
                        return node;
                    };
                    const newData = { ...prevData };
                    newData.children = newData.children.map(insertChildrenRecursively);
                    return newData;
                });
                setLoadedChildren(prev => new Set(prev).add(childId));
            } catch (err) {
                console.log(err);
            }
        }
    };

    const toggleOpen = (id: number) => {
        setOpenIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    useEffect(() => {
        fetchUserList({ user_id: 0 }).then((data: any) => {
            setCombinedData(data?.data);
        });
        setTrigger(false)
        setOpenIds(new Set())
        setLoadedChildren(new Set())
    }, [trigger]);

    useEffect(() => {
            fetchUserList({ user_id: 0 }).then((data: any) => {
                setCombinedData(data?.data);
            });
    }, []);



    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-background">
                <Loading />
            </section>
        );
    }

    if (isError) {
        navigate("/");
        return null;
    }

    const handleTreeStatusChange = async ({value , id} : {value: boolean , id : number} ) => {
        try {
            const response = await putBlockUser({
                id: Number(id),
                body: { status: !value },
            }).unwrap();
            if(response.success){
                toast(`User ${!value ? "blocked" : "unblocked"} successfully`)
                setTrigger(true)
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };
    return (
        <div className="min-h-screen text-black bg-popover">

            <div className={'h-10  flex  text-muted bg-popover items-center'}>
                <div className={'w-10 h-full border-r border-popover flex items-center'} onClick={()=>navigate(-1)}>
                    <ChevronLeftIcon className={'w-10 '} />
                </div>
                <div className={'w-full text-center pr-10 space-x-1 flex justify-center'}>
                    <Trans>Users</Trans>
                </div>
            </div>
            <div className="container flex flex-col gap-4 px-2 mx-auto pt-7">

                <div className={''}>
                    {LoggedUser({data : combinedData?.user})}
                </div>
                <div className={'text-white text-xs py-2 '}>
                    <div className={'p-2 border-b flex flex-row items-center justify-between bg-chart-2 border-popover'}>
                        <Button onClick={()=>{
                                if(combinedData?.user) {
                                    handleTreeStatusChange({value : true , id : combinedData?.user?.id})
                                }
                            }} className={'p-0 size-3 bg-card hover:bg-card'}></Button>
                        <Trans>User Balance</Trans>
                        <Button onClick={()=>{
                                if(combinedData?.user) {
                                    handleTreeStatusChange({value : false , id : combinedData?.user.id})
                                }
                            }} className={'p-0 size-3 bg-destructive hover:bg-destructive'}></Button>
                    </div>
                    <div className={'grid grid-cols-4 border-t bg-chart-2 border-x border-popover py-2 px-1'}>
                        <Trans>Username</Trans>
                        <div className={'text-center lg:text-start'}>EUR</div>
                        <div className={'text-center lg:text-start'}>USD</div>
                        <div className={'text-end'}></div>
                    </div>
                    {combinedData && combinedData.children && combinedData.children.length > 0 ? (
                        combinedData.children.map((child: typeof combinedData.children[0]) => {
                            const isOpen = openIds.has(child.id);
                            return (
                                <UserItem
                                    key={child.id}
                                    user={child}
                                    handleChildClick={handleChildClick}
                                    loadedChildren={loadedChildren}
                                    isFetching={isFetching}
                                    openIds={openIds}
                                    toggleOpen={toggleOpen}
                                    isOpen={isOpen}
                                />
                            );
                        })
                    ) : (
                        <Trans>There is no other user</Trans>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserListRender;
import { cn } from "@/lib/utils.ts";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import type { UsersResponse} from "@/types/auth.ts";
import Loading from "@/components/shared/v2/loading.tsx";
import { useLazyGetUserListQuery } from '@/services/authApi.ts';
import { ChevronDown, ChevronRight } from "lucide-react";

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
    return (
        <div className={cn("border border-popover text-white", {
            'animate-pulse bg-popover': isFetching,
            // 'bg-black/20': isOpen,
        })}>
            <div
                className={cn("w-full grid grid-cols-4  pl-2 justify-between items-center cursor-pointer py-1.5", {
                })}
            >

                <div className={'flex items-center  truncate w-full justify-start gap-x-3'} onClick={()=>{
                    navigate(`edit/${user.id}`)
                }}>
                    <p className={'min-w-32'}>{user.username}</p>
                </div>
                <div className={'text-center lg:text-start'}>
                    {(Number((euroBalance.balance ?? 0) / 100)).toLocaleString("en-EN", {
                        minimumFractionDigits: euroBalance.decimal_places,
                        maximumFractionDigits: euroBalance.decimal_places,
                    })}
                </div>
                <div className={'text-center lg:text-start'}>
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
                <div className={cn("" , {
                    'bg-white/20': isOpen,
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
        <div className={'p-2 border-b border-popover'}>
            My balance
        </div>
        {
            data?.wallets.length > 0 && data?.wallets?.map((wallet : any) => {
                return <div className={'p-2 border-b border-popover grid grid-cols-4'}>
                    <p>{wallet.name}</p>
                    <p className={'text-center'}>
                        {(Number(wallet.balance) / 100).toLocaleString("en-EN", {
                            minimumFractionDigits: wallet.decimal_places,
                            maximumFractionDigits: wallet.decimal_places,
                        })}
                    </p>
                </div>
            })
        }

    </div>
}

function UserListRender() {
    const [combinedData, setCombinedData] = useState<UsersResponse | null>(null);
    const [fetchUserList, { isLoading, isError, isFetching }] = useLazyGetUserListQuery();
    const navigate = useNavigate();
    const [loadedChildren, setLoadedChildren] = useState<Set<number>>(new Set());
    const [openIds, setOpenIds] = useState<Set<number>>(new Set());

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

    return (
        <div className="min-h-screen text-black bg-popover">
            <div className="container flex flex-col gap-4 px-2 mx-auto pt-10">
                <div className={''}>
                    {LoggedUser({data : combinedData?.user})}
                </div>
                <div className={'text-white text-xs py-2 '}>
                    <div className={'grid grid-cols-4 border-t border-x border-popover py-2 px-1'}>
                        <div>Username</div>
                        <div className={'text-center lg:text-start'}>Balance (€)</div>
                        <div className={'text-center lg:text-start'}>Balance ($)</div>
                        <div className={'text-end'}>Action</div>
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
                        <p>There is no other user</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserListRender;
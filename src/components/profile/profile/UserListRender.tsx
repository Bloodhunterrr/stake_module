import { cn } from "@/lib/utils.ts";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import type { UsersResponse } from "@/types/auth.ts";
import Loading from "@/components/shared/v2/loading.tsx";
import { useLazyGetUserListQuery } from '@/services/authApi.ts';

function UserItem({ user, handleChildClick, loadedChildren, isFetching, openIds, toggleOpen }: {
    user: any;
    handleChildClick: (id: number) => void;
    loadedChildren: Set<number>;
    isFetching: boolean;
    openIds: Set<number>;
    toggleOpen: (id: number) => void;
}) {
    const hasChildren = user.children && user.children.length > 0;
    const isOpen = openIds.has(user.id);

    return (
        <div className="border p-2 rounded mb-2">
            <div
                className={cn("w-full flex justify-between items-center cursor-pointer", {
                    'bg-red-200': isFetching,
                })}
                onClick={() => {
                    if (hasChildren) {
                        toggleOpen(user.id);
                    } else if (user.is_agent) {
                        handleChildClick(user.id);
                    }
                }}
            >
                <p>{user.email}</p>
                {hasChildren && <span>{isOpen ? '▼' : '▶'}</span>}
            </div>
            {hasChildren && isOpen && user.children && user.children.length > 0 && (
                <div className="pl-4 border-l border-gray-300">
                    {user.children.map((child: typeof user.children[0]) => (
                        <UserItem
                            key={child.id}
                            user={child}
                            handleChildClick={handleChildClick}
                            loadedChildren={loadedChildren}
                            isFetching={isFetching}
                            openIds={openIds}
                            toggleOpen={toggleOpen}
                        />
                    ))}
                </div>
            )}
        </div>
    );
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
            // Open the node immediately
            toggleOpen(childId);
        }

        // Fetch children if not loaded
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
        <div className="min-h-screen text-black bg-white">
            <div className="container mx-auto py-4">
                {combinedData && combinedData.children && combinedData.children.length > 0 ? (
                    combinedData.children.map((child: typeof combinedData.children[0]) => (
                        <UserItem
                            key={child.id}
                            user={child}
                            handleChildClick={handleChildClick}
                            loadedChildren={loadedChildren}
                            isFetching={isFetching}
                            openIds={openIds}
                            toggleOpen={toggleOpen}
                        />
                    ))
                ) : (
                    <p>There is no other user</p>
                )}
            </div>
        </div>
    );
}

export default UserListRender;
import {cn} from "@/lib/utils.ts";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import type {UsersResponse} from "@/types/auth.ts";
import Loading from "@/components/shared/v2/loading.tsx";
import { useLazyGetUserListQuery } from '@/services/authApi.ts';

function UserListRender() {
    const [combinedData, setCombinedData] = useState<UsersResponse>();
    const [fetchUserList, { isLoading, isError , isFetching }] = useLazyGetUserListQuery();
    const navigate = useNavigate();

    const [loadedChildren, setLoadedChildren] = useState(new Set());

    const handleChildClick = async (childId: number) => {
        if (loadedChildren.has(childId)) {
            return;
        }
        try {
            const result = await fetchUserList({ user_id: childId }).unwrap();

            setCombinedData((prevData) => {
                if (!prevData) return result;

                const existingChildren = prevData?.children || [];

                const newUsers = result.children?.filter(
                    (newChild) => !existingChildren.some((child) => child.id === newChild.id)
                ) || [];
                return {
                    user : result.user,
                    children: [...existingChildren, ...newUsers],
                };
            });

            setLoadedChildren((prev) => new Set(prev).add(childId));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUserList({user_id : 0}).then((data)=>{
            setCombinedData(data.data)
        })
    }, []);

    if (isLoading) {
        return (
            <section className={"min-h-screen flex items-center justify-center bg-background"}>
                <Loading />
            </section>
        );
    }

    if (isError) {
        navigate("/");
        return null;
    }

    return (
        <div className={"min-h-screen   text-black bg-white"}>
            <div className={"container mx-auto py-4"}>
                <div className={'border h-32 border-red-200'}>
                    {combinedData?.children && combinedData?.children?.length > 0 ? (
                        combinedData.children.map((child, index) => {
                            console.log(combinedData)
                            return (
                                <div
                                    className={cn("w-full border p-2 rounded-full",{
                                        'bg-red-200' : isFetching
                                    })}
                                    key={index}
                                    onClick={() => {
                                        if(child.is_agent) {
                                            handleChildClick(child.id)
                                        }
                                    }}
                                >
                                    <p>{child.name}</p>
                                </div>
                            )
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
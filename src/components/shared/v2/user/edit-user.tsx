import { useState, useEffect } from 'react';
import Loading from "@/components/shared/v2/loading.tsx";
import { useLazyGetUserListQuery } from '@/services/authApi.ts';
import {useNavigate, useParams} from "react-router";
import type {UsersResponse} from "@/types/auth.ts";


function UserListRender() {
    const { userId } = useParams()
    const navigate = useNavigate();
    const [data, setData] = useState<UsersResponse | null>(null)
    const [fetchUserList, { isLoading, isError, isFetching }] = useLazyGetUserListQuery();

       useEffect(() => {
        fetchUserList({ user_id: (Number(userId ?? 0)) }).then((data: any) => {
            setData(data?.data);
        });
    }, []);

    if (isLoading) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-background">
                <Loading />
            </section>
        );
    }
    console.log(data)

    if (isError) {
        navigate("/");
        return null;
    }

    return (
        <div className="min-h-screen text-black bg-white">
            <div className="container mx-auto pt-10">
                {
                    isFetching && <p>Loading...</p>
                }
                <pre>{JSON.stringify(data?.user , null , 2)}</pre>
            </div>
        </div>
    );
}

export default UserListRender;
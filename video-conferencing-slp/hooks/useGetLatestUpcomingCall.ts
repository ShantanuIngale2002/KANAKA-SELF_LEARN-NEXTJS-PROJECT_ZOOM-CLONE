import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";


export const useGetLatestUpcomingCall = () =>{

    const {user} = useUser();
    const client = useStreamVideoClient();

    const [isLoading, setIsLoading] = useState(false);
    const [upcomingCalls, setUpcomingCalls] = useState<Call[]>([]);

    
    useEffect(()=>{

        const loadUpcomingCalls = async ()=> {
            
            if(!client || !user?.id)    return;
            
            setIsLoading(true);

            try{
                const mins30 = 1000 * 60 * 30;
                const fromNow = new Date(Date.now()).toISOString();
                const uptoNext30mins = new Date(Date.now() + mins30).toISOString();

                const {calls} = await client.queryCalls({
                    sort: [{field: 'starts_at', direction: 1}],
                    filter_conditions:{
                        starts_at: {$gt: fromNow},
                        $or:[
                            {created_by_user_id: user.id},
                            {members: {$in: [user.id]}},
                        ]
                    }
                });

                setUpcomingCalls(calls);
            }
            catch(error){ console.log(error); }
            finally{ setIsLoading(false); }
        }
        
        loadUpcomingCalls();

    },[client, user?.id])


    return {lastestUpcomingCall : upcomingCalls[0]?.state.startsAt, isLoading};

}
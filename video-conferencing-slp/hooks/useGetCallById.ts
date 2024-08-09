

import { useEffect, useState } from 'react';

import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';


export const useGetCallById = (id: string | string[]) => {

    const [call, setCall] = useState<Call>();
    const [isCallLoading, setIsCallLoading] = useState(true);

    const client = useStreamVideoClient();      // get current client from stream

    // handle call, and flag : if call succeed / loading
    useEffect(() => {   

        if (!client) return;

        // async func to load call w/ updated client or id's
        const loadCall = async () => {
            try {
                // https://getstream.io/video/docs/react/guides/querying-calls/#filters
                const { calls } = await client.queryCalls({ filter_conditions: { id } });

                if (calls.length > 0) setCall(calls[0]);    // set call

                setIsCallLoading(false);    // call succeed
            }
            catch (error) {
                console.error(error);
                setIsCallLoading(false);
            }
        };

        loadCall();     // calling the func

    }, [client, id]);   // on change


    return { call, isCallLoading };     // return call and flag obj
};
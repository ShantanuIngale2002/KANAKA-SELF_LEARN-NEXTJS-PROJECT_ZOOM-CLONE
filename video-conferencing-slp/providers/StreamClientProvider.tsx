// got error, bcz not set to client

'use client'


import { tokenProvider } from '@/actions/stream.actions';
import { useUser } from '@clerk/nextjs';
import Loader from '../components/Loader'

import {
    StreamVideo,
    StreamVideoClient
} from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {

    // to store client
    const [videoClient, setVideoClient] = useState<StreamVideoClient>();

    const { user, isLoaded } = useUser();     // returns user from clerk

    useEffect(() => {     // update client on changing params

        if (!isLoaded || !user || !apiKey) return;
        // if(!apiKey) throw new Error('Stream API key missing!');
        try {
            const client = new StreamVideoClient({      // acquire new client
                apiKey,
                user: {
                    id: user?.id,
                    name: user?.username || user?.id,
                    image: user?.imageUrl
                },
                tokenProvider,  // from stream.actions.ts
            });

            setVideoClient(client); // load client to state
        } 
        catch (error) {
            console.error('Error initializing StreamVideoClient:', error);
        }
    }, [user, isLoaded, apiKey]);   // if change -> useEffect


    if (!videoClient) { return <Loader /> } // if no user hence client


    return (
        <StreamVideo client={videoClient}>
            {children}
        </StreamVideo>
    );
};

export default StreamVideoProvider;
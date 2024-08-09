
'use client'


import React, { useState } from 'react'

import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';

import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import Loader from '@/components/Loader';



// [id] ie. parent folder is dynamic parameter for route, which accepted by this page.tsx
const Meeting = ({ params: { id } }: { params: { id: string } }) => {

    const { user, isLoaded } = useUser();

    const [isSetupComplete, setIsSetupComplete] = useState(false);

    // custom hook for call
    const { call, isCallLoading } = useGetCallById(id);

    if (!isLoaded || isCallLoading) return <Loader />       // if not user or call is init'ed



    return (
        <main className="h-screen w-full">

            <StreamCall call={call}>    {/* init call to StreamCall provider */}
                <StreamTheme>           {/* css component where css imported in app/layout.tsx */}
                    {!isSetupComplete   // if false
                        ? (
                            <MeetingSetup setIsSetupComplete = {setIsSetupComplete} /> // isSetupComplete := true
                        ) 
                        : (             // else true
                            <MeetingRoom />
                        )
                    }
                </StreamTheme>
            </StreamCall>

        </main>
    )
}

export default Meeting
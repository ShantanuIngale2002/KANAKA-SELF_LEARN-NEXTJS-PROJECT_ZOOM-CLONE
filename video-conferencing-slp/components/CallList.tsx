// @ts-nocheck

// above line ignores the errors for Call : Call | Recording ie. which type

'use client'

import { useGetCalls } from '@/hooks/useGetCalls';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { useToast } from './ui/use-toast';



const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    
    const {toast} = useToast();

    const router = useRouter();

    const { endedCalls, upcomingCalls, callRecordings, isLoading } = useGetCalls();

    const [recordings, setRecordings] = useState<CallRecording[]>([]);


    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedCalls
            case 'recordings':
                return recordings;
            case 'upcoming':
                return upcomingCalls
            default:
                return []
        }
    }

    const getNoCallsMessage = () => {
        switch (type) {
            case 'ended':
                return "No Previous Calls";
            case 'recordings':
                return "No Recordings";
            case 'upcoming':
                return "No Upcoming Calls";
            default:
                return ""
        }
    }


    useEffect(()=>{
        const fetchRecordings = async () => {
            try{
                const callData = await Promise.all(callRecordings.map((meeting)=> meeting.queryRecordings()));
                const filterCallData = callData
                                            .filter(call => call.recordings.length>0)
                                            .flatMap(call => call.recordings)
                                            ;
                // flatMap is used if data is array of arrays as [ [rec1], [rec2] , ... ] it flats it so single array as [ rec1, rec2, ... ]
                setRecordings(filterCallData);
            }
            catch(error){ toast({title:"Try again later !!"}); }
        }

        if(type==='recordings')     fetchRecordings();
    }, [type, callRecordings])

    const calls = getCalls();
    const noCallsMessage = getNoCallsMessage();

    if(isLoading)   return <Loader />


    return (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {
                calls && calls.length>0
                ?   calls.map((meeting: Call | CallRecording) => (
                            <MeetingCard
                                key={(meeting as Call).id}
                                icon={
                                    type==='upcoming'  
                                    ? '/icons/upcoming.svg'
                                    :   type==='ended'
                                        ? '/icons/previous.svg'
                                        : '/icons/recordings.svg'
                                }
                                title={ (meeting as Call).state?.custom.description?.substring(0,20) || meeting.filename?.substring(0,20) || 'Personal Meeting' }
                                date={ (meeting as Call).state?.startsAt?.toLocaleString() || meeting.start_time.toLocaleString() }
                                isPreviousMeeting={type==='ended'}
                                isRecordings={type==='recordings'}
                                buttonIcon1={type==='recordings' ? '/icons/play.svg' : undefined}
                                buttonText={type==='recordings' ? 'Play' : 'Start'}
                                link={type==='recordings' ? meeting.url : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
                                handleClick={
                                    type==='recordings'
                                    ?   () => router.push(`${meeting.url}`)
                                    :   () => router.push(`/meeting/${meeting.id}`)
                                }
                            />
                        )
                    )
                :   (
                        <h1> {noCallsMessage} </h1>   
                    )
            }


        </div>
    )
}

export default CallList
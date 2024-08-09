import React, { useState } from 'react'

import { cn } from '@/lib/utils';
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react';
import { Button } from './ui/button';

import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import Loader from './Loader';


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';



const MeetingRoom = () => {

    const router = useRouter();

    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal'); // if 'personal' then !(!'personal') ie. !false ie true || also !undefined = true

    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');   // participants view layout

    const [showParticipants, setShowParticipants] = useState(false);    // to show/hide users

    const {useCallCallingState} = useCallStateHooks();  // acquiring all call state hooks

    const callingState = useCallCallingState();         // 

    if(callingState != CallingState.JOINED){
        return <Loader />
    }

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />

            case 'speaker-left':
                return <SpeakerLayout participantsBarPosition={'left'} />

            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition={'right'} />
        }
    }


    return (

        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">

            <div className="relative flex size-full items-center justify-center">

                <div className="flex size-full max-w-[1000px] items-center">
                    <CallLayout />
                </div>

                <div className={cn("h-[calc(100vh-86px)] hidden ml-2", { 'show-block': showParticipants })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>

            </div>

            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
                
                {/* call-controls w/ call end route to home page */}
                <CallControls onLeave={() => router.push("/home")}/>

                <DropdownMenu>

                    <div className="flex items-center">
                        
                        <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]'>
                            <LayoutList size={20} className="text-white" />
                        </DropdownMenuTrigger>

                    </div>
                    
                    <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                        
                        {['Grid', 'Speaker-Left','Speaker-Right'].map((item, index) => (
                                <div key={index}>
                                    <DropdownMenuItem className='cursor-pointer'
                                                    onClick={()=>{
                                                        setLayout(item.toLowerCase() as CallLayoutType)
                                                    }}
                                    >
                                        {item}
                                    </DropdownMenuItem>
                                </div>
                            )
                        )}

                        <DropdownMenuSeparator className="border-dark-1" />

                    </DropdownMenuContent>
                    
                </DropdownMenu>

                <CallStatsButton />    {/* live call stats */}
                
                <Button onClick={()=> setShowParticipants
                                        ((prev) => !prev)
                                }
                >
                    <div className="cursor-pointer rounded-2xl bg-[#19232D] px-4 py-2 hover:bg-[#4C535B]">
                        <Users size={20} className='text-white' />
                    </div>
                </Button>


                { !isPersonalRoom && <EndCallButton /> }

            </div>

        </section>

    )
}

export default MeetingRoom
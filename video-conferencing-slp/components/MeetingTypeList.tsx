'use client'


import React from 'react';
import ReactDatePicker from 'react-datepicker';

import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

import HomeCard from '../components/HomeCard'
import MeetingModal from './MeetingModal';

import { useToast } from './ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"



const MeetingTypeList = () => {

    const router = useRouter();
    
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();      // state of meet changing on card click

    const {user} = useUser();                   // get current user at clerk
    const client = useStreamVideoClient();      // get current client at stream

    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    }); // to store meet req values.

    const [callDetails, setCallDetails] = useState<Call>(); // init call details w/ Call type

    const {toast} = useToast();     // using shadcn/ui : Toaster's useToast state


    const createMeeting = async () =>{
        
        if(!client || !user)    return;

        try{
            if(!values.dateTime){ toast( { title: "Please select a date and time" } ); }

            const id = crypto.randomUUID();                 // crypto : glocal property is js. Generates quite random values, here ID using randomUUID() func
            const call = client.call('default', id);        // creating default type call w/ unique id for the client
            
            if(!call) throw new Error("Failed to load a call !!");

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant Meeting";

            // exist then get else create new call
            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom:{
                        description,
                    },
                },
            });
            // update call details
            setCallDetails(call);

            // update app/page.tsx state to show scheduled meet time above Clock time as HH:MM AM/PM 
            //setScheduledMeetTime(new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(values.dateTime));

            if(!values.description){
                router.push(`/meeting/${call.id}`);     // ie. instant meet
            }
            toast( { title: "Meeting is created" } );   // success toast
        }
        catch(err){
            console.log(err);
            toast( { title: "Failed to create meeting" } );
        }
    }


    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`




    return (

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <HomeCard
                cardImage = 'icons/add-meeting.svg'
                title = 'New Meeting'
                desc = 'Start a new meeting'
                className = 'bg-orange-1'
                handleClick = {()=>{setMeetingState('isInstantMeeting')}}
            />

            <HomeCard
                cardImage = 'icons/schedule.svg'
                title = 'Schedule a Meeting'
                desc = 'Plan your meeting'
                className = 'bg-blue-1'
                handleClick = {()=>{setMeetingState('isScheduleMeeting')}}
            />

            <HomeCard
                cardImage = 'icons/recordings.svg'
                title = 'View Recordings'
                desc = 'Check out your recordings'
                className = 'bg-purple-1'
                handleClick = {()=>{router.push('/recordings')}}
            />

            <HomeCard
                cardImage = 'icons/join-meeting.svg'
                title = 'Join Meeting'
                desc = 'Join via invitation link'
                className = 'bg-yellow-1'
                handleClick = {()=>{setMeetingState('isJoiningMeeting')}}
            />


            {
                !callDetails        // not THEN schedule it ELSE show scheduled
                ?   (
                        <MeetingModal
                            isOpen = {meetingState === 'isScheduleMeeting'}
                            onClose = {()=>{setMeetingState(undefined)}}
                            title = "Create a Meeting"
                            handleClick = {createMeeting}
                        >
                            {/* additional data */}
                            <div className="flex flex-col gap-2 5">
                                <label className="text-base text-normal leading-[22px] text-sky-2">
                                    Add a description
                                </label>
                                <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' 
                                            onChange={(e) => setValues({...values, description: e.target.value})}
                                />

                                <label className="text-base text-normal leading-[22px] text-sky-2">
                                    Select Date and Time
                                </label>
                                {/* datepicker has css imported in app/layout.tsx */}
                                <ReactDatePicker
                                    selected={values.dateTime}
                                    onChange={(date) => setValues({...values, dateTime: date!})}
                                    showTimeSelect
                                    timeFormat='HH:mm'
                                    timeIntervals={15}
                                    timeCaption='time'
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                                />
                            </div>
                        </MeetingModal>
                    )
                :   (        
                        <MeetingModal
                            isOpen = {meetingState === 'isScheduleMeeting'}     
                            onClose = {()=>{setMeetingState(undefined)}}
                            title = "Meeting Created At"
                            className = "text-center"
                            handleClick = {()=>{
                                navigator.clipboard.writeText(meetingLink);
                                toast({title: 'Link Copied'})
                            }}
                            image='/icons/checked.svg'
                            buttonIcon='/icons/copy.svg'
                            buttonText = "Copy Meeting Link"
                        >
                            <div className="text-center text-cyan-300 bg-dark-3 rounded-lg p-2">
                                {meetingLink}
                            </div>
                        </MeetingModal>
                    )
            }

            {/* instant meet modal */}
            <MeetingModal
                isOpen = {meetingState === 'isInstantMeeting'}
                onClose = {()=>{setMeetingState(undefined)}}
                title = "Start an instance meeting"
                className = "text-center"
                buttonText = "Start Meeting"
                handleClick = {createMeeting}
            />

            {/* join meet modal */}
            <MeetingModal
                isOpen = {meetingState === 'isJoiningMeeting'}
                onClose = {()=>{setMeetingState(undefined)}}
                title = "Type the link here"
                className = "text-center"
                buttonText = "Join Meeting"
                handleClick = {() => router.push(values.link)}
            >
                <Input  placeholder='Meeting Link'
                        className='bg-dark-3 border-none focus-visible:ring-0 focus-visible:ring-offset-0'
                        onChange={(e) => setValues({...values, link:e.target.value})}
                />
            </MeetingModal>

        </section>
    )
}

export default MeetingTypeList
'use client'

import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetLatestUpcomingCall } from '@/hooks/useGetLatestUpcomingCall';
import React, { useEffect, useState } from 'react'

const Home = () => {

    const [time, setTime] = useState('');
    const [date, setDate] = useState('');
    
    const {lastestUpcomingCall, isLoading} = useGetLatestUpcomingCall();    // get latest call time by custom hook

    let latestUpcomingCallTimeString = "Loading Latest Upcoming Call";
    if(!isLoading){
        latestUpcomingCallTimeString = `${lastestUpcomingCall?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()} 
                                            | ${lastestUpcomingCall?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`; 
    };

    useEffect(()=>{
        const updateDateTime = () => {
            let now = new Date();
            setTime(now.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'}).toUpperCase());
            setDate((new Intl.DateTimeFormat('en-IN', {dateStyle: 'full'})).format(now));
        }           

        updateDateTime();

        const interval = setInterval(updateDateTime, 6000);

        return () => clearInterval(interval);
    },[])



    return (
        <section className="flex size-full flex-col gap-10 text-white">
            
            <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">

                <div className="flex h-full flex-col justify-between max-md:px-5 max:md:py-8 lg:p-11">

                    <h2 className='glassmorphism w-fit rounded m-2 p-2 text-center text-base font-normal text-nowrap'> 
                        {
                            isLoading ? latestUpcomingCallTimeString
                            :   !lastestUpcomingCall
                                ?   "No any Upcoming Meeting"
                                :   "Upcoming Meet at ~ " + latestUpcomingCallTimeString
                        }
                    </h2>

                    <div className="flex flex-col gap-2">
                        <h1 className='text-4xl font-extrabold lg:text-7xl'>
                            {time}
                        </h1>
                        <p className='text-lg font-medium text-sky-1 lg:text-2xl'>
                            {date}
                        </p>
                    </div>

                </div>

            </div>

            <MeetingTypeList />
            {/* <MeetingTypeList setScheduledMeetTime={setScheduledMeetTime}  /> */}

        </section>
    )
}

export default Home
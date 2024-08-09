


import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'


interface HomeCardProps {
    cardImage : string,
    title : string,
    desc : string,
    className : string,
    handleClick : () => void,
}

// params-type init using interface
const HomeCard = ( {cardImage, title, desc, className, handleClick} : HomeCardProps ) => {
    
    return (

        <div className={cn("flex justify-between flex-col px-4 py-6 w-full xl:max-w-[720px] min-h-[260px] rounded-[14px] cursor-pointer", className)}
            onClick={handleClick}
        >

            <div className="flex-center glassmorphism size-12 rounded-[10px]">
                <Image
                    src={cardImage}
                    alt='meeting'
                    width={27} height={27}
                />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className='text-2xl font-bold'> {title} </h1>
                <p className='text-lg font-normal'> {desc} </p>
            </div>

        </div>

    )
}

export default HomeCard

'use client'

import { useRouter } from 'next/navigation'

const Root = () => {

    const router = useRouter();

    if(true){
        router.push('/home')
    }
}

export default Root
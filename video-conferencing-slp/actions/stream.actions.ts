// special use-server directive used since it will run only over server
'use server'


import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

// stream req api and secret key
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;


export const tokenProvider = async () => {
    
    // current user at clerk
    const user = await currentUser();

    if(!user)   throw new Error('User is not logged in!');
    if(!apiKey) throw new Error('No API key');
    if(!apiSecret) throw new Error('No SECRET key');

    const client = new StreamClient(apiKey, apiSecret); // client init

    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

    const issued = Math.floor(Date.now() / 1000) - 60;

    const token  = client.createToken(user.id, exp, issued);    // creating token

    return token;

}


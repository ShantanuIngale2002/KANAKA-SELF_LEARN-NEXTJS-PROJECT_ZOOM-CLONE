import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

// w/o this many stream components such as SteamSettings in meetingroom.tsx were not working !!
// stream css imported and <StreamTheme> for css used in meeting/[id]/page.tsx
import '@stream-io/video-react-sdk/dist/css/styles.css';

// w/o this date-picker' styling in MeetingTypeList will not work properly
import 'react-datepicker/dist/react-datepicker.css';

import { Toaster } from "@/components/ui/toaster";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "XOOM",
    description: "Video Calling App",
    icons: {
        icon: "icons/logo.svg"
    }
};

export default function RootLayout( {children,}: Readonly<{children: React.ReactNode;}> ) {
    return (
        <html lang="en">
                        {/* custom bg >> tailwind.config -> extend.color.dark.1/2 */}
            <ClerkProvider
                appearance={{
                    layout: {
                        logoImageUrl: 'icons/yoom-logo.svg',
                        socialButtonsVariant: 'iconButton'
                    },
                    variables: {
                        colorText: '#fff',
                        colorPrimary: '#0E78F9',
                        colorBackground: '#1C1F2E',
                        colorInputBackground: '#252A41',
                        colorInputText: '#fff'
                    }
                }}
            >
                <body className={`${inter.className} bg-dark-2 text-white`}>
                    {children}
                    <Toaster />
                </body>
            </ClerkProvider>
        </html>
    );
}

import {FaGoogle} from "react-icons/fa6";
import {FaApple} from "react-icons/fa";

export const parseProvider = (provider: string) => {
    switch (provider) {
        case 'oauth_google':
            return 'Google'
        case 'oauth_apple':
            return 'Apple'
        default:
            return 'Unknown'
    }
}

export const parseProviderToIcon = (provider: string) => {
    switch (provider) {
        case 'oauth_google':
            return <FaGoogle />
        case 'oauth_apple':
            return <FaApple />
        default:
            return 'Unknown'
    }
}
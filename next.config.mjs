/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'yt3.ggpht.com',
                port: '',
                pathname: '**',
            }, {
                protocol: 'https',
                hostname: 'yt3.googleusercontent.com',
                port: '',
                pathname: '**',
            }, {
                protocol: 'https',
                hostname: 'i.ytimg.com',
                port: '',
                pathname: '**',
            }, {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '10000',
                pathname: '**',
            }
        ],
    },
};

export default nextConfig;

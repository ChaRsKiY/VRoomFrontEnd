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
            }
        ],
    },
};

export default nextConfig;

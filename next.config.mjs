/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://95.217.212.221:5024/api/:path*",
            },
        ]
    },
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
            },
            {
                protocol: 'https',
                hostname: 'myblobcont.blob.core.windows.net',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'www.alpbachtal.at',
                port: '',
                pathname: '**',
            },
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
   
};

export default nextConfig;

 



/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{ hostname: '*' }],
    },

    // seehttps://github.dev/wslyvh/nexth
    // webpack: (config) => {
    //     config.externals.push('pino-pretty', 'lokijs', 'encoding')
    //     return config
    // },
}

export default nextConfig;

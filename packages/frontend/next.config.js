/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    COVALENT_KEY: process.env.COVALENT_KEY,
    DEV_ADDRESS: process.env.DEV_ADDRESS,
    DEV_MODE: process.env.DEV_MODE,
    NFT_PORT_KEY: process.env.NFT_PORT_KEY,
  },
}

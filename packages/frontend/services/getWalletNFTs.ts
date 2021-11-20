import axios from 'axios';
    
const cov_key: string = process.env.COVALENT_KEY || '';

// mainnet
const chain_id: string = '1';

const getNFTAPI = (
    key: string,
    addr: string,
    chain_id: string,
): string => {
    return `https://api.covalenthq.com/v1/${chain_id}/address/${addr}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=${key}`;
    //      https://api.covalenthq.com/v1/1/address/0xa2ba04f43ca44304657364fb94c5e6ba0f3d8ebc/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=ckey_8d908da0e8b5452fb0276dcd416
};

export const getWalletNFTs = async (address: string) => {
    const res = await axios.get(getNFTAPI(cov_key, address, chain_id));
    if (res.status !== 200) {
        console.error("Error: request failed", res);
    }
    const tokens: any = [];
    
    res.data.data.items.forEach((item: any) => {
        if (item.type !== 'nft') {
            return;
        }
        
        if (item?.nft_data?.length > 0) {
            item.nft_data.forEach((nft: any) => {
                tokens.push({
                    contract_address: item.contract_address,
                    name: nft.external_data?.name,
                    description: nft.external_data?.description,
                    image: nft.external_data?.image_256,
                    tokenId: nft.token_id,
                });
            });
        }
    });
    return tokens;
};
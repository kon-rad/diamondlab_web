import axios from 'axios';

export const searchNFTs = async (keyword: string) => {
    const url = `https://api.nftport.xyz/v0/search?text=${keyword}&chain=all`;

    const res = await axios.get(url, {
        headers: {
            'Authorization': process.env.NFT_PORT_KEY || '',
            'Content-Type': 'application/json'
        }
    });
    if (res.status !== 200) {
        console.error('Error: request failed', res);
        return [];
    }

    const nftArr = res.data.search_results.map((elem: any) => {
        return {
            contract_address: elem.contract_address,
            image: elem.cached_file_url,
            name: elem.name,
            opensea_cached_image: elem.cached_file_url,
            token_id: elem.token_id,
            description: elem.description,
            mint_date: elem.mint_date,
            chain: elem.chain,
        }
    })
    return nftArr;
}

/**
 * cached_file_url: "https://storage.googleapis.com/sentinel-nft/raw-assets/c_0x3b3ee1931dc30c1957379fac9aba94d1c48a5405_t_85621_raw_asset.mp4"
chain: "ethereum"
contract_address: "0x3b3ee1931dc30c1957379fac9aba94d1c48a5405"
description: "SPACE IN SPACE\n\nMe in space\nMy space in space\nSpace in space\nEverything has its space.\n\n( 1836 x 1836 , 2021 )"
mint_date: null
name: "SPACE IN SPACE"
token_id: "85621"
 */
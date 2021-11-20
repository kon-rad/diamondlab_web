import { Web3Provider } from '@ethersproject/providers'
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { nftAddress, dlMarketAddress } from '../config';

import NFT from '../artifacts/contracts/DLNFT.sol/DLNFT.json';
import Market from '../artifacts/contracts/DLMarket.sol/DLMarket.json';

// @ts-ignore
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export async function uploadImageToIPFS(file: any): Promise<string> {

    const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
}

export async function createPost(address: string, provider: Web3Provider, description: string, fileUrl: string, price: string): Promise<string| undefined>  {

    if (!description || !fileUrl || !price) {
        console.error('Error: missing data: ', description, fileUrl, price);
        return;
    }

    try {
        /* first, upload to IPFS */
        const data = JSON.stringify({
            description,
            image: fileUrl,
        });
        // const added = await client.add(data);
        // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        // todo: remove dev mode
        const url = "https://ipfs.infura.io/ipfs/QmeeDx14Vxy4gyD1YCq1M49Ysf9oaDN7XWCjmpFq9yvRf5";
        console.log('creating sale: ', url, price, address);
        /* after file is uploaded to nftStorage, pass the URL to save it on blockchain */
        createSale(url, price, address, provider);
    } catch (error) {
        console.log(`Error uploading file: ${error}`);
    }
}

async function createSale(url: string, price: string, address: string, provider: Web3Provider) {
    const signer = provider.getSigner();

    console.log('create post 1');
    /* next, create the item */
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await nftContract.createToken(url);
    const tx = await transaction.wait();
    console.log("tx:", tx);
    if (tx.events.length < 1) {
        console.error('tx has no events. tx: ', tx);
        return;
    }
    console.log('create post 2');
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const ethPrice = ethers.utils.parseUnits(price, 'ether');
    console.log('create post 3');

    /* then list the item for sale on the marketplace */
    const marketContract = new ethers.Contract(dlMarketAddress, Market.abi, signer);
    let listingPrice = await marketContract.getListingPrice();
    listingPrice = listingPrice.toString();
    console.log('create post 4');

    transaction = await marketContract.createMarketItem(nftAddress, tokenId, ethPrice, {
        value: listingPrice,
    });
    console.log('create post --- 5')
    await transaction.wait();
}
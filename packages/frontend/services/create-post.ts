import { Web3Provider } from '@ethersproject/providers'
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

export async function uploadImageToIPFS(file: any, client: any): Promise<string> {

    const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
}

export async function createPost(address: string, provider: Web3Provider, description: string, fileUrl: string, price: string): Promise<string> | undefined {

    if (!description || !fileUrl || !price) {
        return;
    }

    try {
        /* first, upload to IPFS */
        const data = JSON.stringify({
            description,
            image: fileUrl,
        });
        const added = await client.add(data);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        /* after file is uploaded to nftStorage, pass the URL to save it on blockchain */
        createSale(url);
    } catch (error) {
        console.log(`Error uploading file: ${error}`);
    }
}

async function createSale(url: string) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftAddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    const tx = await transaction.wait();
    if (tx.events.length < 1) {
    console.error('tx has no events. tx: ', tx);
    return;
    }
    const event = tx.events[0];
    const value = event.args[2];
    const tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(meditationData.price, 'ether');

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(dlMarketAddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftAddress, tokenId, price, {
    value: listingPrice,
    });
    await transaction.wait();
}
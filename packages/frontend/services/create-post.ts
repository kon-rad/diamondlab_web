import { Web3Provider } from '@ethersproject/providers'

export async function createPost(address: string, provider: Web3Provider): Promise<string> {

}

export async function uploadImageToIPFS(address: string, provider: Web3Provider, file: any, client: any): Promise<string> {

    const added = await client.add(file, {
        progress: (prog: any) => console.log(`received: ${prog}`),
    });
    return `https://ipfs.infura.io/ipfs/${added.path}`;
}


async function handleImageUpload(e: any) {
    if (!e || !e.target || !e.target.files || !e.target.files[0]) {
      setFileUrl(null);
      return;
    }
    const file = e.target.files[0];
    try {
      // nft.storage was returning 500 type error - it was reported on discord that it was down
    //   if (useIPFS) {
        const added = await client.add(file, {
          progress: (prog: any) => console.log(`received: ${prog}`),
        });
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        setFileUrl(url);
        setFileUpload(file);
    //   }
    } catch (error) {
      console.log(`Error uploading file: ${error}`);
    }
  }

async function createMarket() {
const { firstName, lastName } = user;
const { price } = meditationData;
if (!firstName || !lastName || !price) {
  return;
}
const imageData = fileUrl ? fileUrl : meditationData.avatarBase64;

try {
  /* first, upload to IPFS */
//   if (useIPFS) {
    const data = JSON.stringify({
      ...user,
      ...meditationData,
      image: imageData,
    });
    const added = await client.add(data);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    /* after file is uploaded to nftStorage, pass the URL to save it on blockchain */
    createSale(url);
//   } else {
//     const metadata = await storeNft({
//       name: user.firstName + ' meditation',
//       ...user,
//       ...meditationData,
//       image: fileUpload,
//     });
//   }
} catch (error) {
  console.log(`Error uploading file: ${error}`);
}
}

async function createSale(url: any) {
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
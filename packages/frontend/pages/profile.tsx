import { useEffect, useState } from 'react';
import {
    Container,
    Button,
    Flex,
    Box,
    Grid,
    GridItem,
    Image,
} from '@chakra-ui/react';
import DisplayGrid from '../components/displayGrid';
import { getWalletNFTs } from '../services/getWalletNFTs';
import CeramicClient from '@ceramicnetwork/http-client'
import KeyDidResolver from 'key-did-resolver'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import { DID } from 'dids'
import { ThreeIdConnect,  EthereumAuthProvider } from '@3id/connect'
import { useWeb3React } from '@web3-react/core'
import { TileDocument } from '@ceramicnetwork/stream-tile';

type NFT = {
    contract_address: string;
    contract_name: string;
    contract_ticker_symbol: string;
    image: string;
    nft_name: string;
    original_owner: string;
    token_id: string;
    token_url: string;
};

const dev_addr: string = process.env.DEV_ADDRESS || '';
const dev_mode: string = process.env.DEV_MODE || '';

let addr: string;
if (dev_mode === '1') {
    addr = dev_addr;
    // } else {
    //   getAddr(signer).then((a) => {
    //     // setAddr(a);
    //     addr = a;
    //   });
}
const Profile = () => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [nftList, setNFTList] = useState<NFT[]>([]);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    
    const web3 = useWeb3React()
    
    useEffect(() => {
        fetchNfts();
        console.log('effect');
    }, []);

    const fetchNfts = async () => {
        setIsFetching(true);
        const tokens = await getWalletNFTs(addr);
        setNFTList(tokens);
        setIsFetching(false);
    };
    console.log("nftList: ", nftList);
    const login = async () => {
        // read/write testnet node
        const API_URL = "https://ceramic-clay.3boxlabs.com";
        const ceramic = new CeramicClient(API_URL)
        const resolver = {
        ...KeyDidResolver.getResolver(),
        ...ThreeIdResolver.getResolver(ceramic),
        }
        const did = new DID({ resolver })
        ceramic.did = did

        const address = web3.account;
        if (!address) {
            return;
        }
        const threeIdConnect = new ThreeIdConnect()
        const authProvider = new EthereumAuthProvider(web3.library, address)
        await threeIdConnect.connect(authProvider)

        const provider = await threeIdConnect.getDidProvider()
        ceramic.did.setProvider(provider)
        await ceramic.did.authenticate()
        console.log("authenitcated: ", ceramic.did);
        
    }
    const createProfile = async (ceramic: any, content: any) => {
        const doc = await TileDocument.create(
            ceramic,
            content,
            {
              controllers: [ceramic.did.id],
              family: 'dmlb_profile',
            }
        );

        const streamId = doc.id.toString();
    }
    const updateProfile = async (ceramic: any, streamId: string, content: any) => {
        const doc = await TileDocument.load(ceramic, streamId);
        await doc.update(content);
    }
    const readProfile = async (ceramic: any, streamId: string) => {
        const doc = await TileDocument.load(ceramic, streamId);
        return doc;
    }
    const handleEdit = () => {
        setEditMode(!editMode);
    }
    return (
        <Box mt={6}>
            <Flex justifyContent="center">
                <Box maxWidth="900px">
                    <Grid
                        h="260px"
                        templateRows="repeat(2, 1fr)"
                        templateColumns="repeat(5, 1fr)"
                        gap={4}
                    >
                        <GridItem rowSpan={2} colSpan={1}>
                            <Image
                                borderRadius="xl"
                                src={'/resources/images/logo.png'}
                                alt="avatar image"
                                boxSize="120px"
                                objectFit="cover"
                                cursor="pointer"
                            />
                        </GridItem>
                        <GridItem colSpan={3}>
                            Name and address
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Flex>
                                <Button mr={4}>Like</Button>
                                <Button>Follow</Button>
                                {isOwner && <Button onClick={handleEdit}>Edit</Button>}
                            </Flex>
                        </GridItem>
                        <GridItem colSpan={4}>Bio here</GridItem>
                    </Grid>
                </Box>
            </Flex>
            <DisplayGrid nfts={nftList} />
        </Box>
    );
};

export default Profile;

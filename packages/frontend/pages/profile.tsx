import React, { useEffect, useState } from 'react';
import {
    Input,
    Text,
    Textarea,
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
import { ThreeIdConnect } from '@3id/connect'
import { useWeb3React } from '@web3-react/core'
import { TileDocument } from '@ceramicnetwork/stream-tile';
// import { Core } from '@self.id/core'
import { EthereumAuthProvider, SelfID } from '@self.id/web'
import { read } from 'fs';
import { Core } from '@self.id/core'

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
    const [isOwner, setIsOwner] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [bio, setBio] = useState<string>("");
    const [location, setLocation] = useState<string>("");

    const web3 = useWeb3React()
    const core = new Core({ ceramic: 'testnet-clay' })

    const MOCK_PROFILE = {
        name: "Konrad Gnat",
        description: "a web 3 code passionate about the intersection of art and technology. Enjoys long distance running, meditation, reading and traveling.",
    }
    
    useEffect(() => {
        fetchNfts();
        getProfile();
    }, []);

    const fetchNfts = async () => {
        setIsFetching(true);
        const tokens = await getWalletNFTs(addr);
        setNFTList(tokens);
        setIsFetching(false);
    };
    const handleEdit = async () => {
        setIsEditing(!isEditing);
    }
    const setProfile = async () => {
        if (!web3.account) {
            return;
        }
        const self = await SelfID.authenticate({
            authProvider: new EthereumAuthProvider(window.ethereum, web3.account),
            ceramic: 'local',
            connectNetwork: 'testnet-clay',
        })

        const profile = {
            name,
            description: bio,
            location,
        }
        await self.set('basicProfile', profile)
        console.log("saved: ", profile);
        console.log("id: ", self.id);
        
        // did:3:kjzl6cwe1jw148fea5wgifatlt07ogdyjjaaup37qgq3h1t6rbd42zoqswusqp4
    }
    const getProfile = async () => {
        if (!window.ethereum) {
            return;
        }
        const addresses = await window.ethereum.enable()

        const self = await SelfID.authenticate({
            authProvider: new EthereumAuthProvider(window.ethereum, addresses[0]),
            ceramic: 'local',
            connectNetwork: 'testnet-clay',
        })

        const data = await self.get('basicProfile');
        setName(data.name);
        setBio(data.description);
        setLocation(data.location);
    }
    const handleLik = () => {
        console.log("like button clicked");
    }
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }
    const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(event.target.value);
    }
    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    }
    const handleSave = () => {
        setProfile();
        setIsEditing(false);
    }
    const renderHeading = () => {
        if (isEditing) {
            return (
                <Flex flexDirection="column">
                    <Input placeholder="name" mb={2} onChange={handleNameChange} value={name} name="name" type="text" />
                    <Input placeholder="location" onChange={handleLocationChange} value={location} name="location" type="text" />
                </Flex>
            )
        }
        return (
            <Flex flexDirection="column">
                <Text mb={2} fontSize="xl">{name}</Text>
                <Text fontSize="xl">{location}</Text>
            </Flex>
        )
    }
    const renderBio = () => {
        if (isEditing) {
            return (
                <Flex flexDirection="row">
                    <Textarea placeholder="bio" mb={2} value={bio} onChange={handleBioChange} name="name" type="text" />
                </Flex>
            )
        }
        return (
            <Flex flexDirection="row">
                <Text fontSize="xl">{bio}</Text>
            </Flex>
        )
    }
    const renderEditButton = () => {
        if (!isOwner) {
            return "";
        }
        return isEditing
            ? <Button onClick={handleSave}>Save</Button>
            : <Button onClick={handleEdit}>Edit</Button>;
    }
    
    return (
        <Box mt={6}>
            <Flex justifyContent="center">
                <Box maxWidth="900px" my={4}>
                    <Grid
                        h="260px"
                        templateRows="repeat(2, 1fr)"
                        templateColumns="repeat(5, 1fr)"
                        gap={4}
                    >
                        <GridItem rowSpan={2} colSpan={2}>
                            <Image
                                borderRadius="xl"
                                src={'/resources/images/logo.png'}
                                alt="avatar image"
                                boxSize="240px"
                                objectFit="cover"
                                cursor="pointer"
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            {renderHeading()}
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Flex>
                                <Button mr={2} onClick={handleLik}>Like</Button>
                                <Button mr={2}>Follow</Button>
                                {renderEditButton()}
                            </Flex>
                        </GridItem>
                        <GridItem colSpan={3}>{renderBio()}</GridItem>
                    </Grid>
                </Box>
            </Flex>
            <DisplayGrid nfts={nftList} />
        </Box>
    );
};

export default Profile;
// todo: trash code that uses CeramicClient TileDocuments directly
// const login = async () => {
//     // read/write testnet node
//     const API_URL = "https://ceramic-clay.3boxlabs.com";
//     const ceramic = new CeramicClient(API_URL)
//     const resolver = {
//         ...KeyDidResolver.getResolver(),
//         ...ThreeIdResolver.getResolver(ceramic),
//     }
//     const did = new DID({ resolver })
//     ceramic.did = did

//     const address = web3.account;
//     if (!address) {
//         return;
//     }
//     const threeIdConnect = new ThreeIdConnect()
//     const authProvider = new EthereumAuthProvider(web3.library, address)
//     await threeIdConnect.connect(authProvider)

//     const provider = await threeIdConnect.getDidProvider()
//     ceramic.did.setProvider(provider)
//     await ceramic.did.authenticate()
//     console.log("authenitcated: ", ceramic.did);
    
// }
// const createProfile = async (ceramic: any, content: any) => {
//     const doc = await TileDocument.create(
//         ceramic,
//         content,
//         {
//           controllers: [ceramic.did.id],
//           family: 'dmlb_profile',
//         }
//     );

//     const streamId = doc.id.toString();
// }
// const updateProfile = async (ceramic: any, streamId: string, content: any) => {
//     const doc = await TileDocument.load(ceramic, streamId);
//     await doc.update(content);
// }
// const readProfile = async (ceramic: any, streamId: string) => {
//     const doc = await TileDocument.load(ceramic, streamId);
//     return doc;
// }
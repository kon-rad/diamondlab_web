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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Heading,
} from '@chakra-ui/react';
import DisplayGrid from '../components/displayGrid';
import { getWalletNFTs } from '../services/getWalletNFTs';
import CeramicClient from '@ceramicnetwork/http-client';
import KeyDidResolver from 'key-did-resolver';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import { DID } from 'dids';
import { ThreeIdConnect } from '@3id/connect';
import { useWeb3React } from '@web3-react/core';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { EthereumAuthProvider, SelfID } from '@self.id/web';
import { read } from 'fs';
import { Core } from '@self.id/core';
import subscribe from '../services/subscribe';

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
    const [name, setName] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [location, setLocation] = useState<string>('');

    const web3 = useWeb3React();
    const core = new Core({ ceramic: 'testnet-clay' });

    const MOCK_PROFILE = {
        name: 'anonymous',
        description:
            'bio here',
    };

    useEffect(() => {
        fetchNfts();
        getProfile();
    }, []);

    const fetchNfts = async () => {
        if (!web3.account) {
            return;
        }
        setIsFetching(true);
        // const tokens = await getWalletNFTs(web3.account);
        const tokens = await getWalletNFTs(
            '0xa2ba04f43ca44304657364fb94c5e6ba0f3d8ebc',
        );
        setNFTList(tokens);
        setIsFetching(false);
    };
    const handleEdit = async () => {
        setIsEditing(!isEditing);
    };
    const setProfile = async () => {
        if (!web3.account) {
            return;
        }
        const self = await SelfID.authenticate({
            authProvider: new EthereumAuthProvider(
                window.ethereum,
                web3.account,
            ),
            ceramic: 'local',
            connectNetwork: 'testnet-clay',
        });

        const profile = {
            name,
            description: bio,
            location,
        };
        await self.set('basicProfile', profile);
        console.log('saved: ', profile);
        console.log('id: ', self.id);

        // did:3:kjzl6cwe1jw148fea5wgifatlt07ogdyjjaaup37qgq3h1t6rbd42zoqswusqp4
    };
    const getProfile = async () => {
        if (!web3.account) {
            return;
        }
        const addresses = await window.ethereum.enable();

        const self = await SelfID.authenticate({
            authProvider: new EthereumAuthProvider(
                window.ethereum,
                addresses[0],
            ),
            ceramic: 'local',
            connectNetwork: 'testnet-clay',
        });

        const data = await self.get('basicProfile');
        if (!data) {
            return;
        }
        setName(data.name);
        setBio(data.description);
        setLocation(data.location);
    };
    const handleSubscribe = () => {
        if (web3.account) {
            subscribe(web3.account, web3.library);
        }
    }
    const handleLik = () => {
        console.log('like button clicked');
    };
    const handleNameChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setName(event.target.value);
    };
    const handleBioChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setBio(event.target.value);
    };
    const handleLocationChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setLocation(event.target.value);
    };
    const handleSave = () => {
        setProfile();
        setIsEditing(false);
    };
    const renderHeading = () => {
        if (isEditing) {
            return (
                <Flex flexDirection="column">
                    <Input
                        placeholder="name"
                        mb={2}
                        onChange={handleNameChange}
                        value={name}
                        name="name"
                        type="text"
                    />{' '}
                    <Input
                        placeholder="location"
                        onChange={handleLocationChange}
                        value={location}
                        name="location"
                        type="text"
                    />
                </Flex>
            );
        }
        return (
            <Flex flexDirection="column">
                <Text mb={2} weight="700" fontSize="xl">
                    {name}
                </Text>
                <Text fontSize="xl">{location}</Text>
            </Flex>
        );
    };
    const renderBio = () => {
        if (isEditing) {
            return (
                <Flex flexDirection="row">
                    <Textarea
                        placeholder="bio"
                        mb={2}
                        value={bio}
                        onChange={handleBioChange}
                        name="name"
                        type="text"
                    />
                </Flex>
            );
        }
        return (
            <Flex flexDirection="row">
                <Text fontSize="xl">{bio}</Text>
            </Flex>
        );
    };
    const renderEditButton = () => {
        if (!isOwner) {
            return '';
        }
        return isEditing ? (
            <Button onClick={handleSave}>Save</Button>
        ) : (
            <Button onClick={handleEdit}>Edit</Button>
        );
    };
    const renderSubscribe = () => {
        const data = [
            {
                title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                content: 'Aliquam sit amet rutrum mauris, sed gravida justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus rhoncus in elit a dapibus. Quisque lectus diam, auctor efficitur sem quis, tempus eleifend lectus. Pellentesque quis risus arcu. In condimentum scelerisque nisl vitae bibendum. Ut euismod nunc id diam dapibus interdum. Fusce interdum mi quis lorem vulputate dapibus. Quisque facilisis pharetra elementum. Sed vitae pretium velit. Vestibulum sed rutrum odio, quis iaculis ante. Ut sit amet semper enim, in faucibus est. Aenean a nunc augue. Cras a nibh metus. Nam faucibus tellus cursus, rhoncus massa sed, gravida sapien.',
            },
            {
                title: 'Maecenas in ex quis felis iaculis volutpat euismod eget turpis.',
                content: 'Aliquam sit amet rutrum mauris, sed gravida justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus rhoncus in elit a dapibus. Quisque lectus diam, auctor efficitur sem quis, tempus eleifend lectus. Pellentesque quis risus arcu. In condimentum scelerisque nisl vitae bibendum. Ut euismod nunc id diam dapibus interdum. Fusce interdum mi quis lorem vulputate dapibus. Quisque facilisis pharetra elementum. Sed vitae pretium velit. Vestibulum sed rutrum odio, quis iaculis ante. Ut sit amet semper enim, in faucibus est. Aenean a nunc augue. Cras a nibh metus. Nam faucibus tellus cursus, rhoncus massa sed, gravida sapien.',
            },
            {
                title: 'Etiam efficitur ante sit amet scelerisque accumsan.',
                content: 'Aliquam sit amet rutrum mauris, sed gravida justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus rhoncus in elit a dapibus. Quisque lectus diam, auctor efficitur sem quis, tempus eleifend lectus. Pellentesque quis risus arcu. In condimentum scelerisque nisl vitae bibendum. Ut euismod nunc id diam dapibus interdum. Fusce interdum mi quis lorem vulputate dapibus. Quisque facilisis pharetra elementum. Sed vitae pretium velit. Vestibulum sed rutrum odio, quis iaculis ante. Ut sit amet semper enim, in faucibus est. Aenean a nunc augue. Cras a nibh metus. Nam faucibus tellus cursus, rhoncus massa sed, gravida sapien.',
            },
            {
                title: 'Nunc at elit vel libero porttitor laoreet.',
                content: 'Aliquam sit amet rutrum mauris, sed gravida justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus rhoncus in elit a dapibus. Quisque lectus diam, auctor efficitur sem quis, tempus eleifend lectus. Pellentesque quis risus arcu. In condimentum scelerisque nisl vitae bibendum. Ut euismod nunc id diam dapibus interdum. Fusce interdum mi quis lorem vulputate dapibus. Quisque facilisis pharetra elementum. Sed vitae pretium velit. Vestibulum sed rutrum odio, quis iaculis ante. Ut sit amet semper enim, in faucibus est. Aenean a nunc augue. Cras a nibh metus. Nam faucibus tellus cursus, rhoncus massa sed, gravida sapien.',
            },
            {
                title: 'In sit amet tellus et erat tempor aliquet.',
                content: 'Aliquam sit amet rutrum mauris, sed gravida justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus rhoncus in elit a dapibus. Quisque lectus diam, auctor efficitur sem quis, tempus eleifend lectus. Pellentesque quis risus arcu. In condimentum scelerisque nisl vitae bibendum. Ut euismod nunc id diam dapibus interdum. Fusce interdum mi quis lorem vulputate dapibus. Quisque facilisis pharetra elementum. Sed vitae pretium velit. Vestibulum sed rutrum odio, quis iaculis ante. Ut sit amet semper enim, in faucibus est. Aenean a nunc augue. Cras a nibh metus. Nam faucibus tellus cursus, rhoncus massa sed, gravida sapien.',
            }
        ];
        return data.map((elem: any, i: number) => {
            return (
                <Box mb={12} width="100%" maxWidth="100%" key={i} maxW="32rem">
                    <Heading mb={4} fontSize="xl">{elem.title}</Heading>
                    <Text fontSize="md">
                        {elem.content}
                    </Text>
                    <Button size="sm" colorScheme="green" mt="24px">
                        read more
                    </Button>
                </Box>
            )
        })
    }

    return (
        <Box mb={16} mt={6}>
            <Flex justifyContent="center">
                <Box maxWidth="900px" mt={4} mb={24}>
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
                                <Button mr={2} onClick={handleLik}>
                                    Like
                                </Button>
                                <Button mr={2}>Follow</Button>
                                <Button onClick={handleSubscribe} mr={2}>Subscribe</Button>
                                {renderEditButton()}
                            </Flex>
                        </GridItem>
                        <GridItem colSpan={3}>{renderBio()}</GridItem>
                    </Grid>
                </Box>
            </Flex>
            <Flex justifyContent="center">
                <Box width="1200px">
                    <Tabs>
                        <TabList>
                            <Tab>Feed</Tab>
                            <Tab>Subscribers</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <DisplayGrid nfts={nftList} />
                            </TabPanel>
                            <TabPanel>
                                {renderSubscribe()}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Flex>
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

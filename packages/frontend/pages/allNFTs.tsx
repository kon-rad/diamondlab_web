import { useEffect, useState } from 'react';
import {
    Container,
    Text,
    Flex,
    Box,
    Grid,
    GridItem,
    Image,
} from '@chakra-ui/react';
import DisplayGrid from '../components/displayGrid';
import { NFT } from '../utils/types';
import { getAllNFTs } from '../services/getAllNFTs';

const AllNFTs = () => {
    const [nfts, setNfts] = useState<NFT[]>([]);

    useEffect(() => {
        makeNFTRequest();
    }, []);

    const makeNFTRequest = async () => {
        const nftData = await getAllNFTs();
        console.log(nftData);
        const nftArr = nftData.map((elem: any) => {
            return {
                contract_address: elem.contract_address,
                image: elem.metadata.image,
                name: elem.metadata.name,
                opensea_cached_image: elem.metadata.opensea_cached_image,
                token_id: elem.metadata.token_id,
                description: elem.metadata.description,
            }
        })
        setNfts(nftArr);
    }
    return (
        <Container>
            <Flex>
                <Box my={6}>
                    <Text fontSize="2xl">All NFTs from Ethereum</Text>
                </Box>
            </Flex>
            <DisplayGrid nfts={nfts} />
        </Container>
    )
}

export default AllNFTs;
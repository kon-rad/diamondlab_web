import { searchNFTs } from '../services/searchNFTs';
import { useState, useEffect } from 'react';
import {
    Container,
    Text,
    Flex,
    Box,
    Grid,
    GridItem,
    Image,
    Input,
    Button
} from '@chakra-ui/react';
import DisplayGrid from '../components/displayGrid';
import { NFT } from '../utils/types';

const Search = () => {
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
    }, []);
    
    const makeNFTRequest = async () => {
        const nftArr = await searchNFTs(searchTerm);
        console.log(nftArr);
        setNfts(nftArr);
    }
    const updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }
    const performSearch = () => {
        makeNFTRequest()
    }
    return (
        <>
            <Flex alignItems="center" flexDirection="column">
                <Box my={6} maxWidth="1200px">
                    <Text fontSize="2xl">All NFTs from Ethereum</Text>
                </Box>
                <Box my={6}>
                    <Flex>
                        <Input mr={6} maxWidth="460px" type="text" name="search" fontSize="2xl" onChange={updateSearch} />
                        <Button onClick={performSearch}>Search</Button>
                    </Flex>
                </Box>
            </Flex>
            <DisplayGrid nfts={nfts} />
        </>
    )
}

export default Search;

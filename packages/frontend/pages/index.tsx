import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import styles from '../styles/Home.module.css'
import { Container, Image, SimpleGrid, Box, VStack, Text, Flex } from '@chakra-ui/react';
import DisplayGrid from '../components/displayGrid';

import { nftAddress, dlMarketAddress } from '../config';

import NFT from '../artifacts/contracts/DLNFT.sol/DLNFT.json';
import Market from '../artifacts/contracts/DLMarket.sol/DLMarket.json';
import { useWeb3React } from '@web3-react/core';

const Home: NextPage = () => {
  const [nfts, setNfts] = useState<any>([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = ethers.getDefaultProvider('rinkeby');
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      dlMarketAddress,
      Market.abi,
      provider
    );
    console.log("marketContract: ", marketContract);
    
    const data = await marketContract.fetchMarketItems();
    console.log('data: ', data);

    const getItem = async (i: any) => {
      console.log('item: ', i);
      const tokenUri = await nftContract.tokenURI(i.tokenId);
      console.log("tokenUri: ", tokenUri);
      if (/undefined/.test(tokenUri)) {
        return;
      }
      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      const item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
        description: meta.data.description,
      };
      console.log('item meta: ', meta);
      return item;
    };

    /* map over items returned from smart contract and format
     * them as  well as fetch their token metadata
     */
    const items = await Promise.all((data || []).map(getItem));
    setNfts(items);
    setLoadingState('loaded');
    console.log('done loading');
  }

  return (
    <>
      <Container maxW="xl">
        <Box mb={48} mt={2}>
          <VStack>
            <Text variant="primary" fontSize="3xl">Connect | Discover | Trade</Text>
            <Image borderRadius="xl" src={'/resources/images/logo.png'} width="64px" height="64px"/>
          </VStack>
        </Box>
      </Container>
      <Box p={6}>
        <SimpleGrid minChildWidth="120px" spacing="40px">
          <DisplayGrid nfts={nfts} />
        </SimpleGrid>
      </Box>
    </>
  )
}

export default Home

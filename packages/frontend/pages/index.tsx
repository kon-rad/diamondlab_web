import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import logo from '../resources/images/logo.png';
import { Container, Box, VStack, Text, Flex } from '@chakra-ui/react';
import NFTCard from '../components/NFTCard';

import { nftAddress, dlMarketAddress } from '../config';

import NFT from '../artifacts/contracts/DLNFT.sol/DLNFT.json';
import Market from '../artifacts/contracts/DLMarket.sol/DLMarket.json';

const Home: NextPage = () => {

  const [nfts, setNfts] = useState<any>([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      dlMarketAddress,
      Market.abi,
      provider
    );
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
      <Head>
        <title>Diamond Lab</title>
        <meta name="description" content="Diamond Lab" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="xl">
        <Box mb={4} mt={2}>
          <VStack>
            <Text variant="primary" fontSize="3xl">Diamond Lab is your NFT home</Text>
            <Image src={logo} width="64px" height="64px"/>
          </VStack>
        </Box>
      </Container>
      <Box px={6}>
        <Flex flexDirection="row" w="100%">
            {nfts.map(
              (nft: any, i: number) =>
                nft && <NFTCard nft={nft} key={`${nft.tokenId}_${i}`} />
            )}
        </Flex>
      </Box>
    </>
  )
}

export default Home

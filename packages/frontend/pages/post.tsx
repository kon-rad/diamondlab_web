import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Center, Flex, VStack, Box, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import CreateForm from '../components/createForm';
import { createPost } from '../services/create-post';
import { nftAddress, dlMarketAddress } from '../config';
import NFT from '../artifacts/contracts/DLNFT.sol/DLNFT.json';
import Market from '../artifacts/contracts/DLMarket.sol/DLMarket.json';

const Post = () => {

    const web3 = useWeb3React()

    const handleSubmit = (description: string, fileUrl: string, price: string) => {
        console.log('submit');
        if (web3.account && web3.library && description && fileUrl && price) {
            createPost(web3.account, web3.library, description, fileUrl, price)
        } else {
            console.error('Error: could not make post', web3.account, web3.library, description, fileUrl, price)
        }
    }

    return (
        <>
            <Flex p={5} direction="column">
                <Center mb={5}>
                    <Text fontSize="3xl">Create a Post </Text>
                </Center>
                <CreateForm submit={handleSubmit} />
            </Flex>
        </>
    )
}

export default Post;
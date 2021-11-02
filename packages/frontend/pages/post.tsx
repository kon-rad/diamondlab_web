import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Center, Flex, VStack, Box, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { nftAddress, dlMarketAddress } from '../config';
import CreateForm from '../components/createForm';
import NFT from '../artifacts/contracts/DLNFT.sol/DLNFT.json';
import Market from '../artifacts/contracts/DLMarket.sol/DLMarket.json';

const Post = () => {

    const web3 = useWeb3React()

    const handleSubmit = (description: string, fileUrl: string) => {
        console.log('submit');
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
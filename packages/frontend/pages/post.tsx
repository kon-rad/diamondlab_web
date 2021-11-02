import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Center, Flex, VStack, Box, Text } from '@chakra-ui/react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { useWeb3React } from '@web3-react/core';
import { nftAddress, dlMarketAddress } from '../config';
import { uploadImageToIPFS } from '../services/create-post';
import CreateForm from '../components/createForm';
import NFT from '../artifacts/contracts/DLNFT.sol/DLNFT.json';
import Market from '../artifacts/contracts/DLMarket.sol/DLMarket.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const Post = () => {
    const [fileUrl, setFileUrl] = useState<any>(null);
    const [fileUpload, setFileUpload] = useState();

    const web3 = useWeb3React()

    async function handleImageUpload(e: any) {
        if (!e || !e.target || !e.target.files || !e.target.files[0]) {
            setFileUrl(null);
            return;
        }
        if (web3.account && web3.library) {
            const file = e.target.files[0];
            try {
                const url = await uploadImageToIPFS(web3.account, web3.library, file, client);
                setFileUrl(url);
                setFileUpload(file);
            } catch (error) {
                console.log(`Error uploading file: ${error}`);
            }
        }
    }

    return (
        <>
        <Flex p={5}>
            <VStack>
                <Center>
                 <h3 className="heading text-center">Create a Post </h3>
                </Center>
            </VStack>
        </Flex>
        <div className="create__container">
            <CreateForm />
        </div>
        </>
    )
}

export default Post;
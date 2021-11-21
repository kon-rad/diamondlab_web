import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import {
    List,
    ListItem,
    ListIcon,
    Flex,
    VStack,
    Button,
    Box,
    Text,
    Image
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { createPost } from '../services/createPost';
import { memberNftAddress } from '../config';
import DLMemberNFT from '../artifacts/contracts/DLMemberNFT.sol/DLMemberNFT.json';
import { CheckCircleIcon } from '@chakra-ui/icons';

const Mint = () => {
    const web3 = useWeb3React();

    const handleSubmit = (
        description: string,
        fileUrl: string,
        price: string,
    ) => {
        console.log('submit');
        if (
            web3.account &&
            web3.library &&
            description &&
            fileUrl &&
            price
        ) {
            createPost(
                web3.account,
                web3.library,
                description,
                fileUrl,
                price,
            );
        } else {
            console.error(
                'Error: could not make post',
                web3.account,
                web3.library,
                description,
                fileUrl,
                price,
            );
        }
    };

    return (
        <>
            <VStack p={5} mb={12}>
                <Box textAlign="center" mb={24}>
                    <Text fontSize="3xl" mb={12}>
                        Mint a Diamond Lab Member NFT
                    </Text>
                    <Text fontSize="xl" mb={12}>
                        Get access to premium features
                    </Text>
                </Box>
                <Image borderRadius="xl" src="/resources/images/preview.png" height="300px" m={4}/>
                <Box mb={12}>
                    <List spacing={3} mb={24}>
                        <ListItem>
                            <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                            />
                            <span style={{ color: '#90f1ef' }}>
                                coming soon
                            </span>{' '}
                            NFT Database and analytics
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                            />
                            <span style={{ color: '#90f1ef' }}>
                                coming soon
                            </span>{' '}
                            NFT success predictor AI
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                            />
                            <span style={{ color: '#90f1ef' }}>
                                coming soon
                            </span>{' '}
                            NFT recommendations AI
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                            />
                            <span style={{ color: '#90f1ef' }}>
                                coming soon
                            </span>{' '}
                            NFT dashboard
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={CheckCircleIcon}
                                color="green.500"
                            />
                            <span style={{ color: '#90f1ef' }}>
                                coming soon
                            </span>{' '}
                            OpenSea Bidding Bot
                        </ListItem>
                    </List>
                </Box>
                <Text fontSize="xl" mb={12}>Preview</Text>
                <Image borderRadius="xl" src="/resources/images/mint_preview.png" height="320px" mb={12}/>
                <Box mb={12}>
                    <Button>Mint for 50 Matic</Button>
                </Box>
            </VStack>
        </>
    );
};

export default Mint;

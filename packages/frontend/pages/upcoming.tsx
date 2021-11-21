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
    Image,
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { createPost } from '../services/createPost';
import { memberNftAddress } from '../config';
import DLMemberNFT from '../artifacts/contracts/DLMemberNFT.sol/DLMemberNFT.json';
import { StarIcon } from '@chakra-ui/icons';

const Upcoming = () => {
    const web3 = useWeb3React();

    return (
        <>
            <VStack p={5} mb={12}>
                <Box textAlign="center" mb={24}>
                    <Text fontSize="3xl" mb={12}>
                        Upcoming
                    </Text>
                </Box>
                <Box mb={12}>
                    <List spacing={3} mb={24}>
                        <ListItem>
                            <ListIcon
                                as={StarIcon}
                                color="yellow.500"
                            />
                            IPFS
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={StarIcon}
                                color="yellow.500"
                            />
                            Ceramic
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={StarIcon}
                                color="yellow.500"
                            />
                            Covalent API
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={StarIcon}
                                color="yellow.500"
                            />
                            NFTPort
                        </ListItem>
                        <ListItem>
                            <ListIcon
                                as={StarIcon}
                                color="yellow.500"
                            />
                            Unlock
                        </ListItem>
                    </List>
                </Box>
            </VStack>
        </>
    );
};

export default Upcoming;

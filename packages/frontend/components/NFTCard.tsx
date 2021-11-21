import { Box, Text, Image, Flex, Button } from '@chakra-ui/react';
import { NFT, AllNFT } from '../utils/types';
import { useState } from 'react';

type Props = {
    nft: NFT | AllNFT,
    index: number,
}

const NFTCard = (props: Props) => {
    const [imgSrc, setImgSrc] = useState<string>("");
    const { nft } = props;
    
    const handleError = () => {
        console.log("img load error: ", nft.image);
        
        setImgSrc("/resources/images/logo.png");
    }
    console.log("loading: ", nft);
    
    return (
        <Image
            borderRadius="xl"
            src={imgSrc ? imgSrc : (nft.image || "/resources/images/logo.png")}
            alt="nft image"
            boxSize="280px"
            objectFit="cover"
            cursor="pointer"
            onError={handleError}
        />
    )
}

export default NFTCard;
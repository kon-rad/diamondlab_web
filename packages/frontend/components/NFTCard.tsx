import { Box, Text, Image, Flex, Button } from '@chakra-ui/react';

interface NFT {
    tokenId: string,
    price: string,
    seller: string,
    owner: string,
    description: string,
    image: string,
    sold: boolean,
}
type Props = {
    nft: NFT,
}

const NFTCard = (props: Props) => {
    const { nft } = props;
    return (
        <Box m={5}>
                <Image
                    borderRadius="xl"
                    src={nft.image}
                    alt="nft image"
                    boxSize="150px"
                    objectFit="cover"
                    cursor="pointer"
                />
        </Box>
    )
}

export default NFTCard;
import { Flex, LinkBox, Spacer, Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import Image from 'next/image'
import logo from '../resources/images/logo.png';
import Wallet from './wallet';

const Header = () => {
    return (
        <Flex as="header" p={4} alignItems="center">
            <LinkBox>
                <NextLink href="/" passHref={true}>
                    <div>
                        <Image src={logo} width="32px" height="32px"/>
                        {' '}Diamond Heart 💎
                    </div>
                </NextLink>
            </LinkBox>
            <Spacer />
            <Box>
                <Wallet/>
            </Box>
        </Flex>
    )
}

export default Header;
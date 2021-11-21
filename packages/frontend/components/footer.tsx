import { ReactNode } from 'react';

import {
    Box,
    Container,
    Link,
    SimpleGrid,
    Stack,
    Text,
    useColorModeValue,
    Image,
} from '@chakra-ui/react';

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text
            color="gray.800"
            fontWeight={'500'}
            fontSize={'lg'}
            mb={2}
        >
            {children}
        </Text>
    );
};

export default function Footer() {
    return (
        <>
            <svg
                width="100%"
                height="100%"
                id="svg"
                viewBox="0 0 1440 400"
                xmlns="http://www.w3.org/2000/svg"
                className="transition duration-300 ease-in-out delay-150"
            >
                <defs>
                    <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="46%"
                        x2="100%"
                        y2="54%"
                    >
                        <stop
                            offset="5%"
                            stop-color="#eaafc8ff"
                        ></stop>
                        <stop
                            offset="95%"
                            stop-color="#654ea3ff"
                        ></stop>
                    </linearGradient>
                </defs>
                <path
                    d="M 0,400 C 0,400 0,200 0,200 C 88.45384615384617,208.86410256410255 176.90769230769234,217.72820512820513 251,220 C 325.09230769230766,222.27179487179487 384.8230769230769,217.95128205128208 455,192 C 525.1769230769231,166.04871794871792 605.8,118.46666666666667 706,126 C 806.2,133.53333333333333 925.9769230769232,196.18205128205128 1000,209 C 1074.0230769230768,221.81794871794872 1102.2923076923075,184.80512820512823 1168,175 C 1233.7076923076925,165.19487179487177 1336.8538461538462,182.5974358974359 1440,200 C 1440,200 1440,400 1440,400 Z"
                    stroke="none"
                    stroke-width="0"
                    fill="url(#gradient)"
                    className="transition-all duration-300 ease-in-out delay-150 path-0"
                ></path>
            </svg>
            <Box bg={'brand.gradienta'} color={'gray.800'}>
                <Container as={Stack} maxW={'6xl'} py={10}>
                    <SimpleGrid
                        templateColumns={{
                            sm: '1fr 1fr',
                            md: '2fr 1fr 1fr 1fr 1fr',
                        }}
                        spacing={8}
                    >
                        <Stack spacing={6}>
                            <Box>
                                <Image
                                    borderRadius="xl"
                                    src="/resources/images/logo.png"
                                />
                            </Box>
                            <Text fontSize={'sm'} color="gray.800">
                                © 2021 Diamond Lab. All rights
                                reserved
                            </Text>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Links</ListHeader>
                            <Link href={'#'}>Profile</Link>
                            <Link href={'#'}>Search</Link>
                            <Link href={'#'}>Mint</Link>
                            <Link href={'#'}>Upcoming</Link>
                            <Link href={'#'}>NFT Database</Link>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Company</ListHeader>
                            <Link href={'#'}>About</Link>
                            <Link href={'#'}>Blog</Link>
                            <Link href={'#'}>Values</Link>
                            <Link href={'#'}>Contact</Link>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Support</ListHeader>
                            <Link href={'#'}>Help Center</Link>
                            <Link href={'#'}>Terms of Service</Link>
                            <Link href={'#'}>Legal</Link>
                            <Link href={'#'}>Privacy Policy</Link>
                        </Stack>
                        <Stack align={'flex-start'}>
                            <ListHeader>Follow Us</ListHeader>
                            <Link href={'#'}>Discord</Link>
                            <Link href={'#'}>Twitter</Link>
                            <Link href={'#'}>YouTube</Link>
                            <Link href={'#'}>Instagram</Link>
                            <Link href={'#'}>GitHub</Link>
                        </Stack>
                    </SimpleGrid>
                </Container>
            </Box>
        </>
    );
}

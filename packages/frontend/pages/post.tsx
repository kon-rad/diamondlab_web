import { Center, Flex, Text } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import CreateForm from '../components/createForm';
import { createPost } from '../services/createPost';

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
import { useState } from 'react'
import { Flex, Center, Box } from '@chakra-ui/react'

type Props = {
    handleFileUpload: any,
    submit: any,
}

const CreateForm = (props: Props) => {
    const [description, setDescription] = useState<string>('');
    const handleSubmit = () => {
        props.submit(description);
    }
    return (
        <>
            <Flex direction="column">
                <Center>
                    <div>hello create form</div>
                    <div className="CreateForm__display">
                        img here
                    </div>
                    <input type="file" name="image" className="CreateForm__img" onChange={props.handleFileUpload}/>
                    <textarea name="description" id="post_description" cols={30} rows={10} onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                    <input type="file" name="image" className="CreateForm__img" onChange={props.handleFileUpload}/>
                    <button onClick={handleSubmit}>submit</button>
                </Center>
            </Flex>
        </>
    )
}

export default CreateForm;
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useState } from 'react'

function ERC1155TokenForm({ index, Adder }) {
    const [contractAddress, setContractAddress] = useState(null);
    const [collectionId, setCollectionId] = useState(null);

    function AddHandler() {
        Adder(index,{contractAddress,collectionId});
    }
    return (
        <FormControl key={"erc1155_token" + index}>
            <FormLabel>ERC1155 Instance {index+1} </FormLabel>
            <Input onChange={(e)=>setContractAddress(e.target.value)} placeholder="Token contract address i.e 0x12345..." type='text' />
            <Input onChange={(e)=>setCollectionId(e.target.value)} placeholder="Collection Id i.e 1 " type='number' />
            <Button colorScheme={"green"} onClick={AddHandler}>Add</Button>

        </FormControl>
    )
}

export default ERC1155TokenForm
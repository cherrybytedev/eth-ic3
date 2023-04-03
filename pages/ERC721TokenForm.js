import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useState } from 'react'

function ERC721TokenForm({ index, Adder }) {
    const [contractAddress, setContractAddress] = useState(null);
    const [tokenId, setTokenId] = useState(null);

    function AddHandler() {
        Adder(index,{contractAddress,tokenId});
    }
    return (
        <FormControl key={"erc721_token" + index}>
            <FormLabel>ERC721 Instance {index+1} </FormLabel>
            <Input onChange={(e)=>setContractAddress(e.target.value)} placeholder="Token contract address i.e 0x12345..." type='text' />
            <Input onChange={(e)=>setTokenId(e.target.value)} placeholder="Token Id i.e 1 " type='number' />
            <Button colorScheme={"green"} onClick={AddHandler}>Add</Button>

        </FormControl>
    )
}

export default ERC721TokenForm
import MyToken from "../backend/build/contracts/MyToken.json";
import NftIce from "../backend/build/contracts/NFT_ice.json";
import GameItems from "../backend/build/contracts/GameItems.json";
import { Box, Button, FormControl, FormHelperText, FormLabel, Heading, HStack, Input, Radio, RadioGroup, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ERC721TokenForm from "./ERC721TokenForm";
import ERC1155TokenForm from "./ERC1155TokenForm";


async function requestAccount() {

  console.log("requesting accounts....");
  try {

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts)
  } catch (error) {
    console.log(error)
  }


}

export default function Home() {
  const [erc721TokenInstances, setErc721TokenInstances] = useState([]);
  const [erc1155TokenInstances, setErc1155TokenInstances] = useState([]);
  const [erc721Contracts, setErc721Contracts] = useState([]);
  const [erc1155Contracts, setErc1155Contracts] = useState([]);
  const [erc721TokenIds, setErc721TokenIds] = useState([]);
  const [erc1155CollectionIds, setErc1155CollectionIds] = useState([]);
  const [actionType, setActionType] = useState('1');


  const MyTokenAddress = MyToken.networks["80001"].address
  const MyTokenAbi = MyToken.abi;
  const GameItemsAbi = GameItems.abi;

  const GameItemsAddress = GameItems.networks["80001"].address;

  let contractAddress = NftIce.networks["80001"].address
  let contractAbi = NftIce.abi;

  console.log({
    MyTokenAddress, GameItemsAddress, nft_ice_Address: contractAddress
  });

  async function signTransaction() {
    const Web3 = require('web3');

    const web3 = new Web3(window.ethereum);

    let platformPrivateKey = "7a5ea6677292d6083e018bd339bf636e4980f3bb551b52e89f9e534a5c2b90fd";
    // account 2 7a5ea6677292d6083e018bd339bf636e4980f3bb551b52e89f9e534a5c2b90fd
    // const erc721Contracts = [MyTokenAddress];
    // const erc721TokenIds = [1];
    // const erc1155Contracts = [GameItemsAddress];
    // const erc1155CollectionIds = [0];
    let nonce = 79;
    let discount = 20;
    let discordId = "123123123123";



    // Use window.ethereum.enable() to request user's accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const theStaker = accounts[0];

    console.log("accounts are ", accounts)


    // Create the message to be signed
    const message = web3.utils.soliditySha3(
      theStaker,
      nonce
    );

    // Use eth_sign method to sign the message with user's account

    const user_signature = await web3.eth.personal.sign(
      message,
      theStaker,
      'Please confirm that you want to stake your NFTs'
    );

    const { signature: platform_sig } = web3.eth.accounts.sign(message, platformPrivateKey);

    console.log({ user_signature, platform_sig });

    // Call the smart contract function with the signed message and signatures
    console.log({ contractAbi, contractAddress });
    const contract = new web3.eth.Contract(contractAbi, contractAddress);
    if (actionType == '1') {
      const erc721_nft_contract = new web3.eth.Contract(MyTokenAbi, MyTokenAddress);
      const erc1155_nft_contract = new web3.eth.Contract(GameItemsAbi, GameItemsAddress);

      for (let index = 0; index < erc721TokenIds.length; index++) {
        const token = erc721TokenIds[index];
        await erc721_nft_contract.methods.approve(contractAddress, token).send({
          from: theStaker
        });

      }
      await erc1155_nft_contract.methods.setApprovalForAll(contractAddress, true).send({
        from: theStaker
      });

    }



    console.log({
      theStaker,
      nonce,
    });

    try {
      console.log({
        theStaker, erc721Contracts, erc721TokenIds, erc1155Contracts, erc1155CollectionIds, nonce, user_signature, platform_sig, discount, discordId
      });
      let userTransactionObject = [
        theStaker, erc721Contracts, erc721TokenIds, erc1155Contracts, erc1155CollectionIds, nonce, user_signature, platform_sig, discount, discordId
      ]
      let discountedPrice = await contract.methods.getDiscountFee(userTransactionObject).call();

      console.log({ discountedPrice });

      let gas;
      let txDataObject = {
        from: theStaker,
        value: actionType == '1' ? discountedPrice : 0

      }
      try {

        console.log("Estimating gas");
        if (actionType == '1') {
          gas = await contract.methods.stakeNFTs(
            userTransactionObject
          ).estimateGas(txDataObject);

        }
        else {
          gas = await contract.methods.unstakeNFTs(
            userTransactionObject
          ).estimateGas(txDataObject);

        }


      }
      catch (e) {

        alert("Gas Estimation : Transaction will be unsuccessful because  " + e.message);

        return 0;
      }

      let result;

      if (actionType == '1') {
        result = await contract.methods.stakeNFTs(
          userTransactionObject
        ).send({
          from: theStaker,
          gas,
          value: discountedPrice

        });

      }
      else {
        result = await contract.methods.unstakeNFTs(
          userTransactionObject
        ).send({
          from: theStaker,
          gas,

        });

      }

      console.log({ result });

    }
    catch (e) {
      console.log(e);
      alert("Error in Transaction :  " + e.message);

    }
    // resetting form state
    /**  const [erc721TokenInstances, setErc721TokenInstances] = useState([]);
      const [erc1155TokenInstances, setErc1155TokenInstances] = useState([]);
      const [erc721Contracts, setErc721Contracts] = useState([]);
      const [erc1155Contracts, setErc1155Contracts] = useState([]);
      const [erc721TokenIds, setErc721TokenIds] = useState([]);
      const [erc1155CollectionIds, setErc1155CollectionIds] = useState([]);
     */

    setErc1155CollectionIds([]);
    setErc721Contracts([])
    console.log();
    setErc721TokenIds([]);
    console.log();
    setErc1155TokenInstances([]);
    setErc721TokenInstances([]);
    console.log();
    setErc1155Contracts([]);

  }

  function addERC721TokenTemplate() {
    let arr = [...erc721TokenInstances];
    arr.push({});
    setErc721TokenInstances(arr);


  }
  function addERC1155TokenTemplate() {
    let arr = [...erc1155TokenInstances];
    arr.push({});
    setErc1155TokenInstances(arr);

  }
  function removeERC721TokenTemplate(removeIndex, tokenItem) {
    let _contracts = [...erc721Contracts];
    _contracts.push(tokenItem.contractAddress);
    setErc721Contracts(_contracts);

    let _tokenIds = [...erc721TokenIds];
    _tokenIds.push(tokenItem.tokenId);
    setErc721TokenIds(_tokenIds);


    let arr = [...erc721TokenInstances];
    arr = arr.filter((item, index) => index != removeIndex);
    console.log("Added ", tokenItem);
    setErc721TokenInstances(arr);


  }
  function removeERC1155TokenTemplate(removeIndex, tokenItem) {
    let _contracts = [...erc1155Contracts];
    _contracts.push(tokenItem.contractAddress);
    setErc1155Contracts(_contracts);

    let _tokenIds = [...erc1155CollectionIds];
    _tokenIds.push(tokenItem.collectionId);
    setErc1155CollectionIds(_tokenIds);



    let arr = [...erc1155TokenInstances];
    arr = arr.filter((item, index) => index != removeIndex);

    console.log("Added ", tokenItem);
    setErc1155TokenInstances(arr);

  }

  useEffect(() => {
    // requestAccount();

  }, [])

  return (
    <>
      <VStack spacing={10} paddingTop={"10vh"} color={"white"} backgroundImage={`url("./bg.jpg")`} backgroundSize={"cover"} backgroundRepeat={"no-repeat"} minH={"100vh"} minW={"100vw"} h={"fit-content"}  >
        <VStack >
          <Heading fontSize={"3em"}>Connective</Heading>
          <Text fontSize={"1.5em"}>Secure your assets</Text>
        </VStack>
        <HStack width={"inherit"} justify={"center"} spacing={10}>
          <Heading fontSize={"1.5em"}>I want to </Heading>
          <RadioGroup defaultValue={actionType} onChange={(e) => {
            console.log(e);
            setActionType(e)
          }
          } value={actionType}>
            <Stack direction='row'>
              <Radio value={'1'}>Stake</Radio>
              <Radio value={'2'}>Unstake</Radio>

            </Stack>
          </RadioGroup>

        </HStack>
        <VStack>
          <VStack>
            <Box id="erc721Form">
              {
                erc721TokenInstances.map((item, index) => {
                  return <ERC721TokenForm index={index} Adder={removeERC721TokenTemplate} />
                })
              }

            </Box>
            <Button onClick={addERC721TokenTemplate} colorScheme={"cyan"}>Add ERC721 Token</Button>

          </VStack>
          <VStack>

            <Box id="erc1155Form">
              {
                erc1155TokenInstances.map((item, index) => {
                  return <ERC1155TokenForm index={index} Adder={removeERC1155TokenTemplate} />

                })
              }

            </Box>
            <Button onClick={addERC1155TokenTemplate} colorScheme={"cyan"}>Add ERC1155 Token</Button>

          </VStack>
        </VStack>



        <Button colorScheme={"green"} onClick={signTransaction}>{actionType == 1 ? "Stake" : "Unstake"} Tokens</Button>
        <VStack spacing={10} width={"80vw"} padding={"20px"} borderRadius={"10px"} bg={"rgba(0,0,0,0.3)"} color={"white"} >
          <Heading>Transaction Tokens Involved</Heading>
          <Heading fontSize={"1em"}>ERC721</Heading>

          {
            erc721Contracts.length > 0 ?
              erc721Contracts.map((item, index) => {
                return <Stack width={"90%"} justify={"space-between"} direction={"row"}>
                  <Text>Item #{index + 1}</Text>
                  <Text>{item.slice(0, 8) + "..." + item.slice(36)}</Text>
                  <Text>{erc721TokenIds[index]}</Text>
                </Stack>
              })
              : <Text>No tokens listed</Text>
          }
          <Heading fontSize={"1em"}>ERC1155</Heading>

          {
            erc1155Contracts.length > 0 ?
              erc1155Contracts.map((item, index) => {
                return <Stack width={"90%"} justify={"space-between"} direction={"row"}>
                  <Text>Item #{index + 1}</Text>
                  <Text>{item.slice(0, 8) + "..." + item.slice(36)}</Text>
                  <Text>{erc1155CollectionIds[index]}</Text>

                </Stack>
              })
              : <Text>No tokens listed</Text>
          }

        </VStack>


      </VStack>


    </>
  )
}

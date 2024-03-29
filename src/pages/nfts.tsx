import { Button } from "@chakra-ui/button";
import { Box, Flex } from "@chakra-ui/layout";
import * as web3 from "@solana/web3.js";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { SlabOptionsList } from "../components/SlabOptionsList";
import { SlabPreview } from "../components/SlabPreview";
import { getUserNfts, NftMetadata } from "../nfts/helpers";
import { NftList } from "../nfts/NftList";
import { colors } from "../theming/colors";
import { useDumbWallet } from "./_app";
// Connect to cluster
var connection = new web3.Connection(
  // "https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/",
  // web3.clusterApiUrl("mainnet-beta"),
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

const useAccount = (pubkey: web3.PublicKey) => {
  const [accountInfo, setAccountInfo] = useState<
    web3.AccountInfo<Buffer | null> | undefined
  >();

  const [nfts, setNfts] = useState<Array<NftMetadata>>([]);

  const updateAccountInfo = async () => {
    // get account info
    // account data is bytecode that needs to be deserialized
    // serialization and deserialization is program specic
    let account = await connection.getAccountInfo(pubkey);

    // @ts-ignore
    setAccountInfo(account);
  };

  const updateUserNfts = async () => {
    // get account info
    // account data is bytecode that needs to be deserialized
    // serialization and deserialization is program specic
    let nfts = await getUserNfts(pubkey);

    // @ts-ignore
    setNfts(nfts);
  };

  useEffect(() => {
    updateAccountInfo();
    updateUserNfts();
  }, [pubkey]);

  return { accountInfo, nfts };
};

const NftPage = () => {
  // const [selectedNftUris, setUris] = useState<string[]>([]);
  const [selectedNftUri, setUri] = useState<string | undefined>();
  const proceedDisabled = selectedNftUri === undefined;
  const { pubkey } = useDumbWallet();

  const { nfts } = useAccount(pubkey);

  const selectedNftImage =
    nfts?.find((n) => n.metadataUri === selectedNftUri)?.image ??
    "/images/trippy.gif";

  const navigateToOptions = () => {
    Router.push({
      pathname: "/checkout",
      query: { nftMetadata: selectedNftUri },
    });
  };

  // const ALLOWMULTIPLE___handleNftSelected = (selected: NftMetadata) => {
  //   const uriIndex = selectedNftUris.findIndex(
  //     (uri) => uri === selected.metadataUri
  //   );
  //   const wasAlreadySelected = uriIndex !== -1;
  //   if (wasAlreadySelected) {
  //     setUris(
  //       selectedNftUris.filter((uri: string) => uri !== selected.metadataUri)
  //     );
  //   } else {
  //     setUris([...selectedNftUris, selected.metadataUri]);
  //   }
  // };

  return (
    <Box p={4} flex={1}>
      <Box>
        <NftList
          nftMetadata={nfts}
          // onNftSelected={ALLOWMULTIPLE___handleNftSelected}
          // selectedUris={selectedNftUris}
          selectedUri={selectedNftUri}
          onNftSelected={(nft) => {
            setUri(nft.metadataUri);
          }}
        />
      </Box>
      <SlabPreview top={"19.2%"} left={"58.8%"} image={selectedNftImage} />
      <Box h={100} />
      <Flex justifyContent="center">
        <SlabOptionsList selectedOptionName={undefined} />
      </Flex>
      <Flex
        style={{ position: "absolute", bottom: 0, width: "100%", padding: 38 }}
        justifyContent="flex-end"
      >
        <Button
          background={colors.borderSelected}
          color="black"
          onClick={navigateToOptions}
          disabled={proceedDisabled}
        >
          View Proof {">"}
        </Button>
      </Flex>
    </Box>
  );
};

export default NftPage;

import {
  Coin,
  Coins,
  CommunityPoolSpendProposal,
  MsgSubmitProposal,
} from "@terra-money/feather.js";
import { MsgRegisterFeeShare } from "@terra-money/feather.js/dist/core/feeshare/MsgRegisterFeeShare";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
    key: {
      type: "string",
      demandOption: true,
    },
    "key-dir": {
      type: "string",
      demandOption: false,
      default: keystore.DEFAULT_KEY_DIR,
    },
  })
  .parseSync();

interface RegisterFeeShareParams {
  contractAddress: string;
  deployerAddress: string;
  withdrawerAddress: string;
}

export const toRegisterFeeShareMsg = ({
  contractAddress,
  deployerAddress,
  withdrawerAddress,
}: RegisterFeeShareParams) => {
  const registerMsg = new MsgRegisterFeeShare(
    contractAddress,
    deployerAddress,
    withdrawerAddress
  );
  const packed = registerMsg.packAny();

  const msg = {
    stargate: {
      type_url: packed.typeUrl,
      value: Buffer.from(packed.value).toString("base64"),
    },
  };

  return msg;
};

// ts-node chain/terra_submit_proposal.ts --key mainnet --network mainnet
// ts-node chain/terra_set_fee_share.ts --key ledger --network mainnet
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv.key, argv["key-dir"]);

  const account = admin.key.accAddress(getPrefix());
  const receiver = "terra1rgggsspquaxjp4lmegx7a3q4l9lg44hnu7rjxa";

  console.log(`Account ${account}, Receiver: ${receiver}`);

  //   type
  // /cosmos.gov.v1beta1.MsgSubmitProposal
  // content
  // "{\"@type\":\"/cosmos.distribution.v1beta1.CommunityPoolSpendProposal\",\"amount\":[{\"amount\":\"370370000000\",\"denom\":\"uluna\"}],
  // \"description\":\"This proposal aims to enhance liquidity in the Terra ecosystem by establishing a bribe market for incentives via the Alliance Module. ERIS is asking for $ 250,000 for development and audit, paid in 370,370 LUNA at $ 0.675.\\n\\nThe initiative will bootstrap LUNA stablecoin liquidity, increase chain activity, create utility for LUNA holders, reduce circulating supply through lockups, generate voter revenue, and implement a fair distribution mechanism for DEXes. It supports the URA DEX roadmap and will be crucial for Terra's future ecosystem.\\n\\nSee https://commonwealth.im/terra/discussion/20123-terra-liquidity-alliance\",\"recipient\":\"terra1vm5azhvaxeanc7auxh02y8jmxrk8tj93f6aywp\",\"title\":\"Terra Liquidity Alliance Proposal\"}"
  // proposer
  // terra1kefa2zgjn45ctj32d3tje5jdwus7px6n2klgzl
  // initial_deposit
  // [{"denom":"uluna","amount":"512000000"}]

  const title = "Terra Liquidity Alliance Proposal";
  const recipient = "terra1vm5azhvaxeanc7auxh02y8jmxrk8tj93f6aywp";
  const description = `This proposal aims to enhance liquidity within the Terra ecosystem by establishing a bribe market for incentives, distributed via the Alliance Module.

  ERIS is asking USD 200,000 for development and USD 50,000 for auditing, to be paid in 370,370 LUNA at the current price of USD 0.675, to support the development of this solution.
  
  The initiative seeks to bootstrap deep onchain LUNA stablecoin liquidity, thereby increasing chain activity. It creates new utility for LUNA holders by reducing the circulating supply through lockups and generating revenue for voters. Additionally, it creates PoL by implementing a take rate for LPs and creating a fair, market-based distribution mechanism for DEXes to compete for incentives. Furthermore, it will deliver the components required for the URA DEX roadmap.
  
  We strongly believe that the success of this proposal will create a central building block for Terras future ecosystem development.
  
  See https://commonwealth.im/terra/discussion/20123-terra-liquidity-alliance`;

  const { txhash } = await sendTxWithConfirm(admin, [
    new MsgSubmitProposal(
      [
        new CommunityPoolSpendProposal(
          title,
          description,
          recipient,

          new Coins([new Coin("uluna", 370370000000)])
        ),
      ],
      new Coins(),
      account,
      "",
      title,
      description
    ),
  ]);
  console.log(`Proposal submitted! Txhash: ${txhash}`);
})();

import { orderBy, take } from "lodash";
import yargs from "yargs/yargs";
import { Chains, createLCDClient, createWallet, getChainId } from "../helpers";
import * as keystore from "../keystore";
import { config } from "./config";

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

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const networkConfig = config[network];
  if (!networkConfig) {
    throw new Error(`no data available for network ${network}`);
  }

  const validators = (await terra.staking.validators(getChainId()))[0];
  console.log(validators[0]);
  // console.log(validators.map((a) => [a.description, a.delegator_shares]));

  let relevant: [string, number][] = validators.map((a) => [
    a.operator_address,
    a.delegator_shares.toNumber(),
  ]);
  relevant = orderBy(relevant, (a) => a[1], "desc");
  relevant = take(relevant, 30);

  console.log(relevant);

  const props = await terra.gov
    .proposals(getChainId(), {
      "pagination.reverse": "true",
    })
    .then((a) =>
      a.proposals.filter((a) => a.title.startsWith("CreateAlliance"))
    );

  props.map((a) => console.log(a));

  if (1 === 1) {
    return;
  }

  // for (const val of relevant) {
  //   const operator = await axios.default.get<{ operator_address: string }>(
  //     `https://terra-rest.publicnode.com/cosmos/distribution/v1beta1/validators/${val[0]}`
  //   );
  //   const msgs: Msg[] = [];

  //   for (const prop of props) {
  //     const vote = new MsgVote(prop.id, operator.data.operator_address, 1);
  //     msgs.push(vote);
  //   }

  //   const { txhash } = await sendTxWithConfirmUnsigned(
  //     admin,
  //     msgs,
  //     "",
  //     "200000",
  //     false
  //   );
  //   console.log(`Sent tx! Txhash: ${txhash}`);
  // }
})();

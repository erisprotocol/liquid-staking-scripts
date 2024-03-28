import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/amp-compounder/astroport_farm/eris_astroport_farm_execute";

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
    contract: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node amp-compounder/10_update_farm.ts --network mainnet --key mainnet --contract terra1pvn5up4n4ttmdatvpxa8t2klpcy2u5t5nmyclv30yz8xmphjxlrqgqwxv6,terra1a3k77cgja875f6ffdsflxtaft570em82te4suw9nfhx77u6dqh8qykuq6f,terra176e78qnvvclrlrmuyjaqxsy72zp2m3szshljdxakdsmr33zulumqa3hr9d,terra1m64fmenadmpy7afp0675jrkz9vs0cq97mgzzpzg0klgc4ahgylms7gvnt5
// ts-node amp-compounder/10_update_farm.ts --network mainnet --key mainnet --contract terra1c98f5dg90cyx5uklezsvac46e4c3msq3ghktkmeksyahytsvuh0q438m6c

// ts-node amp-compounder/10_update_farm.ts --network neutron --key key-mainnet --contract neutron1h4ehzx3j92jv4tkgjy3k2qphh5863l68cyep7vaf83fj6k89l4lqjfyh77,neutron188xz8cg4uqk4ssg9tcf3q2764ar8ev0jr8qpx2qspchul98ykzuqx58r50
// 10800
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const contracts = argv.contract.includes(",")
    ? argv.contract.split(",")
    : [argv.contract];

  const { txhash } = await sendTxWithConfirm(
    admin,

    contracts.map(
      (contract) =>
        new MsgExecuteContract(admin.key.accAddress(getPrefix()), contract, <
          ExecuteMsg
        >{
          update_config: {
            fee: "0.05",
            // deposit_profit_delay_s: 10800,
          },
        })
    )
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();

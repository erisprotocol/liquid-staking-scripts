import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { createLCDClient, createWallet, getPrefix, sendTxWithConfirm } from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/dao-lst/hub/execute";

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

// ampROAR: ts-node dao-lst/10_update_config.ts --network mainnet --key mainnet --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  // old:
  // "dao_interface": {
  //     "enterprise_v2": {
  //       "gov": "terra1dlq3pvxe3eqnzp4g82wlsgllu8k0245asxmhepnyms36w67x2fjs4s6lsf",
  //       "membership": "terra1fv92cnlenl8am5vpcamsxpr6l7y9ytpvlhery9ncy95jjxh8pmlsass2rq",
  //       "distributor": "terra16j3yxfwzytjm7xq7kcdmfyessz8vg6r938hrfkk64nq9dyyqcd9qczudmr"
  //     }
  //   }

  const account = admin.key.accAddress(getPrefix());
  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      new MsgExecuteContract(account, argv.contract, <ExecuteMsg>{
        update_config: {
          dao_interface: {
            dao_dao_v2: {
              gov: "terra1qj7n3vgttdel0pgynzmneh6k82mzu80tk6gk5qjp6rs0uksvuxlq9eu6cm",
              rewards: [
                ["terra1zug2ur6d5ls7vgzwkh0m2002jrallfehpsadpltjqr3vhgvp6lnq90rj3w", 1],
                ["terra13hykhlkvunwg7lqscda0uwa65na7ehr38csc2ual9ztpeuw8xehqk0p78l", 1],
              ],
              staking: "terra1xuqh84yz35h70p3ppt76dz5kgwwtwmsv34pg0gw6ld4ntptgjcrqe2e70t",
            },
          },
        },
      }),
    ]
  );
  console.log(`Contract updated! Txhash: ${txhash}`);
})();

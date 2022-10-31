import yargs from "yargs/yargs";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/hub/execute_msg";
import { Chain, createClient, sendTxWithConfirm } from "./helpers";

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
    "contract-address": {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node 5_harvest.ts --network juno --key ledger --contract-address juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x
// ts-node 5_harvest.ts --network juno --key mainnet --contract-address juno17cya4sw72h4886zsm2lk3udxaw5m8ssgpsl6nd6xl6a4ukepdgkqeuv99x
(async function () {
  const client = await createClient(
    argv["network"] as Chain,
    argv.key,
    argv.keyDir
  );

  await sendTxWithConfirm(client, {
    msgs: [
      {
        contract: argv.contractAddress,
        execute_msg: <ExecuteMsg>{
          harvest: {},
        },
        sender: client.address,
      },
    ],
  });

  console.log("🚀 ~ file: 5_harvest.ts ~ line 32 ~ client", client);
})();

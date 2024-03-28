import * as fs from "fs";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  instantiateWithConfirm,
  waitForConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/proxies/eris_usdc_proxy_instantiate";

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
    label: {
      type: "string",
      demandOption: true,
    },
    "key-dir": {
      type: "string",
      demandOption: false,
      default: keystore.DEFAULT_KEY_DIR,
    },
    admin: {
      type: "string",
      demandOption: false,
    },
    msg: {
      type: "string",
      demandOption: false,
    },
    "code-id": {
      type: "number",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, InstantiateMsg>> = {
  migaloo: {
    ginkou:
      "migaloo1qelh4gv5drg3yhj282l6n84a6wrrz033kwyak3ee3syvqg3mu3msgphpk4",
    usdc_denom:
      "ibc/BC5C0BAFD19A5E4133FDA0F3E04AE1FBEE75A4A226554B2CBB021089FF2E1F8A",
    musdc_addr:
      "migaloo10nucfm2zqgzqmy7y7ls398t58pjt9cwjsvpy88y2nvamtl34rgmqt5em2v",
    hub: "migaloo1cwk3hg5g0rz32u6us8my045ge7es0jnmtfpwt50rv6nagk5aalasa733pt",
    stake:
      "factory/migaloo1cwk3hg5g0rz32u6us8my045ge7es0jnmtfpwt50rv6nagk5aalasa733pt/ampUSDC",
  },
};

// MIGALOO
// ts-node amp-governance/1_upload_contracts.ts --network migaloo --key key-mainnet --contracts eris_usdc_proxy --folder contracts-dao-lst --migrates migaloo12ye2j33d6lv84x8zq6dpjj2hepzn2njnrnnwlmuam0v0eczr787qhmf7en
// ts-node dao-lst/02_deploy_usdc_proxy.ts --network migaloo --key key-mainnet --code-id 221 --label "Eris USDC Proxy"
// migaloo12ye2j33d6lv84x8zq6dpjj2hepzn2njnrnnwlmuam0v0eczr787qhmf7en
(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const hubCodeId = argv["code-id"];

  let msg: any;
  if (argv["msg"]) {
    msg = JSON.parse(fs.readFileSync(path.resolve(argv["msg"]), "utf8"));
  } else {
    msg = templates[argv["network"] as any as Chains];
  }

  console.log("\n" + JSON.stringify(msg).replace(/\\/g, "") + "\n");

  await waitForConfirm("Proceed to deploy contracts?");
  const result = await instantiateWithConfirm(
    deployer,
    argv["admin"] ? argv["admin"] : deployer.key.accAddress(getPrefix()),
    hubCodeId,
    msg,
    argv.label,
    undefined
  );
  const address =
    result.logs[0].eventsByType["instantiate"]["_contract_address"][0] ??
    result.logs[0].eventsByType["instantiate"]["contract_address"][0];
  console.log(`Contract instantiated! Address: ${address}`);
})();

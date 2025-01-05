import { TxLog } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { tokens_neutron } from "../amp-compounder/tokens";
import { addInfo, Chains, createLCDClient, createWallet, getPrefix, instantiateWithConfirm, toNew } from "../helpers";
import * as keystore from "../keystore";
import { InstantiateMsg } from "../types/launchpad/treasury/instantiate";
import { config, LaunchpadInfoKeys } from "./config";

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
    "contract-code-id": {
      type: "number",
      demandOption: true,
    },
    label: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

const templates: Partial<Record<Chains, any>> = {
  neutron: <InstantiateMsg>{
    config: {
      burn_fee: "0.1",
      asset_infos: [toNew(tokens_neutron.xastro)],
      burn_asset_info: toNew(tokens_neutron.fuel),
      burn_asset_issuer: "neutron1zl2htquajn50vxu5ltz0y5hf2qzvkgnjaaza2rssef268xplq6vsjuruxm",
    },
    owner: config["neutron"]?.dao,
  },
};

(async function () {
  const network = argv["network"] as Chains;
  const terra = createLCDClient(network);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[network] as InstantiateMsg;

  const result = await instantiateWithConfirm(
    deployer,
    deployer.key.accAddress(getPrefix()),
    argv.contractCodeId,
    msg,
    argv.label
  );

  const addresses = result.logs.map((a: TxLog) => a.eventsByType["instantiate"]["_contract_address"][0]);

  console.log(`Contract instantiated! Address: ${addresses}`);
  addInfo("launchpad", network, LaunchpadInfoKeys.burn_addr, addresses[0]);
})();

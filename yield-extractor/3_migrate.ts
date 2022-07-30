import { MsgMigrateContract } from "@terra-money/terra.js";
import * as path from "path";
import yargs from "yargs/yargs";
import {
  createLCDClient,
  createWallet,
  sendTxWithConfirm,
  storeCodeWithConfirm,
  waitForConfirm,
} from "./../helpers";
import * as keystore from "./../keystore";

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
    msg: {
      type: "string",
      demandOption: false,
      default: "{}",
    },
    "code-id": {
      type: "number",
      demandOption: false,
    },
    binary: {
      type: "string",
      demandOption: false,
      default:
        "../../liquid-staking-contracts/artifacts/eris_yield_extractor.wasm",
    },
  })
  .parseSync();

// testnet
// ts-node 3_migrate.ts --network testnet --key testnet

(async function () {
  const terra = createLCDClient(argv["network"]);
  const admin = await createWallet(terra, argv["key"], argv["key-dir"]);

  const contracts = {
    donate: [
      "terra1653asdhxs9atjyh62mrgtp7txcewta472636we5gcvlkkxv7g5ysdtyxtq",
      "terra1a6eg4c4zhp6mmyav9zf3ryv400uhn27a0mhyxqc7h8am84st0cvqz6pfna",
      "terra1rxyp5jqe7hhczctr8l39eyc4mr78tpg73zh7jdjk3hjkeca4edmspunpf3",
      "terra1t87pf0y3uyzx8z0y7jl4uq40wwanrdcvc2wd2m9z0835kvjvre3sr8zz66",
      "terra1ftjeafwm9r5w8034lyfv5m30k7vtqp5295e6tzdkujzxkk90rgrqt4wzcv",
      "terra1j5lc6wzasvmz0w6dngqcdffrjdslgfv2y6wumnth89qwvnx0ypds843upt",
      "terra1ag8q94vrr7dxvqw6rux3kk2jvz99zjayr6qp0qzfgyury042afrsu5aue7",
      "terra1djvhfth922wjy55wnt92pjy0c5sujdhcukzv6u3857egkck8h79q4fzntv",
      "terra1c72yxlmkktk32xjj6lrugah7te82cyaudxewzmasnlfh2ujgduwq6c8rw2",
      "terra1h77420vqq4c4n64rmu7lwh5zjyz9u3w4v06cawf9tf2uhe0vr0qqud6ndx",
    ],
    burn: [
      "terra1ye6v479um2dr7hpq53xdl7tkncmzharqtl4w6rdwapj94y45t94qlawgv5",
      "terra1a88sc69j2e7fpj5x6unuqxhnfg9tznha67u2vwjkjn2j22nqdc7sgsqe62",
      "terra1d5449udtmfc60r9p30ftk4qsz5ut675nlyad88h2lexsnntmye0qx66zxz",
      "terra1sa6psxxf2un0e2pxdju2uff3cq8fzg3swec34cq6ku7uut08n65qdmn4p0",
      "terra1p702k7s9segyrkpgrxv62qpcpkqhe6fyfwkk4vkrk3u2pkmpvvlsqdpeay",
      "terra1y9wkrq39gdjzwk5dmj9w5j6hxukl6kd8zfglyu05zaryewtgx07q7twzm3",
      "terra1ns079h5kzvkr9jn2t5re74h5mpznyu6q47jqn34n24lnekkxlshsexz0hl",
      "terra1m0jdete0cpk9y5753e933ktvrs9nwsvwmummswsjwgdae5f3yals7w22ea",
      "terra1m7rnpf8ha36lnmd3tepwe2nnf2zww2uehzmkp68aaqzp6mk4h3ts6xmjl4",
      "terra17y627gwgrhfr324cly0n6rnq0c6t6uxe0kmvmm3pqaa456fnppdq25pl79",
    ],
  };

  let codeId = argv["code-id"];
  if (!codeId) {
    codeId = await storeCodeWithConfirm(admin, path.resolve(argv["binary"]));
    console.log(`Code uploaded! codeId: ${codeId}`);
    await waitForConfirm("Proceed to migrate contract?");
  }

  const contracts_flat = [...contracts.donate, ...contracts.burn];

  const { txhash } = await sendTxWithConfirm(
    admin,

    contracts_flat.map(
      (a) =>
        new MsgMigrateContract(
          admin.key.accAddress,
          a,
          codeId!,
          JSON.parse(argv["msg"])
        )
    )
  );
  console.log(`Contract migrated! Txhash: ${txhash}`);
})();

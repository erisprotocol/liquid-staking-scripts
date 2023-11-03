import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import {
  Chains,
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/voting_escrow/eris_gov_voting_escrow_execute";

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

// Testnet
// ampLP
// ts-node amp-governance/5_config_escrow_for_update.ts --network testnet --key testnet --contract terra15h6tu0qxx542rs0njefujw5mjag3gfc0d3seruydhvs6z07ftz6s6uuwdp
// ampLUNA
// ts-node amp-governance/5_config_escrow_for_update.ts --network testnet --key testnet --contract terra185fzsf0e247dsa9npuc0kdn8ef3ht2q5rwedle43h3q5ymjmvs2qkvdp3f

// Mainnet
// ts-node amp-governance/5_config_escrow_for_update.ts --network mainnet --key mainnet --contract terra1ep7exp42jjtwgjly36y4vgylz82fplnjwpkz95wljzwfald8zwwqggsdzz

// MIGALOO
// ts-node amp-governance/5_config_escrow_for_update.ts --network migaloo --key mainnet-migaloo --contract migaloo1hntfu45etpkdf8prq6p6la9tsnk3u3muf5378kds73c7xd4qdzysuv567q

// KUJIRA
// ts-node amp-governance/5_config_escrow_for_update.ts --network kujira --key mainnet-kujira --contract kujira1mxzfcxpn6cjx4u9zln6ttxuc6fuw6g0cettd6nes74vrt2f22h4q3j5cdz

// ts-node amp-governance/5_config_escrow_for_update.ts --network archwaytest --key mainnet-archway --contract archway1kmg5j6tkc5k9dj0x042y8k0pn5clu6pdfddq0glrl8agxuy2we0scqr324
// ts-node amp-governance/5_config_escrow_for_update.ts --network archway --key mainnet-archway --contract archway16eu995d6pkhjkhs5gst4c8f7z07qpw8d6u36ejq9nmap27qxz2fqk2w9wu
// ts-node amp-governance/5_config_escrow_for_update.ts --network osmosis --key mainnet-osmosis --contract osmo1vcg9a7zwfeuqwtkya5l34tdgzxnafdzpe22ahphd02uwed43wnfs3wtf8a
// ts-node amp-governance/5_config_escrow_for_update.ts --network juno --key key-mainnet --contract juno1s74s5wssxamuh37nqu3gus9m6l77mvh2d9urq9slmxfh3nh5seyqpze8w5

const templates: Partial<Record<Chains, ExecuteMsg>> = {
  // testnet: <ExecuteMsg>{
  //   update_config: {
  //     push_update_contracts: [
  //       "terra1a507lxc7sztyfu8az5np54t6w86nhv2a0n2q5y858jf9ms5t5rsqh648jt", // amp gauge
  //       "terra1xvef2n7kky4ffzg6yl0rrej9j9d6prdgn79na7yxzcy006znkqwsrztmg5", // prop gauge
  //     ],
  //   },
  // },
  testnet: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "terra1rpa66hlslyy9jl6hxkufv83eyje2lx6022569k497ytjf7nvm7hqu3wndk", // amp gauge
        "terra1ut233rtsdjkdf775xq866tdvjkuazmgsyrh5n9l8ac9qpuj6sd3sr8a0q7", // prop gauge
      ],
    },
  },
  // mainnet: <ExecuteMsg>{
  //   update_config: {
  //     push_update_contracts: [
  //       "terra1aumv9uyv2ltf8upsf88338ctf922q439a0v2tpss5s2j9g0j8zzsrtq9t2", // amp gauge
  //       "terra1z0cxlq62a9dsjhz7g7hhgpuplcl32c0qeckhm9jyggln0rxq6z8syesq8j", // prop gauge
  //     ],
  //   },
  // },
  mainnet: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "terra1uvv5rs7jl9ugf65k3qvsc9fyt5djcuh2fnwgk37xjea0975ud07qmygr5d", // prop gauge
      ],
    },
  },
  migaloo: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "migaloo14haqsatfqxh3jgzn6u7ggnece4vhv0nt8a8ml4rg29mln9hdjfdqpz474l", // amp gauge
        "migaloo1j2x4vsm2a5qefkvgr7gl30gf2puvsa504plzwgdhwl3wvm5lxayquvvsfq", // prop gauge
      ],
    },
  },
  kujira: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "kujira13kqc9jye2kcak4q9nl4p8zuhf9he2f32vvr8ds9lkd46aa0e936spmx7v4", // amp gauge
        "kujira130umtav4d6dpfjat92d92wauq25ll6gzvfqx9hqcp8m86myy2q9qlr00u9", // prop gauge
      ],
    },
  },
  // injective: <ExecuteMsg>{
  //   update_config: {
  //     push_update_contracts: [
  //       "inj17w7hjaqf6qc3zp3r68q3sq3jezsg4tr3g7e0n2", // amp gauge
  //       "inj1qjewg2xd0vc7q9wzrt35vy54uxlz0t6w0xn3hz", // prop gauge
  //     ],
  //   },
  // },
  archwaytest: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "archway1ntne4eyrydxd2a80qnnggv6cj5aag60azfc2d52reytj6f8js4ns4rcwea", // amp gauge
        "archway16rnpysnujmp58qtd4xquxpqs3ht3h0290za7hjtztn0p7llseups8dug8q", // prop gauge
      ],
    },
  },
  archway: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "archway1225r4qnj0tz3rpm0a4ukuqwe4tdyt70ut0kg308dxcpwl2s58p0qayn6n3", // amp gauge
        "archway1jzkz28dmgwprmx4rnz54ny5vv8xqexcazgl2xg89x2t952fryg0qfg08at", // prop gauge
      ],
    },
  },
  osmosis: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "osmo1sx8wrjfh5dvv4s9njhcrau2c6x80t85wnlhh0lm24uu3ppgpunqs74cqk6", // amp gauge
        "osmo1mr8dr22sc0r3yxu6rhu9kc8nq7096kw3rlh5kzc7eggk32lyc8hqdwatz3", // prop gauge
      ],
    },
  },
  juno: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "juno1c4npgrxu9d9rrxrkd2xtgl8jhz3zsetq0y2mwvxhfvyggrmmvk8qkvw09e", // amp gauge
        "juno1l548zam9r7j89agyptrhnn9q9f92w0a7ja5c76vkmx9sreqfz69qq688rl", // prop gauge
      ],
    },
  },
  sei: <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        "sei1fg7f9p2jcjm339yx49evpnylpxlc2g0ahym6az3kmyqx3yg3tjwsd3wq35", // amp gauge
        "sei1qwzdnwzdka4yc5z2v5rlathef44flmvh66uahsmraatcyvfyxc6sze0ec8", // prop gauge
      ],
    },
  },
  "testnet-kujira": <ExecuteMsg>{
    update_config: {
      push_update_contracts: [
        // "sei1fg7f9p2jcjm339yx49evpnylpxlc2g0ahym6az3kmyqx3yg3tjwsd3wq35", // amp gauge
        "kujira1xgfxe88an654rrlm9f2rvz20hgex0aufhuzcdu3j6rx7a4tf75dsut22qk", // prop gauge
      ],
    },
  },
};

(async function () {
  const terra = createLCDClient(argv["network"]);
  const deployer = await createWallet(terra, argv["key"], argv["key-dir"]);

  const msg = templates[argv["network"] as Chains];
  console.log("msg", msg);

  const { txhash } = await sendTxWithConfirm(deployer, [
    new MsgExecuteContract(
      deployer.key.accAddress(getPrefix()),
      argv.contract,
      msg!
    ),
  ]);
  console.log(`Contract added route! Txhash: ${txhash}`);
})();

import { MsgExecuteContract } from "@terra-money/feather.js";
import yargs from "yargs/yargs";
import { notEmpty } from "../cosmos/helpers";
import {
  Chains,
  createLCDClient,
  createWallet,
  getInfo,
  getPrefix,
  printProposal,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";
import { ExecuteMsg } from "../types/ve3/connector-alliance/execute";
import { config, Ve3InfoKeys } from "./config";

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

  const gauges: Record<string, any> = getInfo("ve3", network, Ve3InfoKeys.gauges);

  const gaugeNames = Object.keys(gauges);

  const address = admin.key.accAddress(getPrefix());

  if (!config[network]) {
    throw new Error(`no data available for network ${network}`);
  }

  const amount = 500000;
  const elements = `terravaloper188e99yz54744uhr8xjfxmmplhnuw75xea55zfp	0.04827542875
terravaloper1ge3vqn6cjkk2xkfwpg5ussjwxvahs2f6at87yp	0.05090635556
terravaloper1lelhxdzwn9ddecv6sv0kcxj5tguurxnzcfs5wf	0.04483498599
terravaloper1rr2g4z2ch4cqwl8s70yj94a5l2vakg0v36nmjh	0.04685877585
terravaloper1wdymftapg5pcvf2aqw4pd0yuuh5w9m6yqdnukv	0.01184721134
terravaloper1jt8pcx4sesgztjkjsvjjqtvyfgcehqx09u4exq	0.03916837439
terravaloper1vrkzjujfds9p8t5g0xety3e3ft4dep02etv9le	0.03916837439
terravaloper1wr0p7dzss74wfmzfqm8r65mk26efg5zhzpm77s	0.03916837439
terravaloper1pet430t7ykswxuyhh56d4gk6rt7qgu9as6a5r0	0.04541321167
terravaloper15lsftv92eyssjwkh2393s0nhjc07kryqen2fqf	0.006382978723
terravaloper199fjq4rnfvz24cktl8cervx8h8e90rukmgdv5x	0.0264184983
terravaloper16vc0num5aaq4mqdh4vjhs02s3ypd0j8c7ujxpm	0.02095426569
terravaloper1kepapcnh78hsk8nx2u9nv05rn7vjwwf4fr59zu	0.006382978723
terravaloper1yy5379nk24xffpq4egw7ue4ad3j7l79ma2enmz	0.03188273091
terravaloper1tm0xkark2ufecmdhgaaw7gqsycyt4qag6py8x6	0.03734696352
terravaloper1pgyelqv0hwjavgf6vhdm4e4pt766wfxxczu20l	0.02257329757
terravaloper19kg9ncvkuk08pxz0rnnywh65h5tvux9mlj7tc3	0.01184721134
terravaloper1puzp2yjqps43x7nse33svljc550xjz35jxg432	0.01549003308
terravaloper10c04ysz9uznx2mkenuk3j3esjczyqh0j783nzt	0.03370414178
terravaloper1s6j9wxyprdsxmdf6mvsegsldvmtk0p92pa7aey	0.01002580046
terravaloper1vm5azhvaxeanc7auxh02y8jmxrk8tj93f43e7j	0.04483498599
terravaloper1mgpgp53tynj4djmckxdjhufa7q8lqqjuwnrlqm	0.006382978723
terravaloper1vcd42qfvlvnjwaw7hvl6y32wrzqxvas653yus9	0.03673982657
terravaloper1jncrqd24wtcdpes9y89qsh0jn5c8sayn92302l	0.01913285482
terravaloper1htey4gcdcass29vn4dwjcuq58mrvv8ra5pjz4k	0.04078740628
terravaloper15389y60f0rk596tm38qewqycr8ztt8hshsf2mk	0.01549003308
terravaloper1ktu7a6wqlk6vlywf4rt6wfcxuphc0es27p0qvx	0.030668457
terravaloper1q8w4u2wyhx574m70gwe8km5za2ptanny9mnqy3	0.006382978723
terravaloper1cs0dspacdhym4cwcm3f7suurfszvl6k5s9p06a	0.01043055844
terravaloper1vjr8z6g38f39j23y55pdektc3l2uqc9y02f9k5	0.006382978723
terravaloper1wwq9mfkkqfta334d4hcjrjau9y50a4hw37zhdl	0.01366862221
terravaloper1plxp55happ379eevsnk2xeuwzsrldsmqduyu36	0.01184721134
terravaloper1ulwqct0df2xuuaqzcq4yax3msdqgew6ehhcl7r	0.01913285482
terravaloper1cl8j3r09vmlxf5zsq4xms7td8x2qcfml8637yf	0.01002580046
terravaloper1jveyrzquwrt0txanmhg7jdhf2q4ry28k2esps4	0.01184721134
terravaloper1hy8lzd38kp0t8662r2vnxsc4ezs3l74506jx02	0.006382978723
terravaloper1l920a79akuc98hz4389axf9ctcymrf5ays578x	0.006382978723
terravaloper14yeuqqg2e2fc2mcrghuqxh0w43xshpzrhnhz86	0.006382978723
terravaloper10mmhvx5nrnuye2x9zhe02jcg0hfzzzjlwc0sxw	0.006382978723
terravaloper1u53qwdgafryksqnzq3k7e5eyph7jlh8kgc3va4	0.006382978723
terravaloper1a9zv7n6pmkzlm3wj6c23qyejqlmyxsl5faanrv	0.02095426569
terravaloper1l9mchtvqgvpyskgtemsrkjn0e57a7wm6c863uj	0.006382978723
terravaloper1tfy452kxfcsa2353nenltade9esj7ffrc38gwn	0.006382978723
terravaloper1t3zvwaz7v3epg3f33waxajv4nj95mt8ma9yc7g	0.006382978723
terravaloper1sl97x54v0u3extuj2zrf7h0qrrtpgpslmahxau	0.0264184983
terravaloper1lnlasdy5r2hdjz3ta2r86ufkz309zdjvqshec4	0.006382978723
terravaloper1564j3fq8p8np4yhh4lytnftz33japc03wn40kg	0.02277567656`;

  const rows = elements.split("\n").map((a) => a.split("\t").map((a) => a.trim()) as [string, string]);

  // const contract = getInfo("ve3", network, Ve3InfoKeys.pdt_addr);
  const contract = getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr("single"));

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      printProposal(
        new MsgExecuteContract(address, contract, <ExecuteMsg>{
          alliance_delegate: {
            delegations: rows.map(([val, perc]) => ({
              validator: val,
              amount: (+perc * amount).toFixed(0) + "000000",
            })),
          },
        })
      ),
      // done("[PDT] Stake VT", "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"),
    ].filter(notEmpty)

    // gaugeNames.map((gauge) => {
    //   const contract = getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr(gauge));
    //   addProposal(
    //     new MsgExecuteContract(address, contract, <ExecuteMsg>{
    //       alliance_delegate: {
    //         delegations: rows.map(([val, perc]) => ({
    //           validator: val,
    //           amount: (+perc * amount).toFixed(0) + "000000",
    //         })),
    //       },
    //     })
    //   );
    // })
  );
  console.log(`Contract added route! Txhash: ${txhash}`);
})();

import { MsgExecuteContract } from "@terra-money/feather.js";
import { sum } from "lodash";
import yargs from "yargs/yargs";
import { notEmpty } from "../cosmos/helpers";
import {
  addProposal,
  Chains,
  createLCDClient,
  createWallet,
  done,
  getInfo,
  getPrefix,
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

  const to = `terravaloper188e99yz54744uhr8xjfxmmplhnuw75xea55zfp	0.04340678176
terravaloper1ge3vqn6cjkk2xkfwpg5ussjwxvahs2f6at87yp	0.03000929291
terravaloper1lelhxdzwn9ddecv6sv0kcxj5tguurxnzcfs5wf	0.04470200727
terravaloper1rr2g4z2ch4cqwl8s70yj94a5l2vakg0v36nmjh	0.04490438625
terravaloper1wdymftapg5pcvf2aqw4pd0yuuh5w9m6yqdnukv	0.01171423261
terravaloper1jt8pcx4sesgztjkjsvjjqtvyfgcehqx09u4exq	0.03903539567
terravaloper1vrkzjujfds9p8t5g0xety3e3ft4dep02etv9le	0.03903539567
terravaloper1wr0p7dzss74wfmzfqm8r65mk26efg5zhzpm77s	0.03903539567
terravaloper1pet430t7ykswxuyhh56d4gk6rt7qgu9as6a5r0	0.04528023294
terravaloper15lsftv92eyssjwkh2393s0nhjc07kryqen2fqf	0.01535705435
terravaloper199fjq4rnfvz24cktl8cervx8h8e90rukmgdv5x	0.02628551958
terravaloper16vc0num5aaq4mqdh4vjhs02s3ypd0j8c7ujxpm	0.02082128697
terravaloper1kepapcnh78hsk8nx2u9nv05rn7vjwwf4fr59zu	0.00625
terravaloper1yy5379nk24xffpq4egw7ue4ad3j7l79ma2enmz	0.03174975219
terravaloper1tm0xkark2ufecmdhgaaw7gqsycyt4qag6py8x6	0.0372139848
terravaloper1pgyelqv0hwjavgf6vhdm4e4pt766wfxxczu20l	0.02244031885
terravaloper19kg9ncvkuk08pxz0rnnywh65h5tvux9mlj7tc3	0.01171423261
terravaloper1puzp2yjqps43x7nse33svljc550xjz35jxg432	0.01535705435
terravaloper10c04ysz9uznx2mkenuk3j3esjczyqh0j783nzt	0.03357116306
terravaloper1s6j9wxyprdsxmdf6mvsegsldvmtk0p92pa7aey	0.009892821741
terravaloper1vm5azhvaxeanc7auxh02y8jmxrk8tj93f43e7j	0.04470200727
terravaloper1mgpgp53tynj4djmckxdjhufa7q8lqqjuwnrlqm	0.00625
terravaloper1vcd42qfvlvnjwaw7hvl6y32wrzqxvas653yus9	0.03478543697
terravaloper1jncrqd24wtcdpes9y89qsh0jn5c8sayn92302l	0.01899987609
terravaloper1htey4gcdcass29vn4dwjcuq58mrvv8ra5pjz4k	0.04065442756
terravaloper15389y60f0rk596tm38qewqycr8ztt8hshsf2mk	0.01535705435
terravaloper1ktu7a6wqlk6vlywf4rt6wfcxuphc0es27p0qvx	0.03053547828
terravaloper1q8w4u2wyhx574m70gwe8km5za2ptanny9mnqy3	0.00625
terravaloper1cs0dspacdhym4cwcm3f7suurfszvl6k5s9p06a	0.01029757971
terravaloper1vjr8z6g38f39j23y55pdektc3l2uqc9y02f9k5	0.00625
terravaloper1wwq9mfkkqfta334d4hcjrjau9y50a4hw37zhdl	0.01353564348
terravaloper1plxp55happ379eevsnk2xeuwzsrldsmqduyu36	0.01171423261
terravaloper1ulwqct0df2xuuaqzcq4yax3msdqgew6ehhcl7r	0.01899987609
terravaloper1cl8j3r09vmlxf5zsq4xms7td8x2qcfml8637yf	0.009892821741
terravaloper1jveyrzquwrt0txanmhg7jdhf2q4ry28k2esps4	0.01171423261
terravaloper1hy8lzd38kp0t8662r2vnxsc4ezs3l74506jx02	0.00625
terravaloper1l920a79akuc98hz4389axf9ctcymrf5ays578x	0.00625
terravaloper14yeuqqg2e2fc2mcrghuqxh0w43xshpzrhnhz86	0.00625
terravaloper10mmhvx5nrnuye2x9zhe02jcg0hfzzzjlwc0sxw	0.00625
terravaloper1u53qwdgafryksqnzq3k7e5eyph7jlh8kgc3va4	0.00625
terravaloper1a9zv7n6pmkzlm3wj6c23qyejqlmyxsl5faanrv	0.02082128697
terravaloper1l9mchtvqgvpyskgtemsrkjn0e57a7wm6c863uj	0.00625
terravaloper1tfy452kxfcsa2353nenltade9esj7ffrc38gwn	0.00625
terravaloper1t3zvwaz7v3epg3f33waxajv4nj95mt8ma9yc7g	0.00625
terravaloper1sl97x54v0u3extuj2zrf7h0qrrtpgpslmahxau	0
terravaloper1lnlasdy5r2hdjz3ta2r86ufkz309zdjvqshec4	0.00625
terravaloper1564j3fq8p8np4yhh4lytnftz33japc03wn40kg	0.02628551958
terravaloper1mnfavz2tcq6shdfph5azt7gwt6va2s6weqdnkq	0.02082128697
terravaloper1vh9m0jpuznh00t05c66yqqpsgqzudrg258q6ch	0.02810693045`;

  const pdt = getInfo("ve3", network, Ve3InfoKeys.pdt_addr);
  const delegations = await terra.alliance.alliancesDelegation(pdt);

  const total = sum(delegations.delegations.map((a) => +a.balance.amount));
  const fromRows = delegations.delegations.map(
    (a) => [a.delegation.validator_address, +a.balance.amount / total] as [string, number]
  );

  // const fromRows = from.split("\n").map((a) => a.split("\t").map((a) => a.trim()) as [string, string]);
  const toRows = to.split("\n").map((a) => a.split("\t").map((a) => a.trim()) as [string, string]);

  // const contract = getInfo("ve3", network, Ve3InfoKeys.pdt_addr);
  const contracts: string[] = [
    getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr("single")),
    getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr("bluechip")),
    getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr("stable")),
    getInfo("ve3", network, Ve3InfoKeys.alliance_connector_addr("project")),
    getInfo("ve3", network, Ve3InfoKeys.pdt_addr),
  ];

  const transfers = calculateTransfers(new Map(fromRows), new Map(toRows), 0.001);

  console.log("transfers", transfers);

  const { txhash } = await sendTxWithConfirm(
    admin,

    [
      ...contracts.map((a) =>
        addProposal(
          new MsgExecuteContract(address, a, <ExecuteMsg>{
            alliance_redelegate: {
              redelegations: transfers.map((a) => ({
                src_validator: a.from,
                dst_validator: a.to,
                amount: (Math.floor(a.amount * amount) * 1e6).toFixed(0),
              })),
            },
          })
        )
      ),
      done(
        "[LA+PDT] Redelegate VT",
        "Provide additional delegations to Big Labs",
        "terra1k8ug6dkzntczfzn76wsh24tdjmx944yj6mk063wum7n20cwd7lxq4lppjg"
      ),
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

type Change = {
  from: string;
  to: string;
  amount: number;
};

function calculateTransfers(
  from: Map<string, string | number>,
  to: Map<string, string | number>,
  threshold: number
): Change[] {
  const changes: Change[] = [];

  // Create arrays to store "needs" and "excesses"
  const needs: { key: string; amount: number }[] = [];
  const excesses: { key: string; amount: number }[] = [];

  // Calculate differences between "from" and "to"
  for (const [key, toValue] of to) {
    const fromValue = from.get(key) || 0;
    const difference = +toValue - +fromValue;

    if (Math.abs(difference) >= threshold) {
      if (difference > 0) {
        needs.push({ key, amount: difference });
      } else {
        excesses.push({ key, amount: -difference });
      }
    }
  }

  // Perform transfers from excesses to needs
  for (const need of needs) {
    let remainingNeed = need.amount;

    for (const excess of excesses) {
      if (remainingNeed === 0) break;

      const transferAmount = Math.min(remainingNeed, excess.amount);
      if (transferAmount >= threshold) {
        changes.push({
          from: excess.key,
          to: need.key,
          amount: transferAmount,
        });
      }

      remainingNeed -= transferAmount;
      excess.amount -= transferAmount;
    }
  }

  return changes;
}

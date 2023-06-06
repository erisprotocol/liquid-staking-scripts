import { InstantiateMsg } from "../types/tokenfactory/hub/eris_staking_hub_tokenfactory_kujira_instantiate";

// ts-node amplifier/instantiate_tf.ts

const x = <InstantiateMsg>{
  chain_config: {},
  denom: "ukuji",
  owner: "kujira1dpaaxgw4859qhew094s87l0he8tfea3l4z76jq",
  operator: "kujira1c023jxq099et7a44ledfwuu3sdkfq8cacpwdtj",
  protocol_reward_fee: "0",
  protocol_fee_contract: "kujira1z3txc4x7scxsypx9tgynyfhu48nw60a55as0fq",
  utoken: "ampKUJI",
  delegation_strategy: "uniform",
  epoch_period: 172800,
  unbond_period: 1209600,
  validators: [
    "kujiravaloper1670dvuv348eynr9lsmdrhqu3g7vpmzx9ugf8fk",
    "kujiravaloper1lcgzkqstk4jjtphfdfjpw9dd9yfczyzmcyxvj9",
    "kujiravaloper1tnuqj73jfn3724lqz34c27tuv80nv336sadqym",
    "kujiravaloper1pshqems6hdka48gc56r2ykshyaarkt40hl0rlh",
    "kujiravaloper1vmmlphwck04khtwj69ghuewux5hrmvwwc43j77",
    "kujiravaloper1tharcgrfu6j0dcwpe5y6ez3s904rhq2kmccm4k",
    "kujiravaloper1umy6425nsccm22qvtugxsfyvpee60xfs9x3w0x",
    "kujiravaloper1phekwx93vtlk8yjqvvnppzgkfd9tt7e8qxmy2l",
  ],
};

console.log(JSON.stringify(x));

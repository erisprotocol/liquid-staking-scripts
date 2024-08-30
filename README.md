# Scripts

This directory contains scripts to deploy, migrate, or interact with Eris Stake Hub smart contract. As well as the bots run by ERIS.
Originally this repository was included in the main repository: <https://github.com/erisprotocol/liquid-staking-contracts> - we wanted to move it out, so that the commit history for the smart contracts is more visible and does not change often, and only when we change something with the source code. Best setup is to have both repositories in the same parent folder.

## How to Use

Install dependencies:

```bash
cd scripts
yarn
```

Import the key to use to sign transactions. You will be prompted to enter the seed phrase and a password to encrypt the private key. By default, the encrypted key will be saved at `scripts/keys/{keyname}.json`. The script also provide commands to list or remove keys.

```bash
ts-node 1_manage_keys.ts add <keyname> [--key-dir string]
```

To deploy the contract, create a JSON file containing the instantiation message, and use the following command. You will be prompted to enter the password to decrypt the private key.

```bash
ts-node 2_deploy.ts \
  --network mainnet|testnet|localterra \
  --key keyname \
  --msg /path/to/instantiate_msg.json
```

To stake Luna and mint Stake:

```bash
ts-node 4_bond.ts \
  --network mainnet|testnet|localterra \
  --key keyname \
  --contract-address terra... \
  --amount 1000000
```

Other scripts work similarly to the examples above.

## Real examples

```bash
ts-node 1_manage_keys.ts add invest
```

### Testnet

```bash
ts-node 2_deploy.ts --network testnet --key testnet --hub-code-id 169 --token-code-id 125
```

```bash
ts-node 3_migrate.ts --network testnet --key testnet --contract-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
```

```bash
ts-node 5_harvest.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
```

```bash
ts-node 6_rebalance.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
```

```bash
ts-node 8_submit_batch.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88
```

```bash
ts-node 10_add_validator.ts --network testnet --key testnet --hub-address terra1kye343r8hl7wm6f3uzynyyzl2zmcm2sqmvvzwzj7et2j5jj7rjkqa2ue88 --validator-address terravaloper1uxx32m0u5svtvrujnpcs6pxuv7yvn4pjhl0fux
```

### Mainnet

```bash
ts-node 2_deploy.ts --network mainnet --key mainnet --hub-code-id 11 --token-code-id 12
```

```bash
ts-node 3_migrate.ts --network mainnet --key mainnet --contract-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk
```

```bash
ts-node 5_harvest.ts --network mainnet --key mainnet --hub-address terra10788fkzah89xrdm27zkj5yvhj9x3494lxawzm5qq3vvxcqz2yzaqyd3enk
```

```bash
ts-node 11_multisend.ts --network mainnet --key invest
```

### Launching Amplifier

```bash
echo 'NETWORK="nibiru"; echo $NETWORK' >  ~/.network
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key mainnet \
    --folder contracts-tokenfactory \
    --contracts  eris_staking_hub_tokenfactory_nibiru ve3_voting_escrow ve3_zapper
```

```bash
source ~/.network
ts-node 2_deploy_hub_tokenfactory.ts \
    --network $NETWORK \
    --key key-mainnet \
    --hub-code-id 132 \
    --hub-binary "../contracts-tokenfactory/artifacts/eris_staking_hub_tokenfactory_nibiru.wasm"
```

```bash
source ~/.network
ts-node amp-governance/2_instantiate_escrow.ts \
    --network $NETWORK \
    --key key-mainnet \
    --contract-code-id 133
```

```bash
source ~/.network
ts-node amp-governance/4_instantiate_ampgauges.ts \
    --network $NETWORK \
    --key key-mainnet \
    --contract-code-id 134
```

```bash
source ~/.network
ts-node amp-governance/4_instantiate_propgauges.ts \
    --network $NETWORK \
    --key key-mainnet \
    --contract-code-id 135
```

```bash
source ~/.network
ts-node amp-governance/5_config_escrow_for_update.ts \
  --network $NETWORK  \
  --key key-mainnet \
  --contract nibi1us4rh4a9rexvde8l3m8f8nlz6wcf9qg57zk2w06kqkm4vtp96vkst9kuwd

```

```bash
source ~/.network
ts-node amp-governance/6_config_hub.ts \
  --network $NETWORK  \
  --key key-mainnet \
  --contract nibi1udqqx30cw8nwjxtl4l28ym9hhrp933zlq8dqxfjzcdhvl8y24zcqpzmh8m

```

#### Nibiru

tf/nibi1udqqx30cw8nwjxtl4l28ym9hhrp933zlq8dqxfjzcdhvl8y24zcqpzmh8m/ampNIBI

fee: nibi1z3txc4x7scxsypx9tgynyfhu48nw60a5jskwde
owner: nibi1dpaaxgw4859qhew094s87l0he8tfea3ln0cmke
operator: nibi1c023jxq099et7a44ledfwuu3sdkfq8ca7vgv0t

eris_staking_hub_tokenfactory_nibiru: 132 -> nibi1udqqx30cw8nwjxtl4l28ym9hhrp933zlq8dqxfjzcdhvl8y24zcqpzmh8m
eris_gov_voting_escrow: 133 -> nibi1us4rh4a9rexvde8l3m8f8nlz6wcf9qg57zk2w06kqkm4vtp96vkst9kuwd
eris_gov_amp_gauges: 134 -> nibi1qh59hdelxfwah7g7e8k0lxu4upqatq5w4jdw60yv9shhlhm86ckq4txl92
eris_gov_prop_gauges: 135 -> nibi19g4zl2rac0ljtxrwqrd0lqgaca7ettn3p2udu4w3zamk84fae72ssvf2le

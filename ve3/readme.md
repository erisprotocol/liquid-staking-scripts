# Voting Escrow Scripts

```bash
echo 'NETWORK="mainnet-copy"; echo $NETWORK' >  ~/.network

```

```bash
echo 'NETWORK="mainnet"; echo $NETWORK' >  ~/.network
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts  ve3_global_config ve3_voting_escrow ve3_zapper
```

--contracts ve3_asset_gauge ve3_asset_staking ve3_bribe_manager ve3_connector_alliance ve3_connector_emission ve3_global_config ve3_voting_escrow ve3_zapper \

```typescript mainnet
"ve3_asset_gauge: 3117";
"ve3_asset_staking: 3118";
"ve3_bribe_manager: 3119";
"ve3_connector_alliance: 3120";
"ve3_global_config: 3121";
"ve3_voting_escrow: 3122";
"ve3_zapper: 3123";
```

```bash
source ~/.network
ts-node ve3/00_init_global_config.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3121 \
    --label ve3-global-config
```

```bash
source ~/.network
ts-node ve3/01_init_zapper.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3123 \
    --label ve3-zapper
```

```bash
source ~/.network
ts-node ve3/01_init_asset_gauge.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3117 \
    --label ve3-asset-gauge
```

```bash
source ~/.network
ts-node ve3/01_init_connector_alliance.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3120 \
    --label ve3-connector-alliance \
    --gauge "stable"
```

```bash
source ~/.network
ts-node ve3/01_init_connector_alliance.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3120 \
    --label ve3-connector-alliance \
    --gauge "project"
```

```bash
source ~/.network
ts-node ve3/01_init_connector_alliance.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3120 \
    --label ve3-connector-alliance \
    --gauge "bluechip"
```

```bash
source ~/.network
ts-node ve3/01_init_voting_escrow.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3122 \
    --label ve3-voting-escrow
```

```bash
source ~/.network
ts-node ve3/02_init_asset_staking.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3118 \
    --label ve3-asset-staking \
    --gauge "stable"
```

```bash
source ~/.network
ts-node ve3/02_init_asset_staking.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3118 \
    --label ve3-asset-staking \
    --gauge "project"
```

```bash
source ~/.network
ts-node ve3/02_init_asset_staking.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3118 \
    --label ve3-asset-staking \
    --gauge "bluechip"
```

```bash
source ~/.network
ts-node ve3/03_init_bribe_manager.ts \
    --network $NETWORK \
    --key mainnet \
    --contract-code-id 3119 \
    --label ve3-bribe-manager
```

```bash
source ~/.network
ts-node ve3/04_update_global_config.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
source ~/.network
ts-node ve3/04_update_push_notifications.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
source ~/.network
ts-node ve3/04_update_zapper.ts \
    --network $NETWORK \
    --key mainnet
```

## Runtime

```bash
source ~/.network
ts-node ve3/05_whitelist_lp.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
source ~/.network
ts-node ve3/05_move_lp.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
source ~/.network
ts-node ve3/05_update_asset_config.ts \
    --network $NETWORK \
    --key mainnet
```

## Queries

```bash
source ~/.network
ts-node ve3/get_lp_info.ts \
    --network $NETWORK
```

```bash
source ~/.network
ts-node ve3/get_routes.ts \
    --network $NETWORK
```

```bash
source ~/.network
ts-node ve3/get_contract_state.ts \
    --network $NETWORK
```

## NewRelic

```bash
ts-node ve3/06_propose_alliance.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
ts-node ve3/06_transfer.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
ts-node ve3/06_vote_yes.ts \
    --network $NETWORK \
    --key mainnet
```

```bash
ts-node ve3/06_stake_vt.ts \
    --network $NETWORK \
    --key mainnet
```

## Migrations

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_asset_gauge \
    --migrates terra1z40yygcx7mau96yav87389fg8csx9479vay5lztwxv0t8l0p7yfqetdc3d
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_asset_staking \
    --migrates terra1v399cx9drllm70wxfsgvfe694tdsd9x96p9ha36w7muffe4znlusqswspq terra1awq6t7jfakg9wfjn40fk3wzwmd57mvrqtt3a39z9rmet7wdjj3ysgw3lpa terra14mmvqn0kthw6sre75vku263lafn5655mkjdejqjedjga4cw0qx2qlf4arv \
    --migratesAll true
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_zapper \
    --migrates terra1jrt9q0pfg8e9n0ypjp5m93hyxzy2wgne4z3kyurll9lr783gvgqqwq0vne
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_connector_alliance \
    --migrates terra1jp4tnf3ygdkx7gumt2jdnfdwdvc24tepfpy9ce57crr3l6nmcmhs60kmuu terra1xenxeajhmtgv3m0paadnz8k6ex4c82pnxfuxd6n4drlywelsmz8svvszss terra1s49440fvedlz98xjhfuzqaflyqx0zcrqz502ujukzmulau2zggnqg66a9e \
    --migratesAll true
```

--contracts ve3_asset_gauge ve3_asset_staking ve3_bribe_manager ve3_connector_alliance ve3_connector_emission ve3_global_config ve3_voting_escrow \

```typescript mainnet-copy
"ve3_asset_gauge: 3077";
"ve3_asset_staking: 3079";
"ve3_bribe_manager: 3075";
"ve3_connector_alliance: 3069";
"ve3_connector_emission: 3070";
"ve3_global_config: 3072";
"ve3_voting_escrow: 3074";
"ve3_zapper: 3080";
```

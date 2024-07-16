# Voting Escrow Scripts

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network mainnet-copy \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_zapper
```

--contracts ve3_asset_gauge ve3_asset_staking ve3_bribe_manager ve3_connector_alliance ve3_connector_emission ve3_global_config ve3_voting_escrow ve3_zapper \

```bash
ts-node ve3/00_init_global_config.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3072 \
    --label ve3-global-config
```

```bash
ts-node ve3/01_init_zapper.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3080 \
    --label ve3-zapper
```

```bash
ts-node ve3/01_init_asset_gauge.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3064 \
    --label ve3-asset-gauge
```

```bash
ts-node ve3/01_init_connector_alliance.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3069 \
    --label ve3-connector-alliance \
    --gauge "stable"
```

```bash
ts-node ve3/01_init_connector_alliance.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3069 \
    --label ve3-connector-alliance \
    --gauge "project"
```

```bash
ts-node ve3/01_init_connector_alliance.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3069 \
    --label ve3-connector-alliance \
    --gauge "bluechip"
```

```bash
ts-node ve3/01_init_voting_escrow.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3074 \
    --label ve3-voting-escrow
```

```bash
ts-node ve3/02_init_asset_staking.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3065 \
    --label ve3-asset-staking \
    --gauge "stable"
```

```bash
ts-node ve3/02_init_asset_staking.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3065 \
    --label ve3-asset-staking \
    --gauge "project"
```

```bash
ts-node ve3/02_init_asset_staking.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3065 \
    --label ve3-asset-staking \
    --gauge "bluechip"
```

```bash
ts-node ve3/03_init_bribe_manager.ts \
    --network mainnet-copy \
    --key mainnet \
    --contract-code-id 3075 \
    --label ve3-bribe-manager
```

```bash
ts-node ve3/04_update_global_config.ts \
    --network mainnet-copy \
    --key mainnet
```

```bash
ts-node ve3/04_update_push_notifications.ts \
    --network mainnet-copy \
    --key mainnet
```

## Runtime

```bash
ts-node ve3/05_whitelist_lp.ts \
    --network mainnet-copy \
    --key mainnet \
    --gauge stable
```

```bash
ts-node ve3/05_whitelist_lp.ts \
    --network mainnet-copy \
    --key mainnet \
    --gauge project
```

## Queries

```bash
ts-node ve3/get_lp_info.ts \
    --network mainnet-copy
```

## NewRelic

```bash
ts-node ve3/06_propose_alliance.ts \
    --network mainnet-copy \
    --key mainnet
```

```bash
ts-node ve3/06_transfer.ts \
    --network mainnet-copy \
    --key mainnet
```

```bash
ts-node ve3/06_vote_yes.ts \
    --network mainnet-copy \
    --key mainnet
```

## Migrations

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network mainnet-copy \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_asset_gauge \
    --migrates terra1z40yygcx7mau96yav87389fg8csx9479vay5lztwxv0t8l0p7yfqetdc3d
```

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network mainnet-copy \
    --key mainnet \
    --folder contracts-ve3 \
    --contracts ve3_asset_staking \
    --migrates terra169a77cjdcq96ceyqdpcxreud5nd3c3xdyhq8mjpw9m8eyy2gpx3q24n2j4 terra1axj46c0jrgxnr50y0lhju3v9uvseva46evphztjtwld8eg3mnlys67lx9p terra1fhwmd37xlrl2hmf63q4w7znxp7ahrx53nx8cyfhnd3fm964z353qgtq705 \
    --migratesAll true
```

--contracts ve3_asset_gauge ve3_asset_staking ve3_bribe_manager ve3_connector_alliance ve3_connector_emission ve3_global_config ve3_voting_escrow \

```typescript
"ve3_asset_gauge: 3077";
"ve3_asset_staking: 3079";
"ve3_bribe_manager: 3075";
"ve3_connector_alliance: 3069";
"ve3_connector_emission: 3070";
"ve3_global_config: 3072";
"ve3_voting_escrow: 3074";
"ve3_zapper: 3080";
```

```bash
echo 'NETWORK="neutron"; echo $NETWORK' >  ~/.network

```

```bash
echo 'NETWORK="testnet-neutron"; echo $NETWORK' >  ~/.network
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-mainnet \
    --folder ../superbolt/superbolt-contracts \
    --add-codes super \
    --contracts \
 super_marketplace
```

super_candy \
 super_collection \
 super_collector \
 super_foundry \
 super_marketplace \
 super_minter \
 super_offer \
 super_particles \
 ve3_asset_gauge \
 ve3_asset_staking \
 ve3_bribe_manager \
 ve3_connector_emission \
 ve3_global_config \
 ve3_voting_escrow \
 ve3_zapper

```bash
source ~/.network
ts-node super/04_update_codes.ts \
    --network $NETWORK \
    --key key-mainnet
```

```bash
source ~/.network
ts-node super/00_init_global_config.ts \
    --network $NETWORK \
    --key key-mainnet
```

```bash
source ~/.network
ts-node super/01_init_super_foundry.ts \
    --network $NETWORK \
    --key key-mainnet
```

```bash
source ~/.network
ts-node super/01_init_super_marketplace.ts \
    --network $NETWORK \
    --key key-mainnet
```

```bash
source ~/.network
ts-node super/01_init_super_offer.ts \
    --network $NETWORK \
    --key key-mainnet
```

```bash
source ~/.network
ts-node super/04_update_global_config.ts \
    --network $NETWORK \
    --key key-mainnet
```

```bash
echo 'NETWORK="neutron"; echo $NETWORK' >  ~/.network
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-neutron \
    --folder contracts-ve3 \
    --contracts ve3_zapper ve3_global_config
```

--contracts ve3_zapper ve3_global_config \

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-neutron \
    --folder boost-contracts \
    --contracts launch_factory launch_nft
```

--launch_factory launch_nft

```bash
source ~/.network
ts-node launchpad/00_init_global_config.ts \
    --network $NETWORK \
    --key key-neutron \
    --contract-code-id 2597 \
    --label config
```

```bash
source ~/.network
ts-node launchpad/01_init_zapper.ts \
    --network $NETWORK \
    --key key-neutron \
    --contract-code-id 2596 \
    --label zapper
```

```bash
source ~/.network
ts-node launchpad/01_init_launch.ts \
    --network $NETWORK \
    --key key-neutron \
    --contract-code-id 2655 \
    --label permissionless
```

```bash
source ~/.network
ts-node launchpad/01_init_launch_nft.ts \
    --network $NETWORK \
    --key key-neutron \
    --contract-code-id 2934 \
    --label permissionless
```

```bash
source ~/.network
ts-node launchpad/01_init_treasury.ts \
    --network $NETWORK \
    --key key-neutron \
    --contract-code-id 2882 \
    --label treasury
```

### Runtime

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-neutron \
    --key-migrate key-neutron \
    --folder boost-contracts \
    --contracts launch_factory \
    --migrates neutron1e0n8uu8cz36z5yvexra2ay5z2akgy30r2d5ampsfd83m9gq7wa4qw0gjlh neutron1926ks2plcsnz45p6nk9gr02p5xc6a5a23jvpwq8ljzdhpk0k9fmsljfqr5 \
    --add-codes launchpad \
    --migratesAll true
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-neutron \
    --key-migrate key-neutron \
    --folder boost-contracts \
    --contracts launch_nft \
    --migrates neutron1h5ywh4ekgjnced540rzh52s2rx5ev206p988rd409g7xhnqfe6hq8402a9 \
    --add-codes launchpad \
    --migratesAll true
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-neutron \
    --key-migrate key-neutron \
    --folder contracts-ve3 \
    --contracts ve3_zapper \
    --migrates terra1qdjsxsv96aagrdxz83gwtjk8qvf2mrg4y8y3dqjxg556lm79pg5qdgmaxl
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-neutron \
    --key-migrate key-neutron \
    --folder ../other/boost-contracts \
    --contracts treasury \
    --migrates neutron1th9pqj2an2uyu80qwk0w9uvm0funyw679fj48u3vaqkv89vg3ttsn6eugz
```

# Terra

```bash
echo 'NETWORK="mainnet"; echo $NETWORK' >  ~/.network
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-boost-terra \
    --folder boost-contracts \
    --add-codes launchpad \
    --contracts launch_factory launch_nft
```

```bash
source ~/.network
ts-node launchpad/01_init_launch.ts \
    --network $NETWORK \
    --key key-boost-terra \
    --contract-code-id 3452\
    --label permissionless
```

```bash
source ~/.network
ts-node launchpad/01_init_launch_nft.ts \
    --network $NETWORK \
    --key key-boost-terra \
    --contract-code-id 3453 \
    --label permissionless
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-boost-terra \
    --key-migrate key-boost-terra \
    --folder boost-contracts \
    --contracts launch_factory \
    --add-codes launchpad \
    --migrates terra1xype2z9pqp3rtysxa4s78w2deees3hfc5ua28z06tta4m8l32v2s2c6gmg
```

```bash
source ~/.network
ts-node amp-governance/1_upload_contracts.ts \
    --network $NETWORK \
    --key key-boost-terra \
    --key-migrate key-boost-terra \
    --folder boost-contracts \
    --contracts launch_nft \
    --add-codes launchpad \
    --migrates terra1kj7pasyahtugajx9qud02r5jqaf60mtm7g5v9utr94rmdfftx0vqspf4at
```

```bash
source ~/.network
ts-node launchpad/02_update_royalties.ts \
    --network $NETWORK \
    --key boost-owner
```

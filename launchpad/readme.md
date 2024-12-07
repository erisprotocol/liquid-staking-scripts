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
    --folder ../other/boost-contracts \
    --contracts launch_factory
```

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

### Runtime

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
    --contracts launch_factory \
    --migrates neutron1e0n8uu8cz36z5yvexra2ay5z2akgy30r2d5ampsfd83m9gq7wa4qw0gjlh neutron1926ks2plcsnz45p6nk9gr02p5xc6a5a23jvpwq8ljzdhpk0k9fmsljfqr5 \
    --migratesAll true
```

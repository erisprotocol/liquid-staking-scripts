# Migrating ampMNTA

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network kujira-copy \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contracts eris_dao_lst_kujira
```

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network kujira-copy \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contracts eris_dao_lst_kujira \
    --code-id 386 \
    --migrates kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

```bash
ts-node dao-lst/10_update_config.ts \
    --network kujira \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contract kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

## Mainnet

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network kujira \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contracts eris_dao_lst_kujira \
    --migrates kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network kujira \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contracts eris_dao_lst_kujira \
    --code-id 386 \
    --migrates kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

```bash
ts-node dao-lst/10_update_config.ts \
    --network kujira \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contract kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

# Lion Dao Migration

2852 ->3240-> 3241 -> 3242

```bash
ts-node amp-governance/1_upload_contracts.ts \
    --network mainnet \
    --key mainnet \
    --folder contracts-dao-lst \
    --contracts eris_dao_lst_terra
```

```bash
ts-node dao-lst/lion_dao_execute.ts \
    --network mainnet \
    --key mainnet \
    --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
```

```bash
ts-node dao-lst/lion_dao_migrate.ts \
    --network mainnet \
    --key ledger \
    --code-id 3242 \
    --contract terra1vklefn7n6cchn0u962w3gaszr4vf52wjvd4y95t2sydwpmpdtszsqvk9wy
```

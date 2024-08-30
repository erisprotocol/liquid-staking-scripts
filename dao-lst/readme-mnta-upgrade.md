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
    --code-id 371 \
    --migrates kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

```bash
ts-node dao-lst/10_update_config.ts \
    --network kujira-copy \
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
ts-node dao-lst/10_update_config.ts \
    --network kujira \
    --key key-mainnet \
    --folder contracts-dao-lst \
    --contract kujira175yatpvkpgw07w0chhzuks3zrrae9z9g2y6r7u5pzqesyau4x9eqqyv0rr
```

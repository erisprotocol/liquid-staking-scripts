import { PubKey } from "@injectivelabs/sdk-ts/dist/cjs/client/chain/types/auth";
import { JSONSerializable } from "@terra-money/feather.js/dist/util/json";
import { PubKey as PubKey_pb } from "@terra-money/terra.proto/cosmos/crypto/secp256k1/keys";
import { Any } from "@terra-money/terra.proto/google/protobuf/any";
import { bech32 } from "bech32";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace InjPubKey {
  export interface Amino {
    type: "tendermint/PubKeySecp256k1";
    value: string;
  }

  export interface Data {
    "@type": "/injective.crypto.v1beta1.ethsecp256k1.PubKey";
    key: string;
  }

  export type Proto = PubKey;
}

export class InjPubKey extends JSONSerializable<
  InjPubKey.Amino,
  InjPubKey.Data,
  InjPubKey.Proto
> {
  constructor(public key: string) {
    super();
  }

  public static fromAmino(data: InjPubKey.Amino): InjPubKey {
    return new InjPubKey(data.value);
  }

  public toAmino(): InjPubKey.Amino {
    return {
      type: "tendermint/PubKeySecp256k1",
      value: this.key,
    };
  }

  public static fromData(data: InjPubKey.Data): InjPubKey {
    return new InjPubKey(data.key);
  }

  public toData(): InjPubKey.Data {
    return {
      "@type": "/injective.crypto.v1beta1.ethsecp256k1.PubKey",
      key: this.key,
    };
  }

  public static fromProto(pubkeyProto: InjPubKey.Proto): InjPubKey {
    return new InjPubKey(Buffer.from(pubkeyProto.key).toString("base64"));
  }

  public toProto(): InjPubKey.Proto {
    return PubKey_pb.fromPartial({
      key: Buffer.from(this.key, "base64"),
    });
  }

  public packAny(): Any {
    return Any.fromPartial({
      typeUrl: "/cosmos.crypto.secp256k1.PubKey",
      value: PubKey_pb.encode(this.toProto()).finish(),
    });
  }

  public static unpackAny(pubkeyAny: Any): InjPubKey {
    return InjPubKey.fromProto(PubKey_pb.decode(pubkeyAny.value));
  }

  public encodeAminoPubkey(): Uint8Array {
    return Buffer.concat([
      pubkeyAminoPrefixSecp256k1,
      Buffer.from(this.key, "base64"),
    ]);
  }

  public rawAddress(): Uint8Array {
    const pubkeyData = Buffer.from(this.key, "base64");
    return ripemd160(sha256(pubkeyData));
  }

  public address(): string {
    return bech32.encode("inj", bech32.toWords(this.rawAddress()));
  }

  public pubkeyAddress(): string {
    return bech32.encode("injpub", bech32.toWords(this.encodeAminoPubkey()));
  }
}

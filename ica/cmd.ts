import { Coin, MsgTransfer } from "@terra-money/feather.js";
import * as promptly from "promptly";
import {
  createLCDClient,
  createWallet,
  getPrefix,
  sendTxWithConfirm,
} from "../helpers";
import * as keystore from "../keystore";

enum Command {
  IbcTransfer = "t",
}

async function execute() {
  while (true) {
    const commands = Object.values(Command);
    const text = Object.keys(Command)
      .map((a) => a + "=" + (Command as any)[a as any])
      .join(", ");
    const result = (await promptly.choose(
      `Command? ${text}`,
      commands
    )) as any as Command;

    const lcd = createLCDClient("testnet-cosmos");
    const sender = await createWallet(
      lcd,
      "key-test",
      keystore.DEFAULT_KEY_DIR
    );

    switch (result) {
      case Command.IbcTransfer: {
        const amount = +(await promptly.prompt("Amount")) ?? 1000;
        const to =
          (await promptly.prompt("To")) ??
          "kujira1c023jxq099et7a44ledfwuu3sdkfq8cacpwdtj";

        await sendTxWithConfirm(sender, [
          new MsgTransfer(
            "transfer",
            "channel-4004", // "channel-3758",
            new Coin("uatom", amount),
            sender.key.accAddress(getPrefix()),
            to,
            undefined,
            15 * 60 * 1000 * 1000 * 1000 + Date.now() * 1000 * 1000,
            ""
          ),
        ]);
      }
    }
  }
}

execute();

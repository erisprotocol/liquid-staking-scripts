import yargs from "yargs/yargs";
import { createLCDClient } from "../helpers";

const argv = yargs(process.argv)
  .options({
    network: {
      type: "string",
      demandOption: true,
    },
    proposal: {
      type: "string",
      demandOption: true,
    },
  })
  .parseSync();

// ts-node export_voters.ts --network mainnet --proposal 9

const templates: Record<string, string> = {
  mainnet: "terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq",
};

export interface AmpCompounderPool {
  pair: string;
  farm: string;
  name: string;
  amplp: string;
  lp: string;
  tokens?: string[];
}

(async function () {
  const terra = createLCDClient(argv["network"]);

  const contract = templates[argv.network];

  const query = await terra.wasm.contractQuery<{
    for_voters: string[];
    against_voters: string[];
  }>(
    contract,
    {
      proposal: { proposal_id: 9 },
    } // query msg
  );

  const voters = [...query.against_voters, ...query.for_voters];

  console.log(JSON.stringify(voters));
})();

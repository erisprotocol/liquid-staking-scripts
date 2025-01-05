import { Chains } from "../helpers";

interface Data {
  owner: string;
  bot: string;
  perma: string;
  dao: string;
}

export class LaunchpadInfoKeys {
  static global_config_addr = "global_config_addr";
  static zapper_addr = "zapper_addr";
  static burn_addr = "burn_addr";
  static launch_addr = (project: string) => `launches.${project}.launch_addr`;
}

export const config: Partial<Record<Chains, Data>> = {
  ["neutron"]: {
    owner: "neutron1vwysfe5hhh8xyawgdmx4m42f0q6u795yheq0fy",
    bot: "neutron1xlu86umylx3kd62ax2hz8s6qd8xuan4ps2k89y",
    perma: "neutron13u5zx66zp9vr9rk5lh2fh3j3t2j87ypv8wg4p8",
    dao: "neutron1ej43fvrmw40dg6xj40mmh822a8xz98rt5ad2p9tj2tgtgxw0zalsvvzm43",
  },
};

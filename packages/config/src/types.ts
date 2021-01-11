import { DriverArgs, BeemoProcess as BaseProcess, DriverContext } from '@beemo/core';

export interface Settings {
  decorators?: boolean;
  node?: boolean;
  react?: boolean;
};

export type BeemoProcess<Args = DriverArgs> = BaseProcess<DriverContext<Args>, Settings>;

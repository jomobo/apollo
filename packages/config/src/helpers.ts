import { PackageStructure } from '@boost/common';
import Beemo, { BeemoConfig } from '@beemo/core';
import path from 'path';
import { Settings } from "./types";

interface ApolloPackageStructure extends PackageStructure {
  apollo: BeemoConfig<Partial<Settings>>
}

let packageCache : ApolloPackageStructure | null = null;

export function getPackage() : ApolloPackageStructure {
  if (packageCache) {
    return packageCache;
  }

  packageCache = require(path.join(process.cwd(), 'package.json'));

  return packageCache!;
};

export function getSettings() : Settings  {
  const tool = (process.beemo?.tool as unknown) as Beemo<Settings>;
  const settings : Partial<Settings> = {};
  const pkg = getPackage();

  if (tool?.config?.settings) {
    Object.assign(settings, tool.config.settings);
  } else if (pkg?.apollo?.settings) {
    // if we are running node (server environment etc.) we have to use the
    // package.json fallback for settings since there is no Beemo instance
    // attached to the process.
    Object.assign(settings, pkg.apollo.settings);
  }

  return {
    buildFolder: 'lib',
    node: false,
    react: false,
    srcFolder: 'src',
    ...settings
  };
};

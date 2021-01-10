import { BabelConfig, BabelDriverArgs } from '@beemo/driver-babel';
import { ApolloEnvSetting, BeemoProcess, IGNORE_PATHS, MIN_NODE_VERSION, WEB_TARGET } from '@jomobo/apollo-common';

interface BabelOptions {
  env?: ApolloEnvSetting,
  esm?: boolean,
  typescript?: boolean
};

interface Args extends BabelDriverArgs {
  esm?: boolean
};

export function getConfig({
  env = {},
  esm = false,
  typescript = false
}: BabelOptions): BabelConfig {
  const { context, tool } = (process.beemo as unknown) as BeemoProcess<Args>;
  const { node = false, react = false } = tool.config.settings;

  const envOptions = {
    loose: true,
    modules: context.args.esm ? false : 'commonjs',
    shippedProposals: true,
    targets: node ? { node: tool.package?.engines?.node?.replace('>=', '') || MIN_NODE_VERSION } : WEB_TARGET,
    ...env
  };

  const presets: NonNullable<BabelConfig['presets']> = [['@babel/preset-env', envOptions], '@babel/typescript'];
  const plugins: NonNullable<BabelConfig['plugins']> = [
    ['babel-plugin-transform-dev', { evaluate: false }],
  ];

  switch (process.env.NODE_ENV) {
    case 'development': {
      if (react) {
        plugins.push(
          '@babel/plugin-transform-react-jsx-source',
          '@babel/plugin-transform-react-jsx-self',
        );
      }
      break;
    }

    case 'production': {
      break;
    }
  }

  if (react) {
    presets.push('@babel/preset-react');
    plugins.push('babel-plugin-typescript-to-proptypes');
  }

  return {
    babelrc: false,
    comments: false,
    ignore: [...IGNORE_PATHS],
    plugins,
    presets
  };
}

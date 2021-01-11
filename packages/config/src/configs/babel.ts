import { BabelConfig, BabelDriverArgs } from '@beemo/driver-babel';
import { BeemoProcess } from '../types';
import { IGNORE_PATHS, MIN_NODE_VERSION, MIN_IE_VERSION } from '../constants';


interface Args extends BabelDriverArgs {
  esm?: boolean
};

const { context, tool } = (process.beemo as unknown) as BeemoProcess<Args>;
const { node = false, react = false } = tool.config.settings;

const envOptions = {
  loose: true,
  modules: context.args.esm ? false : 'commonjs',
  shippedProposals: true,
  targets: node ? { node: tool.package?.engines?.node?.replace('>=', '') || MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
};

const presets: NonNullable<BabelConfig['presets']> = [['@babel/preset-env', envOptions], '@babel/typescript'];
const plugins: NonNullable<BabelConfig['plugins']> = [
  ['babel-plugin-transform-dev', { evaluate: false }],
];

switch (process.env.NODE_ENV) {
  case 'test': {
    break
  }

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

const config : BabelConfig = {
  babelrc: false,
  comments: false,
  ignore: [...IGNORE_PATHS],
  plugins,
  presets
};

export default config;

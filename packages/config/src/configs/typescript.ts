import { TypeScriptDriverArgs, TypeScriptConfig } from '@beemo/driver-typescript';
import { BeemoProcess } from '../types';

interface Args extends TypeScriptDriverArgs {
  sourceMaps?: boolean;
}

const { context, tool } = (process.beemo as unknown) as BeemoProcess<Args>;
const { decorators = false, node = false, react = false } = tool.config.settings;


const compilerOptions: TypeScriptConfig['compilerOptions'] = {
  allowJs: false,
  allowSyntheticDefaultImports: true,
  declaration: true,
  esModuleInterop: true,
  experimentalDecorators: decorators,
  forceConsistentCasingInFileNames: true,
  lib: ['esnext'],
  module: node ? 'commonjs' : 'esnext',
  noEmitOnError: true,
  noImplicitReturns: true,
  pretty: true,
  removeComments: false,
  resolveJsonModule: true,
  sourceMap: context.args.sourceMaps || false,
  strict: true,
  target: node ? 'es2018' : 'es2015',
  useDefineForClassFields: false,
  moduleResolution: 'node',
};

const include: string[] = ['./src/**/*', './types/**/*'];
const exclude: string[] = ['**/node_modules/*'];

if (react) {
  compilerOptions.lib!.push('dom');
  compilerOptions.jsx = 'react';
}

compilerOptions.outDir = 'lib';

const config : TypeScriptConfig = {
  compilerOptions,
  include,
  exclude
};

export default config;

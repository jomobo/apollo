import Beemo, { DriverContext, Path } from '@beemo/core';
import { CJS_FOLDER, ESM_FOLDER, DIR_PATTERN } from './constants';

function hasNoPositionalArgs(context: DriverContext, name: string): boolean {
  const args = context.args._;

  return args.length === 0 || (args.length === 1 && args[0] === name);
}

export default function apollo(tool: Beemo) {
  const usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
  const exts = usingTypeScript ? ['.ts', '.tsx', '.js', '.jsx'] : ['.js', '.jsx'];
  const workspacePrefixes = tool.getWorkspacePaths( { relative: true } );

  // Babel
  tool.onRunDriver.listen((context) => {
    if (!context.args.extensions) {
      context.addOption('--extensions', exts);
    }

    context.addOption('--copy-files');

    if (hasNoPositionalArgs(context, 'babel')) {
      context.addArg('src');
      context.addOption('--out-dir', context.args.esm ? ESM_FOLDER : CJS_FOLDER);
    }
  });

  tool.onRunDriver.listen((context) => {
    context.addOptions(['--color', '--fix']);
    context.addOption('--ext', exts);

    if (hasNoPositionalArgs(context, 'eslint')) {
      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach((wsPrefix) => {
          context.addArg(new Path(wsPrefix, DIR_PATTERN).path());
        });
      } else {
        context.addArgs(['src', 'tests']);
      }
    }

  }, 'eslint');
};

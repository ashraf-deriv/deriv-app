import path from 'path';
import fs from 'fs';
import { SourceMap } from 'module';
/* Using this loader you can import components from @deriv/components without having to manually
import the corresponding stylesheet. The deriv-account-loader will automatically import
stylesheets.

    import { PoaExpired } from '@deriv/account';
    ↓ ↓ ↓
    import PoaExpired from '@deriv/account/dist/js/poa-expired';
*/

function getKebabCase(str: string) {
    return str
        .split(/(?=[A-Z])/)
        .join('-')
        .toLowerCase();
}

function checkExists(component: string) {
    return fs.existsSync(path.resolve(__dirname, '../../../account/src/Components/', component, `${component}.scss`));
}

type Tthis = {
    callback: any;
};
module.exports = function (this: Tthis, source: string, map: SourceMap) {
    const lines = source.split(/\n/);
    const mapped_lines = lines.map(line => {
        const matches = /\s*import\s+\{(.*)\}\s*from\s+\'@deriv\/account/.exec(line); // eslint-disable-line no-useless-escape
        if (!matches || !matches[1]) {
            return line; // do nothing;
        }
        const components = matches[1]
            .replace(/\sas\s\w+/, '') // Remove aliasing from imports.
            .replace(/\s+/g, '')
            .split(',');
        const replace = components
            .map(
                c => `
                    import ${c} from '@deriv/account/dist/account/js/${getKebabCase(c)}';
                    ${
                        checkExists(getKebabCase(c))
                            ? `import '@deriv/account/dist/account/css/${getKebabCase(c)}.css';`
                            : ''
                    }
                `
            )
            .join('\n');

        return replace;
    });

    return this.callback(null, mapped_lines.join('\n'), map);
};

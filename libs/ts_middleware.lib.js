/* eslint-disable max-len */
/* eslint-disable no-console */
const { execSync } = require('child_process');

const path = require('path');
const fs = require('fs');

const getFiles = (source) => fs.readdirSync(source).map((name) => path.join(source, name)).filter((source) => path.extname(source) === '.ts');

module.exports = () => {
  async.each(getFiles('./ts'), (d, cb) => {
    if (process.env.NODE_ENV !== 'production') {
      execSync(
        `npx tsc ${d} --module system --esModuleInterop true --target es5 --lib es2015,dom --outFile public/js/${path.parse(d).name}.js && echo 'System.active();' >> public/js/${path.parse(d).name}.js`
      );
      execSync(`npx uglifyjs public/js/${path.parse(d).name}.js -o public/js/${path.parse(d).name}.js --compress --mangle -- `);
    }
    console.log(
      `npx tsc ${d} --module system --esModuleInterop true --target es5 --lib es2015,dom --outFile public/js/${path.parse(d).name}.js && echo 'System.active();' >> public/js/${path.parse(d).name}.js`
    );
    cb();
  }, () => {
    // clear();
    console.log('TS -> OK');
  });
};

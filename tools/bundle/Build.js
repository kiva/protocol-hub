const fs = require('fs-extra');
const config_file = process.argv[2];
const config = JSON.parse(fs.readFileSync(__dirname + '/../../' + config_file, 'utf8'));
const env = process.argv[3] || false;

if (env && config.hasOwnProperty('env') && config.env.hasOwnProperty(env)) {
    mergeEnvironments(config, env);
}

const constantBuilder = require(__dirname + '/ConstantBuilder').init(config, env);
const constants = constantBuilder.getVariables();

console.log(`Setting constants${env ? ` for ${env}` : ''}...`);
writeTo(__dirname + '/../../src/constants/variables.json', constants);
console.log(`Done!\n`);

function writeTo(path, data, noJson) {
    if (!noJson) {
        data = JSON.stringify(data);
    }

    fs.writeFileSync(path, data, {
        flag: 'w+'
    });
}

function mergeEnvironments(configEnv, env) {
    const conf = config.env[env];

    // Apply attributes from target `env` THAT HAVE NOT BEEN DEFINED IN CURRENT ENV into the target config
    // Priority is in index order i.e. if a config is defined at index 0 and 2, the value from index 0 will win
    if (conf.inherits) {
        inherit(conf.inherits, conf, configEnv);
        delete conf.inherits;
    }
}

function inherit(envArr, insertInto, conf) {
    while (envArr.length) {
        let frum = envArr.shift();
        for (let k in conf[frum]) {
            if (!insertInto.hasOwnProperty(k)) {
                insertInto[k] = conf[frum][k];
            }
        }
    }
}

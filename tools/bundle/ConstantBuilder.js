class ConstantBuilder {
    static init(conf, env) {
        return new ConstantBuilder(conf, env);
    }

    constructor(conf, env) {
        console.log('\nConstructing constants...\n');
        this.variables = this.populateVars(conf, env);
    }

    getVariables() {
        return this.variables;
    }

    populateVars(conf, env) {
        if (conf.hasOwnProperty('env')) {
            this.handleExits(conf, env);

            const envConf = conf.env[env];
            for (let eK in envConf) {
                conf[eK] = envConf[eK];
            }
            delete conf.env;
        } else if (env) {
            console.log('No env configurations were found - the configuration will be set as-is\n');
        }

        return conf;
    }

    handleExits(conf, env) {
        if (!env) {
            console.log("No environment definition was provided to the function, despite");
            console.log("the existence of environment-specific configurations in your config file");
            console.log("\nPlease re-run the script with your environment key specified\n");
            process.exit(99);
        }

        if (!conf.env.hasOwnProperty(env)) {
            console.log(`There was no ${env} key defined in the env object - please check your configuration\n`);
            process.exit(99);
        }
    }
}

module.exports = ConstantBuilder;

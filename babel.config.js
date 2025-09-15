module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        '@/components': './src/components',
                        './componentUpdater': './node_modules/react-native-calendars/src/componentUpdater.js',
                    },
                },
            ],
            [
                'module:react-native-dotenv',
                {
                    moduleName: '@env',
                    path: '.env',
                }
            ]
        ],
    };
};
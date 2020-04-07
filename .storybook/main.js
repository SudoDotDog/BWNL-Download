module.exports = {
    addons: [
        '@storybook/addon-actions/register',
        '@storybook/addon-knobs/register',
    ],
    stories: [
        '../stories/**/*.story.*',
    ],
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: require.resolve('ts-loader'),
                },
                {
                    loader: require.resolve('react-docgen-typescript-loader'),
                },
            ],
        });
        config.resolve.extensions.push('.ts', '.tsx');
        return config;
    },
};
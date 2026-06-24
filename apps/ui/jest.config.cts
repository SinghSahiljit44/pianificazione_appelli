module.exports = {
  displayName: '@org/ui',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    // gli import svgr `*.svg?react` non sono risolvibili da jest: usa uno stub
    '\\.svg(\\?react)?$': '<rootDir>/src/test-utils/svg-mock.tsx',
  },
  coverageDirectory: 'test-output/jest/coverage',
};

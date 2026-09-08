module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^.+\\.svg\\?react$': '<rootDir>/src/test/svgMock.tsx',
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(png|jpg|jpeg|gif|webp)$': '<rootDir>/src/test/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testMatch: ['**/?(*.)+(test).[tj]s?(x)'],
  transformIgnorePatterns: ['/node_modules/'],
}

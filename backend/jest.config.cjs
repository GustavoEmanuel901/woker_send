/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          target: 'es2020',
          transform: { legacyDecorator: true, decoratorMetadata: true }
        },
        module: { type: 'commonjs' }
      }
    ]
  },
  moduleNameMapper: {
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@usecases/(.*)$': '<rootDir>/src/usecases/$1',
    '^@providers/(.*)$': '<rootDir>/src/providers/$1'
  },
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/generated/**',
    '!src/@types/**',
    '!src/**/*DTO.ts',
    '!src/**/I[A-Z]*.ts'
  ],
  coverageThreshold: {
    global: { statements: 100, branches: 100, functions: 100, lines: 100 }
  }
}

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'feature', // New feature (alternative)
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style changes (formatting, etc.)
        'refactor', // Code refactoring
        'test', // Adding or modifying tests
        'chore', // Maintenance tasks
        'perf', // Performance improvements
        'optimize', // Performance improvements (alternative)
        'ci', // CI/CD changes
        'build', // Build system changes
        'revert', // Reverting changes
      ],
    ],
    'subject-case': [0], // Allow any case for subject
  },
}

# Contributing to AuryxSDK

We're excited that you're interested in contributing to AuryxSDK! This document outlines the process and guidelines for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/AuryxSDK.git
cd AuryxSDK
```

3. Install dependencies:
```bash
npm install
```

4. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

## Development Guidelines

- Follow the TypeScript guidelines
- Write tests for new features
- Update documentation as needed
- Follow the existing code style

## Commit Messages

Follow conventional commits:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if you're introducing new features
3. Add tests for new functionality
4. Ensure all tests pass and the build is successful
5. Link any relevant issues in your PR description

## Running Tests

```bash
npm test
```

## Code Style

We use ESLint and Prettier. Before submitting:

```bash
npm run lint
npm run format
```

## Questions?

Visit our [documentation](https://auryx.dev) for more information.
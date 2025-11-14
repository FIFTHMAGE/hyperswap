# Contributing to HyperSwap

Thank you for your interest in contributing to HyperSwap! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- Git
- A WalletConnect Project ID
- A Covalent API Key

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/hyperswap.git
   cd hyperswap
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

5. Add your API keys to `.env.local`

6. Start development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions or updates

### Making Changes

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes following our [coding standards](#coding-standards)

3. Test your changes:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/my-feature
   ```

6. Open a Pull Request

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define explicit types for all function parameters and return values
- Avoid using `any` type unless absolutely necessary
- Use branded types for IDs and addresses
- Document all public APIs with JSDoc comments

### React

- Use functional components with hooks
- Keep components under 500 lines of code
- Extract logic into custom hooks
- Use memo/useMemo/useCallback for performance optimization
- Follow the component structure:
  ```tsx
  // Imports
  import { ... } from '...';
  
  // Types/Interfaces
  interface MyComponentProps { ... }
  
  // Component
  const MyComponent: React.FC<MyComponentProps> = ({ ... }) => {
    // Hooks
    // Event handlers
    // Render
  };
  
  // Export
  export default MyComponent;
  ```

### Styling

- Use NativeWind for styling (NOT StyleSheet)
- Follow TailwindCSS utility-first approach
- Keep inline styles minimal
- Use design tokens from `src/config/theme.ts`

### File Organization

- Keep files under 500 lines
- One component per file
- Use barrel exports (`index.ts`) for clean imports
- Follow the layer-based architecture

### Code Quality

- Run linter before committing: `npm run lint`
- Run type checker: `npm run type-check`
- Format code: `npm run format`
- Pre-commit hooks will run automatically

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or updates
- `chore`: Build process or auxiliary tool changes
- `ci`: CI configuration changes

### Examples

```
feat(swap): add price impact warning

Add warning message when swap price impact exceeds 5%

Closes #123
```

```
fix(portfolio): correct balance calculation

Fixed issue where token balances were not summed correctly
across multiple chains

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update Documentation**: Update README or relevant docs if needed
2. **Add Tests**: Ensure new features have appropriate tests
3. **Run Tests**: All tests must pass
4. **Check Linter**: No linting errors
5. **Type Check**: No TypeScript errors
6. **Update Changelog**: Add entry to CHANGELOG.md (if applicable)

### PR Title

Follow the same format as commit messages:

```
feat(component): brief description
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code commented where necessary
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Dependent changes merged

## Screenshots (if applicable)
Add screenshots here

## Additional Notes
Any additional information
```

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Code review feedback addressed

## Testing

### Unit Tests

Test individual functions and components:

```bash
npm run test
```

### Integration Tests

Test component interactions:

```bash
npm run test:integration
```

### E2E Tests

Test complete user flows:

```bash
npm run test:e2e
```

### Coverage

Maintain >70% code coverage:

```bash
npm run test:coverage
```

## Documentation

### Code Comments

- Use JSDoc for public APIs
- Explain "why" not "what"
- Keep comments up to date

### Documentation Files

- README.md - Project overview
- ARCHITECTURE.md - Architecture details
- CONTRIBUTING.md - This file
- API.md - API documentation (if applicable)

### Component Documentation

Example:

```tsx
/**
 * Button component with multiple variants
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => { ... };
```

## Questions?

- Open an issue for bugs or feature requests
- Join our [Discord](https://discord.gg/hyperswap) for discussions
- Email: dev@hyperswap.io

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to HyperSwap! 🚀


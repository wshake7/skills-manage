# Spring Boot Codex Skill

## Overview
Spring Boot is a framework for building production-ready Java applications with minimal configuration. This repository (spring-projects/spring-boot) contains the core framework, auto-configuration, starters, and modules. Use this skill to efficiently contribute to the project, fix issues, or build extensions.

## Repository Structure
- **Directory layout**: Multi-module Gradle project. Key modules: `spring-boot` (bootstrap), `spring-boot-autoconfigure` (auto-config), `spring-boot-starters/` (starter POMs), `spring-boot-actuator` (monitoring), `spring-boot-devtools` (dev experience), `spring-boot-tools/` (build plugins), `spring-boot-test` (testing support).
- **Build system**: Gradle with wrapper (`gradlew`). No Maven usage. Root `settings.gradle` includes all subprojects.
- **CI**: GitHub Actions workflows in `.github/workflows/`.

## Build and Run
- **Build locally**: `./gradlew build` (skipping tests: `-x test`).
- **Specific module**: `./gradlew :spring-boot-autoconfigure:build`.
- **Run tests**: `./gradlew test` (or `:spring-boot-actuator:test`).
- **Format code**: `./gradlew format` (uses Spring Java Format).

## Development Workflow
1. **Fork and branch**: Fork the repo, create a feature/fix branch.
2. **Build before changes**: `./gradlew build` to ensure baseline.
3. **Make changes**: Follow code style (see below).
4. **Write tests**: Required for new features and bug fixes. Tests are in `src/test/java`, often using JUnit Jupiter and `@SpringBootTest`.
5. **Run checks**: `./gradlew check` runs tests, static analysis (Checkstyle, Spring Java Format).
6. **Commit**: Use semantic commits referencing issue numbers (`gh-1234`).
7. **Push and create PR**: Against `main` branch, with a clear description.

## Testing
- **Unit tests**: Typical location: `module/src/test/java/org/springframework/boot/...`.
- **Integration tests**: In `spring-boot-tests/` or dedicated `*-tests` modules.
- **Smoke tests**: `./gradlew :smoke-test:...` variants.
- **Use `./gradlew test -PtestGroups=...` for specific test groups**.

## Common Tasks
- **Adding a new auto-configuration**:
  1. Create the configuration class in `spring-boot-autoconfigure`.
  2. Register in `spring-boot-autoconfigure/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
  3. Add necessary condition annotations (`@ConditionalOnClass`, etc.).
  4. Write tests with `ApplicationContextRunner` (see `AutoConfigurationTests`).
- **Adding a new starter**:
  1. Add a module under `spring-boot-starters/` (e.g., `spring-boot-starter-foo`).
  2. Only a `pom.xml` (or Gradle equivalent) with dependencies. No Java code.
  3. Ensure the starter pulls in the auto-configuration module and required libraries.
- **Fixing a bug**:
  1. Locate relevant auto-configuration or core class.
  2. Write a test that reproduces the issue without the fix.
  3. Apply fix, verify test passes.
  4. Update `package-info.java` if API changes.

## Coding Guidelines
- **Code style**: Follow Spring Java Format (enforced by Checkstyle). Run `./gradlew format` before commit.
- **Imports**: No wildcard imports. Static imports for assertions and commonly used Spring classes.
- **Annotations**: Use `@Configuration(proxyBeanMethods = false)` for auto-configuration classes.
- **Javadoc**: Required for public APIs. Update `since` tags.
- **Avoid breaking changes**: Auto-configuration should be backward-compatible.

## Additional Tips
- **Debugging tests**: `./gradlew test --debug-jvm` (attach debugger to port 5005).
- **Use local SNAPSHOT**: `./gradlew publishToMavenLocal` to install locally for testing in other projects.
- **Find issues**: Search GitHub issues with labels `type: bug` or `type: enhancement`.
- **Stay updated**: `main` branch may have changes; rebase frequently.

## Resources
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Wiki](https://github.com/spring-projects/spring-boot/wiki)
- [Contributor guidelines](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc)

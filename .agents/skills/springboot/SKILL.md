# Spring Boot Repository Skill

This skill provides guidance for working with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository — the source code of the Spring Boot framework.

## Overview

Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications. This repository contains the core framework, auto-configuration, starters, test utilities, and tools.

## Repository Structure

Key directories:

- `spring-boot-project/spring-boot` – core module (SpringApplication, etc.)
- `spring-boot-project/spring-boot-autoconfigure` – auto-configuration support
- `spring-boot-project/spring-boot-starters` – POMs for starter dependencies
- `spring-boot-project/spring-boot-test` – test utilities (e.g., `@SpringBootTest`)
- `spring-boot-project/spring-boot-test-autoconfigure` – test auto-config
- `spring-boot-project/spring-boot-actuator` – production-ready features
- `spring-boot-project/spring-boot-actuator-autoconfigure` – actuator auto-config
- `spring-boot-project/spring-boot-devtools` – developer tools
- `spring-boot-project/spring-boot-docs` – reference documentation source
- `spring-boot-project/spring-boot-cli` – command-line tool
- `spring-boot-project/spring-boot-tools` – Maven/Gradle plugins, etc.
- `spring-boot-system-tests` – system/integration tests
- `buildSrc` – custom build logic (plugins, conventions)
- `ci/` – CI pipeline scripts
- `gradle/` – Gradle wrapper and configuration

## Build System

Gradle with Kotlin DSL. Use the wrapper:

```bash
./gradlew build           # full build (compile, test, checkstyle, javadoc)
./gradlew test             # run all tests
./gradlew :spring-boot-project:spring-boot:test  # module tests
./gradlew :spring-boot-project:spring-boot:checkstyleMain
./gradlew build -x test    # skip tests
```

Common tasks: `assemble`, `check`, `publishToMavenLocal`.

Formatting: Uses Spring Java Format plugin (`io.spring.javaformat`). Use `./gradlew format` to apply code formatting, `./gradlew checkFormat` to verify.

## Typical Development Workflow

1. Fork the repository on GitHub.
2. Clone your fork and create a feature/bugfix branch.
3. Make changes, add tests, and update documentation if needed.
4. Run formatting: `./gradlew format`
5. Build and test: `./gradlew build` (ensure all tests pass).
6. Commit following the [Spring Boot commit conventions](https://github.com/spring-projects/spring-boot/wiki/Commit-Conventions).
7. Push and create a pull request.
8. Verify CI checks (GitHub Actions, etc.).

## Key Concepts for Modification

### Auto-configuration

- Auto-configuration classes are annotated with `@AutoConfiguration` (in `spring-boot-autoconfigure` module).
- They are registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (not `spring.factories` for new auto-configuration).
- Use `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc., to control which beans are created.
- Testing: Use `ApplicationContextRunner` or `@SpringBootTest` to verify auto-configuration behavior.

### Adding a New Starter

- Add a new module under `spring-boot-project/spring-boot-starters` with a `build.gradle` that depends on necessary libraries.
- No source code; just a POM with dependencies.

### Adding a New Feature

- Implement in the appropriate module.
- If it requires auto-configuration, add a `@AutoConfiguration` class and register it.
- Add property support via `@ConfigurationProperties`.
- Update ref docs in `spring-boot-project/spring-boot-docs/src/main/antora/modules/ROOT/pages/`.

## Testing Guidelines

- Tests use JUnit 5, AssertJ, and Mockito.
- Integration tests often use `org.springframework.boot.testsupport` test utilities.
- Run full test suite before submitting; some tests require Docker (e.g., database tests). Use `./gradlew build` with Docker daemon running.

## Documentation

- Reference docs written in Asciidoc (Antora), source in `spring-boot-docs`.
- To build docs: `./gradlew :spring-boot-project:spring-boot-docs:asciidoctor`
- API docs (Javadoc) are generated as part of build.

## Code Conventions

- Follow Spring Java Format (auto-applied).
- Use `@Override`, diamond operator, final where appropriate.
- Logging via SLF4J, never `System.out`.
- Configuration keys in kebab-case.
- When working with the repository, always use the Gradle wrapper for consistent builds.

## Environment Set-Up

- Java 17 (or compatible JDK for the branch; main branch requires 17)
- Gradle 8.x, but the wrapper handles it.
- For IDE: Import as a Gradle project. Run `./gradlew eclipse` or `./gradlew idea` to generate project files.

## Additional Resources

- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Contributing Guide](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc)
- [Spring Boot GitHub Wiki](https://github.com/spring-projects/spring-boot/wiki)

Remember: When modifying the framework, compatibility, performance, and adherence to Spring ecosystem standards are critical.
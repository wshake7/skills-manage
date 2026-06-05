# Spring Boot Codex Skill

## Overview
This skill helps an AI coding agent work effectively with the Spring Boot repository (https://github.com/spring-projects/spring-boot). It covers repository structure, build system, key concepts, and contribution workflow.

## Repository Structure
The Spring Boot repository is a multi-module Gradle project. Key top-level directories:

- `spring-boot-project/` – Main source code, containing sub-modules like `spring-boot`, `spring-boot-autoconfigure`, `spring-boot-actuator`, `spring-boot-starters`, `spring-boot-test`, etc.
- `spring-boot-tools/` – Tools like the Maven/Gradle plugins and the `spring-boot-loader`.
- `spring-boot-samples/` – Example applications (may be deprecated in favor of external guides).
- `ci/` – CI configuration.
- `eclipse/`, `idea/` – IDE settings.
- `build.gradle`, `settings.gradle` – Root build files.

## Build System
- **Gradle** (with Kotlin DSL in some places). Use `./gradlew` wrapper.
- Common tasks: `build`, `test`, `publishToMavenLocal`, `check`.
- Modules are defined in `settings.gradle` using `include`.
- Dependency versions are managed via a `gradle.properties` or `versions.gradle`.

## Key Concepts for Contributing

### Auto-Configuration
- Auto-configuration classes are located in `spring-boot-autoconfigure`.
- They are organized by technology package (e.g., `org.springframework.boot.autoconfigure.jdbc`).
- Each auto-configuration is registered in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` or via `spring.factories` (older versions).
- Conditions: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc., used extensively.

### Starters
- Starters are empty jars with transitive dependencies defined in their `build.gradle` or `.pom`.
- Located in `spring-boot-starters/`.

### Configuration Properties
- `@ConfigurationProperties` classes map to structured properties (e.g., `ServerProperties`).
- Additional metadata for IDE autocompletion is generated from these classes.

## Development Workflow

### Adding a New Auto-Configuration
1. Identify the technology you want to auto-configure.
2. Create a new sub-module in `spring-boot-project/` (if significant) or add to `spring-boot-autoconfigure`.
3. Write the auto-configuration class(es) with appropriate `@Conditional` annotations.
4. Register the auto-configuration in `AutoConfiguration.imports` (not `spring.factories`).
5. If needed, add a corresponding starter module.
6. Write unit tests using `ApplicationContextRunner` or `WebApplicationContextRunner`.
7. Update documentation in `spring-boot-project/spring-boot-docs` and the reference guide.

### Testing
- Tests use JUnit 5 and AssertJ.
- Common test utilities:
  - `ApplicationContextRunner` – allows testing auto-configurations in isolation.
  - `OutputCapture` (JUnit 5 extension) to assert log output.
  - `TestPropertyValues` to apply properties.
- For integration tests, use `@SpringBootTest` with real dependencies.

### Debugging Tips
- To debug auto-configuration, enable debug logging: `--debug` or `logging.level.org.springframework.boot.autoconfigure=DEBUG`.
- View the auto-configuration report: `/actuator/conditions` or printed at startup with `--debug`.
- Use `ConditionEvaluationReport` to programmatically inspect conditions.

## Conventions
- Package root for the project: `org.springframework.boot`.
- Public API changes require careful consideration; often changes go through deprecation first.
- Follow Spring Framework coding style and checkstyle.
- License header must be present in all source files.

## Important Resources Within the Repository
- **Documentation** (AsciiDoc): `spring-boot-project/spring-boot-docs/src/main/asciidoc/`.
- **Reference Configuration Properties**: `spring-boot-project/spring-boot-docs/src/main/asciidoc/appendix/`.
- **Samples**: `spring-boot-samples/` (may be moved to external repositories).
- **Tests for auto-configuration**: `spring-boot-project/spring-boot-autoconfigure/src/test/`.

## Quick Commands for Development
- Build everything: `./gradlew build`
- Run tests for a specific module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Check code style: `./gradlew checkstyleMain checkstyleTest`
- Publish locally (for testing downstream): `./gradlew publishToMavenLocal`

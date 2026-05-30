# Spring Boot Repository Skill

This skill provides guidance for working with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) codebase. It covers structure, build system, common tasks, and tips for contributing to Spring Boot itself.

## Overview

Spring Boot makes it easy to create stand-alone, production-grade Spring-based Applications. This repository contains the framework source, auto-configuration modules, actuators, tools, and samples.

## Repository Structure

- `spring-boot-project/` - Core modules:
  - `spring-boot` - Main library (SpringApplication, etc.)
  - `spring-boot-autoconfigure` - Auto-configuration classes (`@AutoConfiguration`)
  - `spring-boot-actuator` / `spring-boot-actuator-autoconfigure` - Production-ready features
  - `spring-boot-dependencies` - Bill of Materials (BOM) managing dependency versions
  - `spring-boot-starters` - Starter POMs
  - `spring-boot-test` / `spring-boot-test-autoconfigure` - Testing utilities
  - `spring-boot-docs` - Reference documentation (Asciidoctor)
- `spring-boot-tools/` - Build tooling (Maven/Gradle plugins, Antlib)
- `spring-boot-samples/` - Example applications (many deprecated/removed in recent versions; check current state)
- `spring-boot-integration-tests/` - Integration tests requiring external services or containers
- `ci/` - CI pipeline scripts
- `gradle/` - Gradle wrapper and configuration

## Build System

- **Build tool**: Gradle with Kotlin DSL (`build.gradle.kts`)
- **Wrapper**: `./gradlew` (Unix) / `gradlew.bat` (Windows)
- **Java version**: Java 17 required (check `java` in `.sdkmanrc`)

**Common commands**:
```bash
# Full build (compile, test, checkstyle, docs)
./gradlew build

# Build without tests
./gradlew assemble

# Run all tests
./gradlew test

# Run tests for a specific module
./gradlew :spring-boot-project:spring-boot:test

# Run integration tests (suffix 'IntegrationTest')
./gradlew integrationTest

# Build the documentation
./gradlew :spring-boot-project:spring-boot-docs:asciidoctor

# Refresh the Gradle wrapper if needed
./gradlew wrapper --gradle-version <version>
```

## Development Workflow

### 1. Finding Code

- **Auto-configuration**: Look in `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`. Each domain (e.g., `jdbc`, `web`) has a package. Auto-configuration classes are registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (not `spring.factories` for newer Boot versions).
- **Actuators**: Endpoints in `spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/`. Health indicators, metrics, etc.
- **Condition annotations**: Shared conditional annotations (`@ConditionalOnClass`, `@ConditionalOnBean`) in `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/condition/`.

### 2. Testing

- **Test framework**: JUnit Jupiter (JUnit 5) with AssertJ and Mockito.
- **Test slices** (`@WebMvcTest`, `@DataJpaTest`, etc.) are defined in `spring-boot-test-autoconfigure`.
- **Application context tests** often use `SpringBootTest`.
- **Integration tests**: In `spring-boot-project/*/src/integrationTest/` or in `spring-boot-integration-tests/` (separate module).
- **Running a single test**: Use Gradle `--tests` filter.
  ```bash
  ./gradlew :spring-boot-project:spring-boot:test --tests "org.springframework.boot.SpringApplicationTests"
  ```

### 3. Code Style

- The project uses Checkstyle. Run `./gradlew checkstyleMain checkstyleTest` to validate.
- Follow the existing code patterns: fields, constructor injection via `@Autowired` or single-constructor implicit injection.
- Use `@Deprecated` with documentation when removing features.

### 4. Building Samples

- Samples reside under `spring-boot-samples/`. Each sample is a standalone project.
- Run a sample using:
  ```bash
  ./gradlew :spring-boot-samples:spring-boot-sample-tomcat:bootRun
  ```
  (adjust module path)

### 5. Contributing

- Before submitting a pull request, ensure all tests pass and new tests are added.
- Adhere to the [Contributor License Agreement](https://cla.pivotal.io/) (Spring CLA).
- For larger changes, open an issue first for discussion.

## Key Files

- `gradle.properties` - Gradle properties (e.g., `javaVersion`, `springBootVersion`)
- `build.gradle.kts` - Root build script defining common configurations and modules.
- `ci/scripts/common.sh` - CI environment setup.
- `RELEASING.adoc` - Release instructions.
- `SUPPORT.adoc` - Support policies.

## Tips for AI Agents

- When asked to implement a new auto-configuration, refer to existing examples in `spring-boot-autoconfigure`. Use `@AutoConfiguration` and register in the imports file.
- When updating a starter, check `spring-boot-dependencies/build.gradle.kts` for version management.
- For documentation changes, edit `.adoc` files in `spring-boot-docs/src/main/asciidoc/`.
- If a test fails with an application context startup error, examine loaded auto-configuration classes using `debug=true` or check the condition evaluation report.
- Use `./gradlew dependencies --configuration <config>` to inspect dependency trees.

Remember: Spring Boot is a large, mature project. Focus changes on one module, run related tests, and ensure backward compatibility unless a major version change is intended.
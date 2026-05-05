# Spring Boot Development Skill

## Overview
Spring Boot is a framework for building production-ready Spring applications with minimal configuration. This repository contains the Spring Boot source code, tests, documentation, and build tooling.

## Repository Structure

- **spring-boot-project/** – Core framework modules:
  - `spring-boot` – Main library (auto-configuration, CLI, Actuator, etc.)
  - `spring-boot-autoconfigure` – Auto-configuration for many technologies
  - `spring-boot-actuator` – Production-ready features (health, metrics)
  - `spring-boot-devtools` – Developer tools (live reload, restart)
  - `spring-boot-test` – Test utilities and annotations
  - `spring-boot-starters` – Starter POMs
- **spring-boot-tests/** – Deployment and integration tests (deployment tests, smoke tests, test slices).
- **build.gradle** – Root Gradle build script; each module has its own `spring-boot-project/*/build.gradle`.
- **gradle/** – Gradle wrapper and custom plugins.
- **ci/** – CI pipeline scripts (GitHub Actions, Concourse).
- **src/** – Contains API and reference documentation as Asciidoctor.

## Build & Test

- **Build tool:** Gradle (wrapper provided via `gradlew`).
- **Java version:** The project requires a JDK that matches the branch (check `javaVersion` in `gradle.properties`).
- **Common tasks:**
  - Full build (without tests): `./gradlew build -x test`
  - Run all tests: `./gradlew test`
  - Build a specific module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:build`
  - Generate documentation: `./gradlew asciidoctor`
  - Run deployment tests: `./gradlew :spring-boot-tests:spring-boot-deployment-tests:test`
- Test categories:
  - Unit tests: inside each module under `src/test`.
  - Integration tests: typically in separate `*Tests` classes or under `integration-test` source set.
  - Smoke tests: located in `spring-boot-tests/` (e.g., `spring-boot-smoke-tests/spring-boot-smoke-test-web`).

## Contribution Workflow

1. **Fork and clone** the repository.
2. **Create a branch** for your changes.
3. **Make changes** following Spring Boot’s coding conventions (see below).
4. **Run tests** locally:
   - Validate your changes by running `./gradlew build` for the affected modules.
   - Use `./gradlew check` for code style (Checkstyle) and static analysis.
5. **Commit** with a descriptive message referencing an issue if applicable.
6. **Push** and create a **Pull Request** (PR) against the `main` branch.
7. **Sign the contributor license agreement** (CLA) if it’s your first contribution.
8. **Respond to PR review** comments; CI will run automatically.

### Coding Conventions
- Follow the [Spring Framework Code Style](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Code-Style).
- Use 4 spaces for indentation (no tabs).
- Method names are lowercaseCamelCase, constants UPPER_SNAKE_CASE.
- Favor javadoc on public and protected APIs.
- Write regression tests for bug fixes and new features.

## Development Environment Setup

1. **Prerequisites:**
   - JDK 17 or later (verify `javaVersion` in `gradle.properties`).
   - Git.
2. **Clone the repository:**
   ```bash
   git clone https://github.com/spring-projects/spring-boot.git
   cd spring-boot
   ```
3. **Build and import into IDE:**
   - Run `./gradlew eclipse` or `./gradlew idea` to generate IDE project files.
   - Alternatively, import as a Gradle project directly.
4. **Use Gradle wrapper** (`./gradlew`) for all tasks.

## Common Patterns

- **Auto-configuration:** Classes annotated with `@Configuration` and conditionally enabled via `@ConditionalOn...` annotations. Registered in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
- **Configuration properties:** Use `@ConfigurationProperties` with nested POJOs, documented with additional metadata in `additional-spring-configuration-metadata.json`.
- **Starters:** A simple POM that pulls in necessary dependencies; typically named `spring-boot-starter-*`.

## Debugging & Troubleshooting

- Enable debug logging: add `--debug` to the JVM or set `logging.level.root=DEBUG` in `application.properties`.
- Run a single test class or method:
  ```bash
  ./gradlew :spring-boot-project:spring-boot:test --tests 'org.springframework.boot.SampleTest'
  ```
- Investigate auto-configuration report: run with `--debug` and check the `Conditions evaluation report` output.

## Additional Resources

- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/)
- [Issue Tracker (GitHub Issues)](https://github.com/spring-projects/spring-boot/issues)
- [Contributor Guidelines](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc)

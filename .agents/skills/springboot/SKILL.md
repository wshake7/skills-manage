# Spring Boot Repository Skill

## Overview
Spring Boot is a framework for building production-ready Spring applications with minimal configuration. This repository contains the core source code, tests, and documentation.

## Repository Structure
- `spring-boot-project/` – Main project modules:
  - `spring-boot/` – Core runtime, SpringApplication, etc.
  - `spring-boot-autoconfigure/` – Auto-configuration classes.
  - `spring-boot-starters/` – POM-oriented starter modules.
  - `spring-boot-actuator/` – Production-ready features (health, metrics).
  - `spring-boot-tools/` – Maven/plugin tools.
  - `spring-boot-test/` – Test utilities.
  - `spring-boot-cli/` – Command-line interface.
  - `spring-boot-docs/` – Reference documentation source.
- `spring-boot-tests/` – Integration and deployment tests.
- `spring-boot-system-tests/` – System-level tests.
- `ci/` – CI scripts and configuration.

## Build System
- **Gradle** with the wrapper (`gradlew`).
- Key commands:
  - `./gradlew build` – Full build including tests.
  - `./gradlew assemble` – Compile and create artifacts (skip tests).
  - `./gradlew test` – Run all tests.
  - `./gradlew <module>:test` – Run tests for a specific module (e.g., `:spring-boot-project:spring-boot:test`).
  - `./gradlew publishToMavenLocal` – Publish snapshots to local Maven repo.
- Build properties: `-x test` to skip tests, `--parallel` for parallel execution.

## Development Environment
- Java 17+ required (project uses JDK 17 baseline).
- Import as Gradle project in IntelliJ IDEA / Eclipse.
- Code formatting: Follows Spring Framework conventions (see `CONTRIBUTING.adoc`). No strict formatter enforced, but consistent style.
- Run `./gradlew format` to auto-format code if available.

## Testing
- Unit tests are in the same `src/test/java` as production sources.
- Use `@SpringBootTest` or `@WebMvcTest` for integration tests.
- System tests require a Docker environment for some scenarios.
- Skip failing tests with `-PignoreTestFailures` or exclude specific tests.

## Key Modules & Entry Points
- **spring-boot**: `SpringApplication` class – main entry point.
- **spring-boot-autoconfigure**: Auto-configuration classes (e.g., `DataSourceAutoConfiguration`).
- **spring-boot-starter-web**: Starter for REST APIs.
- **spring-boot-actuator**: Endpoints like `/health`, `/info`.
- **spring-boot-test**: `@SpringBootTest`, `TestRestTemplate`, etc.

## Contribution Guidelines
- See `CONTRIBUTING.adoc` in the repo root.
- Issues: Use GitHub issues with a clear title and description.
- Pull Requests: Open a PR against `main` branch, sign the contributor agreement, include tests.
- Backport policy: typically only for critical bug fixes.

## Common Workflows
### Building from Source
```bash
git clone https://github.com/spring-projects/spring-boot.git
cd spring-boot
./gradlew build
```

### Running a Specific Module’s Tests
```bash
./gradlew :spring-boot-project:spring-boot-autoconfigure:test
```

### Debugging a Test
Use `--tests` filter:
```bash
./gradlew :spring-boot-project:spring-boot:test --tests 'org.springframework.boot.SpringApplicationTests'
```

### Updating Dependencies
- `./gradlew dependencyUpdates` to see available upgrades.

## Important Notes
- Spring Boot depends on Spring Framework (version mapped in `gradle.properties`).
- Check `build.gradle` for current versions and custom plugins.
- If the project doesn’t compile, ensure you have the correct JDK and required native libraries.

## Resources
- Official docs: https://docs.spring.io/spring-boot/docs/current/reference/
- Sample applications: `spring-boot-samples/` directory (if present).
- CI configuration: `.github/workflows/` and `ci/`.

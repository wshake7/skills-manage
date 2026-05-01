# Spring Boot Development Guide

This skill helps you navigate the Spring Boot codebase to build, test, and contribute.

## Repository Structure
- `spring-boot-project/`: Main framework code (core, autoconfigure, starters, actuator, etc.)
- `spring-boot-tests/`: Integration and deployment tests.
- `spring-boot-samples/`: Example applications demonstrating features.
- `spring-boot-system-tests/`: System-level tests.
- `buildSrc/`: Custom Gradle plugins and conventions.
- `ci/`: CI pipeline scripts.
- `gradle/`: Wrapper and configuration.

## Build System
- Uses Gradle with the [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html).
- Java version: JDK 17 or later is required.
- Important Gradle properties in `gradle.properties`:
  - `artifactory.username` / `artifactory.password` for publishing (CI).
- Dependency management via `spring-boot-dependencies` BOM.

## Common Tasks

### Full Build (compile, test, check)
```bash
./gradlew build
```

### Build a specific module
```bash
./gradlew :spring-boot-project:spring-boot:build
```

### Run tests
- Unit tests: `./gradlew test`
- Integration tests (may require Docker for Testcontainers):
  ```bash
  ./gradlew test -PintegrationTest
  ```
  Skip Spring snapshot repositories by adding `-PskipSnapshotRepositories`.

### Code Formatting
- Uses [Spring Java Format](https://github.com/spring-io/spring-javaformat) via a Gradle plugin.
- Check formatting: `./gradlew formatCheck`
- Apply formatting: `./gradlew format`

### Generate Documentation
- Asciidoctor-based documentation under `spring-boot-project/spring-boot-docs/`.
- Build docs:
  ```bash
  ./gradlew asciidoctor
  ```
- Output in `spring-boot-project/spring-boot-docs/build/docs/asciidoc/`.

### Contribute
- Follow [contributor guidelines](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc).
- Sign the Contributor License Agreement (CLA).
- Ensure code passes `./gradlew build` and formatting checks.

## Key Concepts
- **Auto-configuration**: Dynamic configuration based on classpath and properties.
- **Starters**: Dependency descriptors (e.g., `spring-boot-starter-web`) bringing in curated sets of libraries.
- **Actuator**: Production-ready endpoints for monitoring and management.
- **SpringApplication**: Main class to bootstrap the application.

## Debugging Tips
- When running an application from the source, use `:spring-boot-project:spring-boot-tools:spring-boot-maven-plugin` for Maven integration.
- Test failures: check for missing Docker or environment settings for integration tests.
- If the build fails due to snapshot repositories, add `-PskipSnapshotRepositories` to avoid Spring snapshot dependencies.

## Module Path Examples
- Core: `:spring-boot-project:spring-boot`
- Auto-configuration: `:spring-boot-project:spring-boot-autoconfigure`
- Starter Web: `:spring-boot-project:spring-boot-starters:spring-boot-starter-web`
- Actuator: `:spring-boot-project:spring-boot-actuator`
- Test: `:spring-boot-project:spring-boot-test`

## Useful Gradle Options
- `--scan`: publish a build scan for insights.
- `--parallel`: enable parallel execution.
- `--no-daemon`: run without the Gradle daemon.
- `-x test`: skip tests.

# Spring Boot Development Skill

## Overview
Spring Boot is a convention-over-configuration framework for building stand-alone, production-grade Spring applications. The repository is a large multi-module Gradle project providing the core framework, autoconfiguration, starters, actuators, CLI, and developer tools.

## Repository Structure
```
spring-boot-project/   - Main source modules
  spring-boot/                 - Core runtime
  spring-boot-actuator/        - Production-ready features
  spring-boot-autoconfigure/   - Auto-configuration support
  spring-boot-cli/             - Command-line tool
  spring-boot-dependencies/    - Managed dependency versions
  spring-boot-devtools/        - Developer tools (hot restart)
  spring-boot-starters/        - Starter POMs
  spring-boot-test/            - Testing utilities
  spring-boot-tools/           - Build plugins
spring-boot-tests/     - Integration tests
spring-boot-system-tests/
spring-boot-integration-tests/
samples/               - Example applications
```

## Build & Test Commands
- Build everything: `./gradlew build`
- Build a specific module: `./gradlew :spring-boot-project:spring-boot:build`
- Run all tests: `./gradlew test`
- Run tests for a module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Run a single test class: `./gradlew :spring-boot-project:spring-boot:test --tests MyTest`
- Skip tests temporarily: `./gradlew build -x test`

## Common Development Workflows

### 1. Modifying an existing starter or auto-configuration
- Edit the relevant module (e.g., `spring-boot-project/spring-boot-autoconfigure`).
- Update `spring-boot-project/spring-boot-dependencies` if dependency versions change.
- Build the module and verify with existing tests.
- Run integration tests: `./gradlew :spring-boot-tests:spring-boot-integration-tests:test`

### 2. Adding a new auto-configuration class
- Create the class in `spring-boot-autoconfigure` under appropriate package.
- Annotate with `@AutoConfiguration` and `@ConditionalOn...` as needed.
- Register in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3.x+).
- Add corresponding tests in the module’s test tree.

### 3. Developing a new sample application
- Add a new directory under `samples/`.
- Include a `build.gradle` (or `build.gradle.kts`) with Spring Boot plugin.
- Write the application code and tests.
- Verify the sample builds and runs with `./gradlew :samples:YOUR_SAMPLE:build`.

### 4. Debugging
- Increase logging: `--debug` flag when running samples or tests.
- Enable devtools: add `spring-boot-devtools` dependency and use `./gradlew :samples:YOUR_SAMPLE:bootRun`.
- Remote debug: set `JAVA_TOOL_OPTIONS="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"` before running.

## Key Modules at a Glance
- **spring-boot**: Core `SpringApplication`, `SpringBootServletInitializer`, environment, banner, etc.
- **spring-boot-autoconfigure**: Huge set of `@AutoConfiguration` classes for external libraries.
- **spring-boot-actuator**: Health, metrics, endpoints.
- **spring-boot-starters**: Each member defines a curated set of dependencies for a technology (web, data-jpa, etc.).
- **spring-boot-dependencies**: POM controlling version alignment (Bill of Materials).
- **spring-boot-devtools**: Fast application restarts, LiveReload, etc.
- **spring-boot-cli**: Command-line interface using Groovy scripts.

## Code Style
- Java 17+ language features allowed (records, sealed classes, text blocks).
- Indentation: tabs (?) – check `.editorconfig`. Typically 1 tab per indent.
- Follow existing patterns for `@Test` and test class naming (`*Tests`).
- Use static imports for common utilities (e.g., `AssertJ`).
- Avoid wildcard imports; `checkstyle` and `spring-javaformat` enforce consistency.

## Useful Gradle Tasks
- `./gradlew buildSrc:build` – Build the custom Gradle plugins used by the project.
- `./gradlew javadoc` – Generate aggregated Javadoc.
- `./gradlew asciidoctor` – Build reference documentation (`./build/asciidoc/`).
- `./gradlew checkFormat` – Verify source formatting.
- `./gradlew format` – Automatically fix formatting violations.

## Running Samples
- Go to any sample (e.g., `samples/web`) and run:
  - Unix: `./gradlew bootRun`
  - Windows: `gradlew.bat bootRun`
- For samples that require a specific profile, use `--args='--spring.profiles.active=dev'`.

## Troubleshooting
- If the build fails with “Could not find…”, ensure you are using the correct Java version (check `build.gradle` for `sourceCompatibility`).
- For IDE import issues, regenerate Eclipse/IDEA metadata: `./gradlew eclipse` or `./gradlew idea`.
- Clean everything: `./gradlew clean`.
- If tests fail due to platform or environment, check `src/test/resources/application.properties` for overrides.

## Contributing
Refer to `CONTRIBUTING.adoc` in the repository root. The project requires a signed contributor agreement. Before submitting a pull request, ensure all tests pass, new tests are added, and the code is formatted (`./gradlew format`).

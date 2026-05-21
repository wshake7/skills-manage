# Spring Boot Skill

## Overview
Spring Boot is a framework for creating stand-alone, production-grade Spring applications with minimal configuration. This repository contains the complete source code for the Spring Boot project.

## Repository Structure
- `buildSrc/` - Gradle build logic shared across the project.
- `spring-boot-project/` - Core source code, organized into submodules:
  - `spring-boot/` - Main API and runtime support (environment, binders, etc.).
  - `spring-boot-autoconfigure/` - Auto-configuration support and condition annotations.
  - `spring-boot-actuator/` - Production-ready monitoring and management.
  - `spring-boot-actuator-autoconfigure/` - Auto-configuration for Actuator.
  - `spring-boot-devtools/` - Development tools (automatic restart, live reload).
  - `spring-boot-docs/` - Reference documentation (Asciidoctor).
  - `spring-boot-loader/` - Custom launcher used for executable JARs/WARs.
  - `spring-boot-starters/` - Starter POMs for dependency management.
  - `spring-boot-test/` - Test utilities and annotations (e.g., `@SpringBootTest`).
  - `spring-boot-test-autoconfigure/` - Auto-configuration for tests.
- `spring-boot-tests/` - Integration and smoke tests.
- `spring-boot-cli/` - Command-line interface (if present).
- `spring-boot-samples/` - Deprecated sample applications (now in tests).

## Development Workflow
1. **Fork and clone** the repository.
2. **Build** the entire project to ensure everything compiles:
   ```bash
   ./gradlew build
   ```
3. **Import** into your IDE (Eclipse/IntelliJ) using the provided Gradle build; enable annotation processing for Lombok (if used) and Spring configuration processor.
4. **Make changes** in a feature branch.
5. **Run tests** for the module you modified:
   ```bash
   ./gradlew :spring-boot-project:spring-boot-autoconfigure:test
   ```
6. **Check formatting** - the project enforces code style via Checkstyle and Spring Java Format; run `./gradlew format` to apply.
7. **Submit a pull request** after ensuring tests pass and documentation is updated (if needed).

## Building and Testing
- **Full build with tests:** `./gradlew build`
- **Build skipping tests:** `./gradlew build -x test`
- **Run all tests:** `./gradlew test`
- **Run a specific module's tests:** `./gradlew :spring-boot-project:spring-boot:test`
- **Build documentation:** `./gradlew :spring-boot-project:spring-boot-docs:asciidoctor`
- **Run integration tests** (smoke tests): navigate to `spring-boot-tests/spring-boot-smoke-tests/` and run `./gradlew -p <sample-dir> build`.
- **Generate a Spring Boot distribution:** `./gradlew distZip` (output in `build/distributions`).

## Key Modules and Where to Find Things
- **Auto-configuration classes:** `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`. Look for `*AutoConfiguration` classes.
- **Condition annotations:** `@ConditionalOnClass`, `@ConditionalOnBean`, etc. are in `spring-boot-autoconfigure` under `.../autoconfigure/condition/`.
- **Property metadata:** Auto-configuration relies on `spring-boot-autoconfigure-processor` and `spring-boot-configuration-processor` for IDE metadata.
- **Starter definitions:** `spring-boot-project/spring-boot-starters/` contains POM files only; they pull in necessary dependencies.
- **Actuator endpoints:** `spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/`.
- **Failure analysis:** `spring-boot-project/spring-boot/src/main/java/org/springframework/boot/diagnostics/`.
- **Testing support:** `spring-boot-project/spring-boot-test/src/main/java/org/springframework/boot/test/context/` contains annotations like `@SpringBootTest`.

## Useful Commands
- `./gradlew dependencies` – view dependency tree.
- `./gradlew <module>:test --tests <TestClass>` – run a single test.
- `./gradlew -p spring-boot-tests/spring-boot-smoke-tests/spring-boot-smoke-test-web-reactive build` – build a specific smoke test.
- `./gradlew build -Pfast` – skip slow tests (if defined).

## Contributing
- Follow the [CONTRIBUTING.md](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc) guidelines.
- Sign the Contributor License Agreement (CLA).
- Use imperative commit messages, reference issues, and include tests.
- Ensure all existing tests pass before submitting.

## Additional Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/)
- [Issue Tracker](https://github.com/spring-projects/spring-boot/issues)
- [Spring Boot GitHub](https://github.com/spring-projects/spring-boot)
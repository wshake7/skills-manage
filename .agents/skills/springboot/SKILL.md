# Spring Boot Repository Skill

## Overview
This skill provides guidance for working effectively with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository—the source code of Spring Boot, the popular Java framework for building stand-alone, production-grade Spring applications. It covers project structure, build system, testing, code style, and contribution workflow.

## Project Structure
The repository is a multi-module Gradle project with the following key directories:

- `spring-boot-project/` – Core framework modules
  - `spring-boot/` – Main library (auto-configuration, starters, etc.)
  - `spring-boot-autoconfigure/` – Auto-configuration classes
  - `spring-boot-starters/` – Starter POMs
  - `spring-boot-actuator/` – Production-ready features
  - `spring-boot-actuator-autoconfigure/` – Auto-configuration for Actuator
  - `spring-boot-devtools/` – Developer tools
  - `spring-boot-docs/` – Reference documentation
  - `spring-boot-test/` – Test utilities
  - `spring-boot-test-autoconfigure/` – Test auto-configuration
- `spring-boot-tools/` – Build plugins and tools (Maven/Gradle plugins)
- `spring-boot-bom/` – Bill of Materials
- `spring-boot-parent/` – Parent POM for Spring Boot projects
- `spring-boot-starters/` – Bundled starters (in its own directory)
- `spring-boot-dependencies/` – Dependency management
- `spring-boot-tests/` – Integration and smoke tests

The main build configuration files are `build.gradle` (root) and `settings.gradle`. Each sub-module has its own `build.gradle`.

## Build Commands
All commands are executed from the repository root using the Gradle wrapper (`./gradlew` on Linux/macOS, `gradlew.bat` on Windows).

- **Clean build** (without tests): `./gradlew clean build -x test`
- **Full build with tests**: `./gradlew build`
- **Run only tests**: `./gradlew test`
- **Build a specific module**: `./gradlew :spring-boot-project:spring-boot:build`
- **Generate documentation**: `./gradlew :spring-boot-project:spring-boot-docs:asciidoctor`
- **List all tasks**: `./gradlew tasks`

## Testing
Tests are written with **JUnit 5** and **AssertJ**. Test classes are located under `src/test/java/` in each module. Integration tests reside in `spring-boot-tests/`. To run tests for a single class, use Gradle’s `--tests` filter:
```bash
./gradlew :module-name:test --tests com.example.FooTest
```

## Code Formatting
Spring Boot uses **Checkstyle** for code style enforcement and **Spring Java Format** for consistent formatting. Before committing, ensure:
- Run formatting: `./gradlew format`
- Verify no Checkstyle violations: `./gradlew checkstyleMain checkstyleTest`

The IDE configuration for Eclipse/IntelliJ is available under `eclipse/` and `idea/` directories (use `./gradlew cleanEclipse eclipse` or `./gradlew idea`).

## Contribution Workflow
1. **Fork** the repository and create a feature branch from `main`.
2. Make changes following the [contributor guidelines](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc).
3. Ensure new modules or significant changes are accompanied by appropriate tests.
4. Build and test with `./gradlew build`.
5. Format code with `./gradlew format` and check Checkstyle.
6. Update documentation in `spring-boot-docs/` if necessary.
7. Commit with a descriptive message and submit a pull request.

## Dependency Management
Spring Boot manages a curated set of dependencies in `spring-boot-dependencies/`. To add or update a dependency, edit the respective `.gradle` file there. The Bill of Materials (BOM) is published from `spring-boot-project/spring-boot-bom`.

## Useful Gradle Tasks
- `dependencyManagement` – prints the dependency management configuration
- `generatePomFileForMavenPublication` – generates Maven POMs for publication
- `publishToMavenLocal` – publishes artifacts to local Maven repository

## Notes for AI Coding Agents
- Always run formatting (`./gradlew format`) after Java changes.
- Do not hardcode version numbers; manage them through `spring-boot-dependencies/`.
- Check for existing auto-configuration before adding new `@Configuration` classes.
- When fixing issues, refer to the [issue tracker](https://github.com/spring-projects/spring-boot/issues) and any linked pull requests.
- The official build uses Java 17. Ensure your local JDK matches the required version.

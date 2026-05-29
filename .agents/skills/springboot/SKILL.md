# Spring Boot Skill

This skill provides essential guidance for AI coding agents working with the Spring Boot repository (https://github.com/spring-projects/spring-boot).

## Overview
Spring Boot helps you create stand-alone, production-grade Spring-based applications with minimal configuration. The repository contains the framework source code, samples, documentation, and build tools.

## Project Structure
- `spring-boot-project/`: Main source code modules (e.g., `spring-boot`, `spring-boot-autoconfigure`, `spring-boot-actuator`, `spring-boot-starters`).
- `spring-boot-tests/`: Integration and deployment tests.
- `spring-boot-samples/`: Sample applications demonstrating features.
- `spring-boot-docs/`: Asciidoctor documentation sources.
- `buildSrc/`, `gradle/`: Build infrastructure.
- `settings.gradle`, `build.gradle`: Top-level Gradle configuration.

## Build System
- Uses Gradle with the `gradlew` wrapper. No Maven support for the main build.
- Java 17 required to build. Check `JAVA_HOME` points to JDK 17.
- Core build tasks: `./gradlew build` (compiles, tests, checks), `./gradlew test` (runs tests), `./gradlew assemble` (produces jars), `./gradlew publishToMavenLocal` (local install).

## Development Workflow
1. **Clone & Setup**: `git clone ...`, run `./gradlew` to download dependencies.
2. **Importing into IDE**: Project can be imported as an existing Gradle project in IntelliJ IDEA or Eclipse. Enable annotation processors for `spring-boot-autoconfigure` to generate metadata.
3. **Making Changes**: Follow [Spring Framework coding conventions](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Code-Style). Use Java 17 features where appropriate.
4. **Running a Sample**: `./gradlew :spring-boot-samples:spring-boot-sample-<name>:bootRun`.
5. **Generating Documentation**: `./gradlew :spring-boot-docs:asciidoctor` outputs HTML in `build/docs/`.

## Common Tasks
- **Add a new auto-configuration**: Create class in `spring-boot-autoconfigure` module, use `@AutoConfiguration`, add `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` entry.
- **Update starters**: Modify `spring-boot-starters` module’s dependency management.
- **Change API**: Ensure compatibility; consider deprecating first.
- **Build a snapshot**: Use `./gradlew build` then `./gradlew publishToMavenLocal`.

## Testing
- Tests are categorized: unit, integration (using `@SpringBootTest`), and deployment tests (`spring-boot-tests`).
- Run a single test: `./gradlew :spring-boot-project:spring-boot:test --tests "org.springframework.boot.SampleTest"`
- Test coverage via JaCoCo: `./gradlew test jacocoTestReport` (reports in `build/reports/jacoco`).
- Ensure `@OverrideAutoConfigurationEnabled` is used where needed.

## Contribution Guidelines
- Branch from `main`, open pull request against `main`.
- Sign the [Contributor License Agreement (CLA)](https://cla.pivotal.io).
- Add tests for changes, update docs if public API affected.
- CI uses GitHub Actions; check status before asking for review.
- See `CONTRIBUTING.adoc` in repo for full details.

## Additional Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Spring Boot GitHub Repo](https://github.com/spring-projects/spring-boot)
- [Spring Framework Code Style](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Code-Style)
# Spring Boot Development Skill

This skill assists AI coding agents in contributing to the [spring-boot](https://github.com/spring-projects/spring-boot) repository.

## Project Overview

Spring Boot is a framework for building production-ready Spring applications. The repository is a multi-module Gradle project using Java 17 (as of 3.x). Key modules include:
- `spring-boot` – core classes and the SpringApplication launcher
- `spring-boot-autoconfigure` – auto-configuration for many libraries
- `spring-boot-starters` – curated starter POMs
- `spring-boot-actuator` – production monitoring and management
- `spring-boot-test` – testing support
- `spring-boot-devtools` – developer tools
- `spring-boot-docs` – documentation sources
- `spring-boot-tools` – build tooling (Maven/Gradle plugins)

## Building and Testing

- **Build the whole project**: `./gradlew build` (requires JDK 17+)
- **Run all tests**: `./gradlew test`
- **Run a specific module's tests**: `./gradlew :spring-boot:spring-boot-autoconfigure:test`
- **Run a single test class**: `./gradlew :spring-boot-actuator:test --tests org.springframework.boot.actuate.endpoint.EndpointIdTests`
- **Full integration tests**: Some tests rely on Docker; set environment `SPRING_BOOT_TEST_DOCKER=true` if needed.
- **Formatting**: Use `./gradlew format` to apply the project's code style (Spotless). Always format your changes before committing.
- **Checkstyle**: `./gradlew checkstyleMain checkstyleTest`

## Contribution Guidelines

- All code changes must have accompanying tests (JUnit 5, AssertJ).
- Never introduce public API changes without thorough review. The Spring Boot API surface is carefully controlled.
- Avoid breaking changes; if necessary, deprecate first with `@Deprecated` and `@deprecated` javadoc, and document in migration guide.
- Configuration properties should be added to `additional-spring-configuration-metadata.json` in the corresponding auto-configuration module, or as `@ConfigurationProperties` classes.
- New auto-configuration classes must be registered in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (for Spring Boot 2.7+).

## Common Workflows

### Adding a New Auto-Configuration

1. Create your auto-configuration class in `spring-boot-autoconfigure` under `src/main/java/org/springframework/boot/autoconfigure/`.
2. Annotate with `@AutoConfiguration` and conditional annotations (`@ConditionalOnClass`, etc.).
3. Define any necessary `@ConfigurationProperties` class in the same package or a sub-package.
4. Add your new auto-configuration to the `imports` file: `spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
5. Write an auto-configuration tests in the corresponding `src/test` directory, using `ApplicationContextRunner` or `ReactiveWebApplicationContextRunner`.
6. Document the new feature in the reference documentation (in `spring-boot-docs`) and, if it’s a starter, update the appropriate starter module.

### Fixing a Bug

1. Locate the affected module and code.
2. Reproduce the issue with a test in the relevant test source set.
3. Fix the code.
4. Verify all existing tests pass: `./gradlew build` (or module-specific).
5. Ensure no new warnings or checkstyle violations.

### Updating Dependencies

- Third-party dependency versions are managed in `gradle.properties` or `build.gradle` of the root.
- Always verify that the new version doesn’t break the build.
- Run the full test suite.

## Key Conventions

- Package structure: everything under `org.springframework.boot` namespace.
- Use SLF4J for logging, not `System.out`.
- For properties, prefer `@ConfigurationProperties` over plain `@Value` when more than one property.
- Use `@Conditional` annotations judiciously; they must be testable.
- Tests in `src/test/java` mirror the main source structure.

## Developer Tools

- **IDE**: IntelliJ IDEA is commonly used; check project docs for setup.
- **Continuous Build**: Run `./gradlew build -Pcontinuous` while developing.
- **Documentation Preview**: Build docs with `./gradlew :spring-boot-docs:asciidoctor` to see HTML output.

This skill ensures contributions are aligned with Spring Boot’s standards and quality requirements.
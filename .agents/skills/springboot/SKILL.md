# Spring Boot Skill

## Overview
Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications. It provides auto-configuration, embedded servers, production-ready features (Actuator), and starter dependencies to simplify build configuration. This skill covers the Spring Boot open source repository at [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot), helping an AI coding agent navigate, understand, contribute to, and utilise the framework effectively.

## Repository Structure
- **spring-boot-project/**: Core framework source code.
  - `spring-boot/`: Core module (SpringApplication, SpringBootException, etc.).
  - `spring-boot-autoconfigure/`: Auto-configuration classes and `@Conditional` logic.
  - `spring-boot-actuator/`: Production-ready endpoints (health, metrics, etc.).
  - `spring-boot-actuator-autoconfigure/`: Auto-configuration for Actuator.
  - `spring-boot-starters/`: Parent POM for all starters (each starter is a subdirectory).
  - `spring-boot-test/`: Testing utilities (`@SpringBootTest`, `TestRestTemplate`).
  - `spring-boot-test-autoconfigure/`: Auto-configuration for testing.
  - `spring-boot-docs/`: Documentation sources.
  - `spring-boot-tools/`: Maven/Gradle plugins, annotation processors.
- **spring-boot-system-tests/**: Integration tests.
- **build.gradle**: Top-level Gradle build (Gradle multi-project).
- **gradlew / gradlew.bat**: Wrapper scripts.
- **ci/**: CI configuration (Jenkins pipelines).
- **.github/**: GitHub workflows, issue templates.

## Development Setup
- **Prerequisites**: JDK 17 or later (Java 17 baseline for Spring Boot 3.x).
- **Build Tool**: Gradle (wrapper provided).
- **Quick Build**: `./gradlew build` (compiles, runs unit tests).
- **Run All Tests**: `./gradlew test`. Individual module: `./gradlew :spring-boot-project:spring-boot-actuator:test`.
- **IDE Setup**: Import as a Gradle project. Enable annotation processing for Lombok/configuration processor. Use project code style (IntelliJ settings in `ide` resources).
- **Code Style**: Import order: `java`, `jakarta`, `org.springframework`, all others. No wildcard imports. Follow Spring Framework conventions.

## Key Components & Patterns
- **Auto-configuration**: Classes in `spring-boot-autoconfigure` under `org.springframework.boot.autoconfigure` with `@AutoConfiguration` (replaces `@Configuration`). Use `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc., to apply only when needed. Register in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
- **Starters**: Each starter is a POM-only artifact that brings in a curated set of dependencies. Defined in `spring-boot-starters/<name>`. The parent POM `spring-boot-starters` manages dependency versions.
- **Actuator**: Endpoints in `spring-boot-actuator`. Auto-configuration for endpoints in `spring-boot-actuator-autoconfigure`. Custom endpoints extend `@Endpoint`.
- **Configuration Properties**: `@ConfigurationProperties` classes (e.g., `server.port`) with metadata generated via `spring-boot-configuration-processor`.
- **Testing**: `@SpringBootTest`, `TestRestTemplate`, `@TestConfiguration`, and support for test slices (`@WebMvcTest`, etc.). Located in `spring-boot-test` and auto-configured in `spring-boot-test-autoconfigure`.

## Common Workflows

### Adding a New Auto-Configuration
1. Create a new package under `spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/<domain>`.
2. Implement an `@AutoConfiguration` class with required `@Conditional` annotations.
3. If the auto-config uses properties, create a corresponding `@ConfigurationProperties` class.
4. Add a `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` entry for the new class.
5. Write tests in `spring-boot-autoconfigure/src/test/java/...` using `ApplicationContextRunner`.
6. Update `spring-boot-docs` with reference documentation.

### Adding a New Starter
1. Create a new directory under `spring-boot-starters/` (e.g., `spring-boot-starter-mine`).
2. Include a `build.gradle` with dependencies on the required auto-configuration and external libraries.
3. Add the new starter to `settings.gradle` includes.
4. Ensure the starter POM is published alongside the other starters.

### Contributing
- Follow the [Contributor Guidelines](https://github.com/spring-projects/spring-boot/wiki/Contributor-Guidelines).
- Fork the repository, create a feature branch, implement changes, run `./gradlew build` successfully.
- Include tests for new functionality.
- Open a pull request against `main`.
- Sign the Contributor License Agreement (CLA) if applicable.

### Investigating Issues
- Start by checking the `spring-boot-autoconfigure` for auto-config bugs, `spring-boot-actuator` for endpoints.
- Use the `spring-boot-system-tests` to reproduce enterprise-level scenarios.
- Review `build.gradle` for dependency versions and plugin configurations.

### Building a Custom Distribution or SNAPSHOT
- `./gradlew publishToMavenLocal` publishes artifacts to local Maven repository (`~/.m2`).
- To test changes in another project, add `mavenLocal()` repository and reference the snapshot version.

## Important Conventions
- Package structure matches the module: e.g., auto-configuration for JDBC is `org.springframework.boot.autoconfigure.jdbc`.
- Auto-configuration class names often end with `AutoConfiguration`.
- Use `@ConditionalOnClass` to guard against missing dependencies.
- Never use `@ComponentScan` in auto-configurations.
- Use `@EnableConfigurationProperties` to bind property classes.
- All public APIs must be backward compatible across minor versions (strict semantic versioning).
- Test auto-configurations with `ApplicationContextRunner` or web variants.

## Links
- [Official Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [GitHub Repository](https://github.com/spring-projects/spring-boot)
- [Issue Tracker](https://github.com/spring-projects/spring-boot/issues)
- [Spring Boot Guides](https://spring.io/guides)
- [Gitter Community](https://gitter.im/spring-projects/spring-boot)
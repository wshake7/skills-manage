# Spring Boot Development Skill

## Overview
Spring Boot is a framework for building production-ready Spring applications with minimal configuration. The official repository is structured as a multi-module Gradle project. Key top-level directories:
- `spring-boot-project/` contains the core framework modules (autoconfigure, starters, actuator, etc.)
- `spring-boot-tests/` contains integration and deployment tests
- `spring-boot-system-tests/` contains system tests that exercise the full build and launch lifecycle
- `spring-boot-samples/` (if present) contains sample applications
- `spring-boot-dependencies/` manages the curated dependency versions

## Build System
Gradle with the Kotlin DSL. Use the wrapper `./gradlew` (Unix) or `gradlew.bat` (Windows) for all tasks.

### Common Commands
- **Build everything:** `./gradlew build`
- **Full build including tests:** `./gradlew check`
- **Build a specific module:** `./gradlew :spring-boot-project:spring-boot:build`
- **Run tests for a module:** `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- **Run a single test:** `./gradlew :spring-boot-project:spring-boot:test --tests "org.springframework.boot.SomeTestClass"`
- **Generate coverage report:** `./gradlew build -x test && ./gradlew test` (then check `build/reports/jacoco`)
- **Update copyright headers:** `./gradlew format` (if available) or use IDE plugin.

## Module Structure
- **spring-boot:** Core runtime: application startup, SpringApplication, environment, etc.
- **spring-boot-autoconfigure:** Auto-configuration classes, condition annotations, and starter infrastructure.
- **spring-boot-starters:** POMs/descriptors for opinionated dependency sets.
- **spring-boot-actuator:** Production-ready features (health, metrics, endpoints).
- **spring-boot-devtools:** Developer tools (restart, live reload).
- **spring-boot-test:** Test utilities and annotations (`@SpringBootTest`, `@WebMvcTest`, etc.).
- **spring-boot-cli:** Command-line interface.
- **spring-boot-loader:** Executable jar/war packaging and launching.

## Testing
Tests are split into:
- **Unit tests:** located under `src/test/java`, typically use JUnit 5 and Mockito.
- **Integration tests:** may use `@SpringBootTest` with embedded servers or `TestRestTemplate`.
- **Smoke tests:** in `spring-boot-tests` ensure that various starters work together.
- **System tests:** in `spring-boot-system-tests` verify end-to-end packaging and execution.

Run tests with `./gradlew test`. To run all checks including style, use `./gradlew check`.

### Test annotations
- `@SpringBootTest` for full application context.
- `@WebMvcTest` for web layer only.
- `@DataJpaTest` for JPA repositories.
- `@MockBean` for mocking beans in context.

## Development Workflow
1. **Fork and clone** the repository.
2. Import as a Gradle project into your IDE (IntelliJ IDEA fully supported).
3. Use `./gradlew build` initially to download dependencies and compile.
4. Make changes in relevant modules.
5. Write tests following existing patterns (JUnit Jupiter, AssertJ, Mockito).
6. Run module tests: `./gradlew :module-path:test`
7. Run code quality checks before commit: `./gradlew checkstyleMain checkstyleTest` (if configured).
8. Commit with descriptive message; sign the CLA if contributing.

## Key Patterns and Conventions
- Auto-configuration classes are in `spring-boot-autoconfigure` and are annotated with `@Configuration` and `@EnableConfigurationProperties`.
- Custom start conditions use annotations from `org.springframework.boot.autoconfigure.condition`.
- Properties are documented in `additional-spring-configuration-metadata.json` files.
- For new starters, add a module under `spring-boot-starters/` and update the `build.gradle`.
- Use the `SpringApplication` API for programmatic customization.

## Common Tasks for an AI Agent
- **Finding relevant code:** When asked about a feature, look for auto-configuration classes in `spring-boot-autoconfigure`, actuator endpoints in `spring-boot-actuator`, or core runtime in `spring-boot`.
- **Adding a new auto-configuration:** Create a new autoconfigure module if needed, or add to the existing one; define the configuration class, bind properties using `@ConfigurationProperties`, register the bean with conditions.
- **Debugging startup issues:** Trace through `SpringApplication.run()`, check auto-configuration reports (`debug=true`), inspect condition evaluation.
- **Testing:** Use `@SpringBootTest(webEnvironment = ...)` to test web endpoints; use `OutputCaptureExtension` or `LoggingSystem` to verify log output.

## Dependencies and Versions
Managed in `spring-boot-dependencies` via `org.springframework.boot:spring-boot-dependencies` BOM. To check or change a dependency version, edit `gradle.properties` or the `.gradle` files.

## Useful Links
- Contribution guide: https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc
- Reference documentation: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
- Issue tracker: GitHub issues with template for bugs/enhancements.

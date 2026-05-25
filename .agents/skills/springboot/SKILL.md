# Spring Boot Skill

A skill for working with the Spring Boot open-source project (https://github.com/spring-projects/spring-boot). Helps AI agents navigate the repository, build, test, and contribute.

## Building the Project

- Requires JDK 17+ (Java 17) and `./gradlew` for Gradle builds.
- Main command: `./gradlew build` from root. This compiles and runs all tests.
- For faster iteration, use `./gradlew :spring-boot-project:spring-boot:test` to test a specific module (e.g., `:spring-boot-project:spring-boot` for core module). The subproject names follow directory structure: `:spring-boot-project:spring-boot`, `:spring-boot-project:spring-boot-autoconfigure`, etc.
- Use `./gradlew -p spring-boot-tests/spring-boot-deployment-tests build` for deployment tests.

## Repository Structure

- `spring-boot-project/` - the main framework code:
  - `spring-boot/` - core module, includes SpringApplication, SpringApplicationBuilder, etc.
  - `spring-boot-autoconfigure/` - auto-configuration classes.
  - `spring-boot-actuator/`, `spring-boot-actuator-autoconfigure/` - production-ready features.
  - `spring-boot-starters/` - starter POMs.
  - `spring-boot-test/`, `spring-boot-test-autoconfigure/` - testing support.
  - `spring-boot-devtools/` - developer tools.
  - `spring-boot-cli/` - command-line tool.
  - `spring-boot-properties-migrator/` - property migration.
- `spring-boot-samples/` - sample applications (not part of the main build, use separate builds).
- `spring-boot-tests/` - integration tests, smoke tests, deployment tests.
- `buildSrc/` - Gradle build infrastructure.
- `gradle/` - Gradle wrapper and plugins.

## Contributing

- Sign the Contributor License Agreement (CLA) if not already done.
- Follow the coding conventions: tabs for indentation, Spring Framework code style (Eclipse/IDEA formatters available).
- Use `./gradlew format` to format code (uses Spotless).
- For new features, consider adding tests. Use JUnit 5 and AssertJ.
- Before submitting PRs, run `./gradlew clean build` to ensure everything passes.

## Testing

- Run specific test class: `./gradlew :spring-boot-project:spring-boot:test --tests "org.springframework.boot.SpringApplicationTests"`.
- Integration tests: Many tests use `@SpringBootTest`, requiring a running application context. Ensure `@ExtendWith(OutputCaptureExtension.class)` for output assertion.
- Samples: Go to the sample directory and run `./gradlew bootRun`.

## Navigating the Code

- Entry point for auto-configuration: look at `spring-boot-autoconfigure/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` which lists auto-configuration classes.
- Property metadata: `spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/additional-spring-configuration-metadata.json` and generated metadata in each starter.
- Actuator endpoints discovered via `@Endpoint` annotation in `spring-boot-actuator/`.

## Common Tasks for AI Agents

- Finding where a configuration property is defined: Use `@ConfigurationProperties` annotation, or search for property ID in metadata JSON.
- Fixing a test failure: Look at the test assertion error, find the test class, understand the expected behavior, modify code or test accordingly.
- Implementing a new auto-configuration: Create a class in `spring-boot-autoconfigure` with `@AutoConfiguration`, conditional annotations, register in `AutoConfiguration.imports`. Add property binding with `@ConfigurationProperties`.
- Running all tests: `./gradlew check` (which includes tests and code quality).

## Building Documentation

- The documentation sources are in `spring-boot-project/spring-boot-docs/`. Build with `./gradlew :spring-boot-project:spring-boot-docs:asciidoctor`.
- References: https://docs.spring.io/spring-boot/docs/current/reference/

## Tooling Integration

- Use `./gradlew dependencies` to see dependency trees.
- Use `./gradlew tasks` to list available tasks.

Keep this skill concise, providing the essential commands and structural knowledge for working with the Spring Boot repository.
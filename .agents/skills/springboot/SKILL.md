# Spring Boot Skill

This skill helps an AI coding agent work effectively with the [Spring Boot](https://github.com/spring-projects/spring-boot) repository and the Spring Boot framework.

## Overview
Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications. The repository is the primary source for the core framework, starters, and samples.

## Development Environment
- **Java**: JDK 17 or later (check `java.version` in root `gradle.properties` for the exact required version).
- **Build Tool**: Gradle (wrapper included).
- **IDE**: IntelliJ IDEA or Eclipse with appropriate plugins.

## Building the Project
- Full build (includes checks and tests):  
  `./gradlew build`
- Skip tests:  
  `./gradlew build -x test`
- Publish to local Maven repository (for downstream consumption):  
  `./gradlew publishToMavenLocal`
- Build a specific module:  
  `./gradlew :spring-boot-project:spring-boot:compileJava`

## Project Structure
Key directories in the repository:
- `spring-boot-project/`: Core framework modules (e.g., `spring-boot`, `spring-boot-autoconfigure`, `spring-boot-starters`, `spring-boot-actuator`, `spring-boot-test`).
- `spring-boot-tests/`: Integration and deployment tests.
- `spring-boot-system-tests/`: System tests that require a full build.
- `spring-boot-cli/`: Command-line tool.
- Samples are organized under `spring-boot-samples/` or as `spring-boot-sample-*` directories.

Modules of interest (within `spring-boot-project/`):
- `spring-boot`: Core API, `SpringApplication`, banner, admin features.
- `spring-boot-autoconfigure`: Auto-configuration support.
- `spring-boot-starters`: Dependency descriptors for various technologies (web, data, security, etc.).
- `spring-boot-actuator`: Production-ready features (health, metrics, etc.).
- `spring-boot-test`: Testing utilities and annotations.
- `spring-boot-devtools`: Developer tools for fast restarts and live reload.

## Running Tests
- All tests: `./gradlew test`
- Tests for a specific module:  
  `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- A single test class:  
  `./gradlew :spring-boot-project:spring-boot:test --tests org.springframework.boot.SampleTest`
- Integration tests (often use `@SpringBootTest`): located in `spring-boot-tests` and in individual modules under `src/test`.

## Code Formatting and Style
- Spring Boot follows Spring Framework's style. Use `./gradlew format` to apply formatting rules.
- Check formatting before committing: `./gradlew checkstyleMain checkstyleTest`.
- License headers are required. Run `./gradlew updateLicenses` to add missing headers.

## Contribution Guidelines
- Contributions go through GitHub Pull Requests targeting the `main` branch.
- Issue tracker: GitHub Issues. Provide clear descriptions and, for bugs, a minimal reproducible sample.
- Commit messages: use the conventional style (e.g., "Polish", "Add support for ...", "Fix ...").
- Before submitting a PR, ensure the build passes: `./gradlew build`.
- If you add or modify auto-configuration, also update the corresponding metadata in `additional-spring-configuration-metadata.json` and tests.

## Working with Samples
Live samples under `spring-boot-samples/` can be run directly:
- Navigate to a sample directory (e.g., `spring-boot-sample-jetty`).
- Execute: `../../gradlew bootRun` or use the project’s own Maven/Gradle wrapper if present.
- Samples often double as integration tests for the framework.

## Useful Commands
- Generate API docs:  
  `./gradlew api` (from `spring-boot-project/spring-boot-docs`).
- Run smoke tests for a specific version:  
  `./gradlew -PsmokeTest=true smokeTest`
- Validate dependency management consistency:  
  `./gradlew check`
- List all tasks:  
  `./gradlew tasks`

## Additional Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot API Javadoc](https://docs.spring.io/spring-boot/docs/current/api/)
- [Building a RESTful Web Service Guide](https://spring.io/guides/gs/rest-service/)
- Repository’s README.adoc includes detailed setup and building instructions.

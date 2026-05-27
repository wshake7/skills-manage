# Spring Boot Skill

## Overview
Spring Boot provides an opinionated, convention-over-configuration framework for building stand-alone, production-grade Spring applications with minimal fuss. This skill helps you navigate, understand, and contribute to the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository effectively.

## Repository Structure
- **spring-boot-project/**: Core libraries and modules.
  - `spring-boot`: Foundation classes (SpringApplication, Banner, etc.).
  - `spring-boot-autoconfigure`: Auto-configuration support, a central piece that applies sensible defaults based on classpath and conditions.
  - `spring-boot-actuator`, `spring-boot-actuator-autoconfigure`: Production-ready monitoring and management endpoints.
  - `spring-boot-starters`: Curated sets of dependency descriptors (`spring-boot-starter-*`).
  - `spring-boot-test`, `spring-boot-test-autoconfigure`: Testing utilities and auto-configuration.
  - `spring-boot-docker-compose`: Docker Compose integration.
  - `spring-boot-devtools`: Developer tools for live reload and enhanced debugging.
- **spring-boot-tools/**: Build plugins and tooling (Maven plugin, Gradle plugin, Antlib).
- **spring-boot-cli/**: Spring Boot CLI.
- **spring-boot-docs/**: Reference documentation sources (Asciidoctor).
- **spring-boot-system-tests**, **spring-boot-tests**: Integration and system tests.

## Build System
- Primary: **Gradle** (multi-module build with Kotlin DSL).
- Wrapper provided: `./gradlew` (Linux/macOS) or `gradlew.bat` (Windows).
- Common tasks:
  - `./gradlew build` - Compile and test everything.
  - `./gradlew -p spring-boot-project build` - Build only the core project.
  - `./gradlew test` - Run all tests; use `--tests "com.example.*"` to filter.
  - `./gradlew publishToMavenLocal` - Publish snapshots locally for other projects.
- Java version: Check the main `build.gradle.kts` or `gradle.properties` for the required JDK (typically latest LTS).

## Key Concepts and Patterns
### Auto-configuration
Auto-configuration classes are registered in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` and use conditional annotations (`@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`, etc.) to enable beans only when necessary. Know the classpath detection rules and ordering via `@AutoConfigureBefore`/`@AutoConfigureAfter`.

### Configuration Properties
Robust type-safe property binding via `@ConfigurationProperties`. These are often nested classes and support relaxed binding. Processors generate metadata (`META-INF/spring-configuration-metadata.json`) for IDE assistance.

### Starters
A starter is an empty POM that pulls in transitive dependencies for a specific feature (e.g., `spring-boot-starter-web`). Don’t add code to starters; they are just dependency descriptors.

### Application Lifecycle
`SpringApplication.run(...)` bootstraps the context. Understand listeners (`ApplicationListener`), initializers (`ApplicationContextInitializer`), and the `Environment` post-processing.

## Testing
- Use **JUnit Jupiter** and **Spring Boot Test** (`@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, etc.).
- Unit tests for auto-configuration use `ApplicationContextRunner` or `WebApplicationContextRunner` (from `spring-boot-test-autoconfigure`) to assert bean presence/absence and properties.
- Integration tests often require real embedded servers or databases; use Testcontainers or `@AutoConfigureTestDatabase`.
- All tests pass before a PR is accepted: `./gradlew test`.

## Common Development Workflows
### Adding a New Auto-configuration
1. Create the auto-configuration class in an appropriate module (e.g., `spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/<domain>/`).
2. Add conditional annotations and any required `@ConfigurationProperties`.
3. Register the class in `...auto-configuration/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
4. Write tests using `ApplicationContextRunner` in the matching test directory.
5. If needed, provide a starter in `spring-boot-starters/` (just a `pom.xml`).
6. Update documentation in `spring-boot-docs/src/main/asciidoc/` if exposing a new feature.

### Modifying a Starter Dependency
- Edit the corresponding starter’s `pom.xml` inside `spring-boot-project/spring-boot-starters/`. Never add Java code there.

### Fixing a Bug
- Locate the module from the stack trace or class name.
- Write a failing test that reproduces the bug.
- Implement the fix and ensure existing tests pass.
- Run full build to check for regressions.

### Contribution Workflow
- Fork the repository, clone it, and create a feature branch.
- Follow the coding style: 4 spaces indentation, no tabs, braces on same line, Javadoc on public API, etc.
- Add tests; update documentation if behavior changes.
- Sign the [Contributor License Agreement](https://cla.pivotal.io/sign/spring) if required.
- Push your branch and open a pull request against the `main` branch of `spring-projects/spring-boot`.
- Ensure all CI checks pass (GitHub Actions).

## Useful Commands
```bash
# Full build and test suite
./gradlew build

# Build a specific module
./gradlew :spring-boot-project:spring-boot:build

# Clean build without tests
./gradlew clean assemble

# Check for dependency updates
./gradlew dependencyUpdates -Drevision=release
```

## Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot API Javadoc](https://docs.spring.io/spring-boot/docs/current/api/)
- [Contributing Guidelines (CONTRIBUTING.adoc)](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc)
- [CI Build Status](https://github.com/spring-projects/spring-boot/actions)

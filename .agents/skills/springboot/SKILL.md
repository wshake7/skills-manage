# Spring Boot Skill

This skill helps an AI coding agent work effectively with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. It provides essential guidance on structure, build system, conventions, and common tasks.

## Repository Overview
Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications. The repository is a multi-module Gradle project containing the framework core, autoconfiguration, starters, tools, and documentation.

## Repository Structure
- **`spring-boot-project/`** – Main source code:
  - `spring-boot/` – Core module (SpringApplication, Banner, etc.).
  - `spring-boot-autoconfigure/` – Auto-configuration classes.
  - `spring-boot-actuator/` – Production-ready features.
  - `spring-boot-starters/` – Starter POMs.
  - `spring-boot-tools/` – Maven and Gradle plugins, metadata generation.
- **`spring-boot-tests/`** – Integration tests.
- **`spring-boot-system-tests/`** – System tests requiring a real container.
- **`buildSrc/`** – Custom Gradle plugins and conventions.
- **`ci/`** – CI pipeline scripts.
- **`gradle/`** – Gradle wrapper and configuration.

## Build System
- **Build tool:** Gradle (wrapper included, use `./gradlew`).
- **Java version:** Check `gradle.properties` for `javaVersion` property (currently 17+).
- **Key tasks:**
  - `./gradlew build` – Assembles and tests all modules.
  - `./gradlew :spring-boot-project:spring-boot:build` – Build a specific module.
  - `./gradlew test` – Run module tests.
  - `./gradlew test -x javadoc` – Skip javadoc generation during test.
- **Testing:** Uses Junit Jupiter (JUnit 5). Tests are often in `src/test/java` and organized mirroring main source. Look for `@SpringBootTest` or plain unit tests.

## Key Modules and Classes
- **SpringApplication** (`spring-boot-project/spring-boot/src/main/java/org/springframework/boot/SpringApplication.java`): Central class to bootstrap a Spring application from a `main` method.
- **Auto-configuration** (`spring-boot-project/spring-boot-autoconfigure/`): All auto-config classes are under `org.springframework.boot.autoconfigure`. Each covers a specific technology (e.g., `DataSourceAutoConfiguration`).
- **Actuator** (`spring-boot-project/spring-boot-actuator/`): Provides endpoints and health indicators.
- **Starters** (`spring-boot-project/spring-boot-starters/`): Simple POMs that bring in dependencies; useful for understanding dependency bundles.
- **Configuration properties** (`spring-boot-project/spring-boot-actuator-autoconfigure` and `spring-boot-autoconfigure`): Often bound via `@ConfigurationProperties`. Look for `*Properties` classes.

## Coding Conventions
- Follow **Spring Framework Code Style** (Eclipse/IntelliJ formatters in the repository root: `eclipse-code-formatter.xml`, `checkstyle.xml`).
- Use **Lombok**? No, Spring Boot does not use Lombok. Instead, explicit getters/setters.
- **Null-safety:** Annotations from `org.springframework.lang` (e.g., `@Nullable`, `@NonNull`).
- **Javadoc:** Public API and configuration properties must be documented.
- **Logging:** Use SLF4J (typically `logger` from `LoggerFactory`).

## Common Workflows for AI Agents
- **Adding a new auto-configuration:**
  1. Create an auto-config class in `spring-boot-autoconfigure` under the appropriate package.
  2. Add the configuration class in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
  3. Write a test class using `ApplicationContextRunner` (from `spring-boot-test`) to validate condition evaluation and bean creation.
  4. If adding new starter, create a module in `spring-boot-starters` with `pom.xml`.
- **Analyzing a defect:** Navigate to the relevant module, use `ApplicationContextRunner` or write a minimal sample application (in `spring-boot-tests`) to reproduce.
- **Updating dependencies:** Located in `gradle.properties`, `build.gradle`, and `spring-boot-project/spring-boot-dependencies/build.gradle` (dependency management).
- **Running samples:** Samples are in `spring-boot-tests/spring-boot-smoke-tests/`. Each is a standalone application.

## Useful Commands
```bash
# Build entire project (skip tests initially for speed):
./gradlew build -x test -x javadoc

# Run all tests in a specific module:
./gradlew :spring-boot-project:spring-boot-autoconfigure:test

# Run a single test class:
./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests "org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfigurationTests"

# Generate Maven/Gradle plugin documentation (for tools):
./gradlew :spring-boot-project:spring-boot-tools:spring-boot-gradle-plugin:test

# Check code style:
./gradlew checkstyleMain checkstyleTest
```

## Testing Conventions
- `ApplicationContextRunner` (`org.springframework.boot.test.context.runner.ApplicationContextRunner`) is the preferred way to test auto-configuration classes.
- Use `@SpringBootTest` for integration tests requiring full context.
- For unit tests, plain JUnit with Mockito.
- AssertJ or Hamcrest for assertions.
- Test classes are named `*Tests` or `*Test` and often located next to the source they test.

## Important Files
- **`spring-boot-project/spring-boot-dependencies/build.gradle`** – Central dependency version management (like a BOM).
- **`spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`** – List of auto-config classes (newer Spring Boot 3.x).
- **`gradle.properties`** – Project-wide Gradle properties (Java version, Spring versions, etc.).
- **`settings.gradle`** – Module definitions.

## Contributing
- Contributor guidelines: See `CONTRIBUTING.adoc` in the repository root.
- Squash commits, sign the Committer Agreement.
- PRs should include tests and be rebased to the default branch (usually `main`).

## Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [GitHub Repository](https://github.com/spring-projects/spring-boot)
- [Issue Tracker](https://github.com/spring-projects/spring-boot/issues)
- [Gitter/StackOverflow Tag: spring-boot]

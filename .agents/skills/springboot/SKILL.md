# Spring Boot Development Skill

This skill equips an AI coding agent with essential knowledge to contribute to the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository, which provides the core framework for creating stand-alone, production-grade Spring-based applications.

## Prerequisites

- Java 17 or later (check the `java.version` property in the root `pom.xml` for the exact version).
- Git
- An IDE with Spring support (optional but helpful).

## Repository Layout

- **spring-boot-project/spring-boot** – Core Spring Boot classes (SpringApplication, Banner, etc.)
- **spring-boot-project/spring-boot-autoconfigure** – Auto-configuration support (`@EnableAutoConfiguration`)
- **spring-boot-project/spring-boot-starters** – Starter POMs
- **spring-boot-project/spring-boot-actuator** – Production-ready features (metrics, health, etc.)
- **spring-boot-project/spring-boot-actuator-autoconfigure** – Auto-configuration for Actuator
- **spring-boot-project/spring-boot-test** – Test utilities and annotations (e.g., `@SpringBootTest`)
- **spring-boot-project/spring-boot-test-autoconfigure** – Auto-configuration for tests
- **spring-boot-project/spring-boot-tools** – Devtools, loader, Maven/Gradle plugins
- **spring-boot-tests** – Integration and smoke tests
- **spring-boot-system-tests** – System-level tests

## Build & Test Commands

Use the Maven wrapper (`./mvnw` or `mvnw.cmd`) to ensure consistent builds.

```bash
# Full build (skip tests)
./mvnw clean install -DskipTests

# Build with all tests (can be slow)
./mvnw clean install

# Build a specific module and its dependencies
./mvnw clean install -pl spring-boot-project/spring-boot -am

# Run tests for a specific module
./mvnw test -pl spring-boot-project/spring-boot-autoconfigure

# Build with the 'fast' profile to skip long-running tests
./mvnw clean install -Pfast

# Run a single test class
./mvnw test -pl spring-boot-project/spring-boot-autoconfigure -Dtest=MyTestClass
```

## Coding Conventions

- **Java formatting**: The project enforces a consistent style via [Spring Java Format](https://github.com/spring-io/spring-javaformat). Apply it with:
  ```bash
  ./mvnw spring-javaformat:apply
  ```
- **Checkstyle**: Run `./mvnw checkstyle:check` before committing. Configuration files live in `src/checkstyle`.
- **Imports**: No wildcard imports. Import order is configured by the Eclipse/IntelliJ formatter settings in the repository.
- **Tests**: Use JUnit 5 and AssertJ. Mockito is available for mocking. Prefer `ApplicationContextRunner` for testing auto-configuration (see `spring-boot-test-autoconfigure` module).

## Contribution Workflow

1. Fork the repository and create a branch from `main`.
2. Make your changes, adhering to the coding conventions.
3. Ensure all tests pass and no checkstyle violations are present.
4. Run `./mvnw clean install -Pfast` to verify the build.
5. Commit with a descriptive message referencing any related issue (e.g., "Closes gh-1234").
6. Push your branch and open a pull request against `spring-projects/spring-boot:main`.

## Auto-configuration Registration

- For Spring Boot 2.7+, auto-configuration classes are listed in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
- For older versions or integration with `spring.factories`, register in `META-INF/spring.factories` under `org.springframework.boot.autoconfigure.EnableAutoConfiguration`.
- Always annotate auto-configuration classes with `@AutoConfiguration` (since 2.7) and `@Conditional*` annotations.

## Dependency Management

- The root `spring-boot-dependencies` POM manages all dependency versions. Use it as the BOM for downstream projects.
- When adding a new dependency, ensure the version aligns with the managed set. Version properties are defined in `<properties>` of the root POM.

## Documentation

- Reference documentation is written in Asciidoctor and located under `src/main/asciidoc` of the relevant module.
- To build the docs locally: `./mvnw clean package -Pfull -pl spring-boot-project/spring-boot-docs` (may take time).

## Testing Best Practices

- **Unit tests**: Should be fast and not require a Spring `ApplicationContext`.
- **Auto-configuration tests**: Use `ApplicationContextRunner` (in `spring-boot-test-autoconfigure`) to verify context loading without full server overhead.
- **Integration tests**: Located in `spring-boot-tests`. They may start an embedded server and exercise full scenarios.
- Use `@ConfigurationProperties` scanning carefully; prefer explicit binding for new configuration.

## Useful Tips

- The `spring-boot-project/spring-boot/src/main/resources/META-INF/spring-configuration-metadata.json` file is generated. Do not edit it manually; update the appropriate Java classes and rebuild.
- For AOT processing (Spring Boot 3.x), refer to the `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/aot` package.
- When modifying auto-configuration, always consider backward compatibility and impact on user-defined beans (`@ConditionalOnMissingBean`).

# Spring Boot Skill

This skill provides guidance for working with the [Spring Boot](https://github.com/spring-projects/spring-boot) framework and repository.
Based on the structure and conventions of the official repository, it helps AI coding agents understand, build, and extend Spring Boot applications and the framework itself.

## Repository Overview

The Spring Boot repository is a multi-module Gradle project.
Key modules:
- `spring-boot-project/spring-boot`: Core API, main application context, and SpringApplication.
- `spring-boot-project/spring-boot-autoconfigure`: Auto-configuration support, `@Conditional` logic, and built-in configurations.
- `spring-boot-project/spring-boot-starters`: Curated sets of dependencies (starters) that simplify project setup.
- `spring-boot-project/spring-boot-test`: Testing utilities including `@SpringBootTest`, test slices, and mocks.
- `spring-boot-project/spring-boot-devtools`: Developer tools for hot reloading and improved debugging.
- `spring-boot-project/spring-boot-actuator`: Production-ready features like health checks, metrics, and info endpoints.
- `spring-boot-project/spring-boot-actuator-autoconfigure`: Auto-configuration for Actuator.
- `spring-boot-tools`: Build plugins (Maven/Gradle) and metadata generation.
- `spring-boot-system-tests`: Integration tests for the entire framework.

## Build System
- **Gradle** with wrapper (`gradlew`). Java 17+ is required.
- Common tasks:
  - `./gradlew build` – full build including tests and checks.
  - `./gradlew assemble` – compile and assemble outputs.
  - `./gradlew test` – run unit and integration tests.
  - `./gradlew check` – run style checks (Checkstyle) and tests.
  - `./gradlew publishToMavenLocal` – publish artifacts to local Maven repo for testing in other projects.
- Configuration is spread across `build.gradle`, `gradle.properties`, and convention plugins in `spring-boot-project/spring-boot-tools/spring-boot-gradle-plugin`.

## Development Workflow (Contributing)
1. Fork and clone the repository.
2. Run `./gradlew build` to verify your environment.
3. Create a feature branch, follow the [contributor guidelines](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc).
4. Ensure code adheres to Spring Java Format; run `./gradlew format` (if available) or use the Eclipse formatter settings.
5. Add tests; prefer JUnit Jupiter with AssertJ.
6. Run `./gradlew check` before submitting a PR.

## Using Spring Boot in Applications

### Typical Project Structure
```
src/main/java/com/example/Application.java
src/main/resources/application.properties (or .yml)
src/test/java/com/example/ApplicationTests.java
```
Minimal main class:
```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

### Dependency Management
- Use Spring Boot starters (e.g., `spring-boot-starter-web`, `spring-boot-starter-data-jpa`) to automatically pull compatible versions.
- Version is managed via `spring-boot-dependencies` BOM, inherited through parent or imported in build file.

### Configuration
- Externalize properties via `application.properties`, environment variables, command-line args.
- Profiles: `application-{profile}.properties`.
- Using `@ConfigurationProperties` for type-safe binding.

### Auto-Configuration
- Spring Boot automatically configures beans based on classpath and defined properties.
- To customize, create a `@Configuration` class or exclude specific auto-configuration classes using `spring.autoconfigure.exclude`.
- For creating a custom starter, follow the pattern: an `autoconfigure` module with `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3.x) or `spring.factories` (older).

### Testing
- `@SpringBootTest` starts the full application context. Use `@TestPropertySource` or `@DynamicPropertySource` to override properties.
- Sliced tests: `@WebMvcTest`, `@DataJpaTest`, `@RestClientTest`, etc.
- Mock beans with `@MockBean` or `@SpyBean`.
- Test auto-configuration reports to debug context issues: `--debug` flag or `@SpringBootTest(webEnvironment = ...)`.

### Actuator & Observability
- Adding `spring-boot-starter-actuator` exposes endpoints under `/actuator`.
- Common endpoints: `health`, `info`, `metrics`, `env`, `loggers`.
- Secure endpoints by default; customize with `management.endpoints.web.exposure.include`.

### Devtools
- Include `spring-boot-devtools` as a development-only dependency.
- Enables automatic restart, LiveReload, and property defaults for development.

## Key Conventions and Patterns

- **Failure Analyzers**: Provide detailed error messages for common startup failures (e.g., port already in use).
- **Conditional Annotations**: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc. Use them to make auto-configuration flexible.
- **Environment Post-Processing**: `EnvironmentPostProcessor` allows modifying the environment before the context starts.
- **Configuration Metadata**: `spring-boot-configuration-processor` generates JSON metadata for IDE autocompletion.

## Troubleshooting

- Enable debug mode: `java -jar app.jar --debug` or `spring.output.ansi.enabled=ALWAYS`.
- Check the auto-configuration report: after startup, `Positive matches` and `Negative matches` list.
- Use the Actuator `conditions` endpoint to inspect why a configuration was or was not applied.
- For dependency conflicts, run `./gradlew dependencies` or `mvn dependency:tree`.

This skill is kept concise; refer to the [official documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/) for deeper details.

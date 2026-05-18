# Spring Boot Codex Skill

## Overview
Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications. The repository contains the framework's source code, auto-configuration, starters, actuators, tools, and samples.

## Project Structure
- `spring-boot-project/` – Core framework modules:
  - `spring-boot` – Foundation, `SpringApplication`, listeners, admin, etc.
  - `spring-boot-autoconfigure` – Auto-configuration for many libraries.
  - `spring-boot-starters` – Curated dependency sets (web, data-jpa, etc.).
  - `spring-boot-actuator` – Production-ready features (health, metrics).
  - `spring-boot-actuator-autoconfigure` – Auto-config for actuator.
  - `spring-boot-test` / `spring-boot-test-autoconfigure` – Test utilities and slices.
  - `spring-boot-devtools` – Developer productivity tools.
  - `spring-boot-cli` / `spring-boot-loader` / `spring-boot-docker-compose` / `spring-boot-tools` – Additional modules.
- `spring-boot-tests/` – Integration tests.
- `spring-boot-system-tests/` – System-level verification.
- `samples/` – Example applications.

## Build & Test
- **Gradle Wrapper**: Use `./gradlew` (Linux/macOS) or `gradlew.bat` (Windows).
- **Build the whole project**: `./gradlew build`
- **Build a specific module**: `./gradlew :spring-boot-project:spring-boot:build`
- **Run tests**: `./gradlew test` (module: `./gradlew :spring-boot-project:spring-boot:test`)
- **Skip tests**: append `-x test`
- **Checkstyle & formatting**: `./gradlew checkstyleMain checkstyleTest`; apply formatting with `./gradlew format` (see CONTRIBUTING.adoc).
- **Run a sample**: `./gradlew :spring-boot-samples:spring-boot-sample-simple:bootRun`
- **Generate docs**: `./gradlew :spring-boot-project:spring-boot-docs:asciidoctor`

## Key Components for Agent Work
- `SpringApplication` – Bootstrap and run a Spring application.
- `@SpringBootApplication` – Convenience annotation combining `@Configuration`, `@EnableAutoConfiguration`, `@ComponentScan`.
- `@EnableAutoConfiguration` – Triggers auto-configuration.
- `application.properties` / `application.yml` – External configuration.
- `spring.factories` – Register auto-configuration classes, listeners, etc. (located in `META-INF/spring.factories`; new style uses `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`).
- `Environment`, `Binder`, `@ConfigurationProperties` – Type-safe configuration binding.
- Actuator endpoints: `/health`, `/info`, `/metrics`, etc.

## Common Workflows
### Creating a New Auto-Configuration
1. Add a new module or package to `spring-boot-autoconfigure`.
2. Implement `@Configuration` class annotated with `@AutoConfiguration` (or `@Configuration` with `spring.factories` entry).
3. Use `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc., for conditional wiring.
4. Define `@ConfigurationProperties` for custom settings.
5. Register in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
6. Add corresponding tests in the autoconfigure test module.

### Adding a New Starter
1. Create a new directory under `spring-boot-starters/`.
2. Add a minimal `build.gradle` that depends on the necessary autoconfigure module and the target library.
3. Optionally add transitive dependencies.

### Customizing an Existing Auto-Configuration
- Search for the appropriate auto-configuration class (e.g., `DataSourceAutoConfiguration`).
- Understand `@Conditional` annotations and property prefixes.
- Extend or exclude using `@EnableAutoConfiguration(exclude = ...)` or `spring.autoconfigure.exclude` property.
- Replace a bean by defining your own with `@Primary` or `@Bean` in a custom configuration.

### Debugging an Application
- Use `--debug` flag to print auto-configuration report.
- Enable actuator endpoints: `management.endpoints.web.exposure.include=*`.
- Use DevTools for automatic restart: add `spring-boot-devtools` dependency.
- Logging levels: `logging.level.org.springframework=DEBUG` in properties.

## Configuration & Profiles
- Properties are loaded from many sources, ordered. Use `spring.config.location` to override.
- Profiles: `spring.profiles.active=dev` activates beans/environments.
- Multi-document YAML: separate with `---` and `spring.config.activate.on-profile`.
- `@Value` vs `@ConfigurationProperties` – prefer the latter for structured, type-safe binding.

## Testing
- `@SpringBootTest` – Full integration test.
- `@WebMvcTest`, `@DataJpaTest`, `@RestClientTest`, `@JsonTest` – Slices for focused testing.
- `@MockBean` / `@SpyBean` – Mock dependencies.
- `@TestPropertySource` – Override properties for test.
- `@AutoConfigureTestDatabase` – Replace database with in-memory for tests.
- `TestRestTemplate` / `WebTestClient` – For HTTP testing.
- Use `OutputCaptureExtension` to capture log output (JUnit 5).

## Actuator Basics
- Endpoints exposed via HTTP or JMX; health and info are available by default.
- Custom health indicators implement `HealthIndicator`.
- Custom info contributors implement `InfoContributor`.
- Metrics: Micrometer integration; auto-configured for many backends.

## Repository Standards
- Follow Spring Framework code style (see CONTRIBUTING.adoc).
- Write JUnit 5 tests with AssertJ.
- Use `@GradleTest` for integration tests that require a Gradle build.
- Keep public API as per `@since` tags.

## References
- Official documentation: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
- GitHub repository: https://github.com/spring-projects/spring-boot
- Contributing guide: CONTRIBUTING.adoc in the root.

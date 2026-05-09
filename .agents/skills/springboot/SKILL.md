# Spring Boot Repository Skill

## Overview
Spring Boot is an opinionated framework for building production-ready Spring applications. This repository contains the core Spring Boot framework, tools, samples, and documentation.

## Repository Structure
- `spring-boot-project/` – Core modules:
  - `spring-boot` – base library (SpringApplication, embedded servers, etc.)
  - `spring-boot-autoconfigure` – auto-configuration classes
  - `spring-boot-starters/` – starter POMs (each is a separate module)
  - `spring-boot-actuator` – production monitoring and management
  - `spring-boot-actuator-autoconfigure` – auto-config for actuator
  - `spring-boot-test` – test utilities and annotations
  - `spring-boot-test-autoconfigure` – auto-config for tests
  - `spring-boot-devtools` – developer tools (auto-restart, LiveReload)
  - `spring-boot-docs` – reference documentation
  - `spring-boot-cli` – command-line tool (optional)
- `spring-boot-tools/` – Maven and Gradle plugins, buildpack, etc.
- `spring-boot-samples/` – sample applications demonstrating features.
- `build.gradle` – root build script; uses Gradle wrapper.

## Build & Development Commands
- **Build all**: `./gradlew build`
- **Build without tests**: `./gradlew build -x test`
- **Run a single module's tests**: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- **Run a specific test class**: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests <fully-qualified-class>`
- **Publish to local Maven repo**: `./gradlew publishToMavenLocal`
- **Run a sample**: `./gradlew :spring-boot-samples:spring-boot-sample-tomcat:bootRun`
- **Build with Java 17+**: Ensure `JAVA_HOME` is set correctly; Spring Boot 3.x+ requires Java 17.

## Key Development Workflows

### Understanding and Extending Auto-configuration
- Auto-configuration classes live in `spring-boot-autoconfigure` module under `org.springframework.boot.autoconfigure`.
- Classes are registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (preferred for Boot 2.7+ / 3.x) or `META-INF/spring.factories` under `org.springframework.boot.autoconfigure.EnableAutoConfiguration`.
- Use `@AutoConfiguration` (or `@Configuration`) with conditionals: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`, etc.
- To contribute a new auto-configuration, create a class with appropriate conditionals, define its ordering (using `@AutoConfigureBefore`, `@AutoConfigureAfter`, `@AutoConfigureOrder`), and register it.

### Creating a New Starter
- A starter consists of two modules (optional but recommended): a `starter` module (just POM aggregating dependencies) and an `autoconfigure` module (containing auto-configuration code).
- Example: For a new feature `spring-boot-starter-foo`:
  1. Under `spring-boot-project/spring-boot-starters`, create directory `spring-boot-starter-foo` with a `build.gradle` that depends on `spring-boot-starter` and the necessary libraries.
  2. If auto-configuration is needed, create `spring-boot-project/spring-boot-autoconfigure-foo` module with configuration classes and register them.
  3. Update settings.gradle to include both modules.
  4. Add integration tests in the autoconfigure module using `ApplicationContextRunner` or `@SpringBootTest`.

### Working with Actuator
- Endpoints are defined in `org.springframework.boot.actuate.endpoint` and sub-packages.
- Custom endpoints can be added by implementing `@Endpoint` or `@WebEndpoint`.
- Health indicators extend `AbstractHealthIndicator` and are auto-detected via `spring.factories`/AutoConfiguration.imports.

### Writing Tests
- Use `spring-boot-test` module. Common annotations: `@SpringBootTest` (full integration), `@WebMvcTest` (slice test), `@DataJpaTest`, etc.
- For auto-configuration testing, use `ApplicationContextRunner` defined in `spring-boot-test-autoconfigure`.
- Example:
  ```java
  new ApplicationContextRunner()
      .withUserConfiguration(MyAutoConfiguration.class)
      .run(context -> assertThat(context).hasSingleBean(MyService.class));
  ```

### Contributing to Documentation
- Docs are in `spring-boot-docs` (Asciidoctor format). The reference guide source is `src/docs/asciidoc/`.
- Build docs with `./gradlew :spring-boot-docs:asciidoctor` and check output in `build/docs/asciidoc`.

## Important Configuration Files
- `gradle.properties` – Java version, Gradle settings.
- `.github/` – CI workflows (Actions).
- `settings.gradle` – Multi-module configuration.
- `gradle/wrapper/gradle-wrapper.properties` – Gradle version.
- `src/checkstyle/` – Checkstyle configuration.
- `src/spring-boot-bom/` – Bill of Materials (version management).

## Troubleshooting Tips
- If a sample or module doesn't build, ensure you have Java 17+ and run `./gradlew clean` first.
- For missing dependency issues, update local cache: `./gradlew --refresh-dependencies`.
- Many tests depend on Docker or specific environment; skip them with `-x test` or use `@DisabledOnOs` test filters.
- Use `docker-compose` for integration tests requiring services (e.g., MongoDB, Redis).

## Resources
- Official reference: `spring-boot-project/spring-boot-docs/src/docs/asciidoc/`
- Issue tracker: GitHub Issues
- Contributing guidelines: `CONTRIBUTING.md`
- Build status and CI: see Actions tab.

This skill should equip an AI coding agent to efficiently navigate and contribute to the Spring Boot codebase.
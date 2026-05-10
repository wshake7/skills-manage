# Spring Boot Repository Skill

This skill helps an AI coding agent work effectively with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. It covers essential workflows, project structure, and conventions for contributing to or analyzing the framework.

## Overview
Spring Boot is the convention-over-configuration centric framework for building stand-alone, production-grade Spring applications. This repository contains:
- **`spring-boot-project/`** – Core modules (auto-configuration, starters, actuator, test, etc.)
- **`spring-boot-tools/`** – Maven plugin, Gradle plugin, CLI, etc.
- **`spring-boot-samples/`** – Sample applications demonstrating features
- **`spring-boot-docs/`** – Reference documentation sources
- **`buildSrc/`** – Build conventions and custom Gradle plugins
- **`ci/`** – CI/CD pipeline scripts

## Build System
- **Gradle** with Kotlin DSL. Use the Gradle wrapper:
  ```bash
  ./gradlew <task>
  ```
- **Key tasks**:
  - `build` – Full build including tests
  - `test` – Run all tests (or per-module: `:spring-boot-project:spring-boot:test`)
  - `assemble` – Compile and package without tests
  - `publishToMavenLocal` – Publish artifacts to local Maven cache for testing
- **Java version**: JDK 17+ is required. Check `.sdkmanrc` or `build.gradle.kts` for exact version.
- **Parallel execution** is enabled; use `--no-parallel` if debugging.

## Project Structure and Modules
### Core (spring-boot-project)
- `spring-boot` – main API, SpringApplication, environment, etc.
- `spring-boot-autoconfigure` – auto-configuration classes and `spring.factories` / `AutoConfiguration.imports`
- `spring-boot-starters` – curated dependency descriptors
- `spring-boot-actuator` – production-ready features (health, metrics, endpoints)
- `spring-boot-test` – testing utilities
- `spring-boot-devtools` – developer tools (restart, live reload)
- `spring-boot-docker-compose` – Docker Compose integration
- `spring-boot-testcontainers` – Testcontainers support

### Tools (spring-boot-tools)
- `spring-boot-maven-plugin`
- `spring-boot-gradle-plugin`
- `spring-boot-cli` – command-line tool
- `spring-boot-buildpack-platform` – Cloud Native Buildpacks support

### Documentation
- Reference docs are in `spring-boot-docs/`. Build with `./gradlew :spring-boot-docs:asciidoctor`.

## Development Workflow
1. **Set up IDE**: Import as Gradle project. Enable annotation processing.
2. **Make changes**: Usually in `spring-boot-project/spring-boot-autoconfigure` or `spring-boot-project/spring-boot`.
3. **Run module-specific tests**:
   ```bash
   ./gradlew :spring-boot-project:spring-boot-autoconfigure:test
   ```
4. **Full verification** (can be slow):
   ```bash
   ./gradlew build
   ```
   Skip tests temporarily: `./gradlew build -x test`
5. **Format code**: The project uses Spring Java Format. Use `./gradlew format` or apply IDE plugin.
6. **Add unit tests**: Write JUnit 5 tests with `@AutoConfigureMetrics` etc. as needed.

## Key Coding Conventions
- **Packages**: Auto-configuration classes belong to `org.springframework.boot.autoconfigure.<area>`.
- **Configuration properties**: Use `@ConfigurationProperties` prefix like `spring.datasource`.
- **Conditional annotations**: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc.
- **Auto-configuration registration**: Add class to `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (not `spring.factories` for Spring Boot 3.x).
- **Testing**: Use `ApplicationContextRunner` for fine‑grained auto-configuration testing.
- **Logging**: Use SLF4J. Avoid `System.out`.

## Testing Tips
- **Unit tests**: Use `@ExtendWith(SpringExtension.class)` or `@SpringBootTest` for integration.
- **Auto-configuration tests**: Use `ApplicationContextRunner` from `spring-boot-test`.
  ```java
  new ApplicationContextRunner()
      .withPropertyValues("debug=true")
      .withUserConfiguration(MyAutoConfiguration.class)
      .run(context -> { /* assertions */ });
  ```
- **Samples**: Each sample in `spring-boot-samples/` can be built and run individually.
- **Test coverage**: Aim for high coverage in auto-configuration; use `@EnableConfigurationProperties` to load specific properties.
- **Skipping tests**: Use `-x test` or `-DskipTests=true` for faster iteration.

## Common Workflows for AI Agents
- **Exploring auto-configuration**: Look for `@AutoConfiguration` classes. Each corresponds to a `spring.*` property namespace. Find relevant class by searching for property prefix or class name.
- **Adding a new starter**: Create a new module in `spring-boot-project/spring-boot-starters/` with a `build.gradle.kts` that aggregates dependencies. Optionally add a corresponding autoconfigure module.
- **Investigating an issue**: Use `git log --grep` and search for related classes. Run affected module tests. Examine actuator endpoints if runtime behavior is unclear.
- **Running the CLI**: `./gradlew :spring-boot-tools:spring-boot-cli:bootRun --args='init --list'` (in older versions, check current CLI entry point).
- **Checking documentation**: The `spring-boot-docs/src/docs/asciidoc` contains the Asciidoc source.

## Debugging and Troubleshooting
- Enable `--debug` flag in Spring Boot application: many auto-configuration report lines.
- Actuator `/actuator/conditions` endpoint shows auto-configuration results.
- Use `@EnableConfigurationProperties(SomeProperties.class)` to isolate property loading.
- For build issues, clean the local Maven cache: `rm -rf ~/.m2/repository/org/springframework/boot` (or `~/.gradle/caches/modules-2`).
- Use `./gradlew --stop` to kill any rogue Gradle daemons.

## Contributing
- **Sign the CLA** before submitting PRs.
- **Issue format**: Provide minimal reproducible sample, version info.
- **PR guidelines**: Keep changes focused. Update documentation and tests. Ensure all tests pass (`./gradlew build`).
- **Commit message style**: `Prefix: Short summary` (e.g., `Fix NPE in DataSourceAutoConfiguration`).

## Resources
- Official reference: https://docs.spring.io/spring-boot/docs/current/reference/
- API docs: https://docs.spring.io/spring-boot/docs/current/api/
- Wiki: https://github.com/spring-projects/spring-boot/wiki

Use this skill to efficiently navigate, modify, and discuss the Spring Boot codebase.

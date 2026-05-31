# Spring Boot Development Skill

This skill provides guidance for working with the [Spring Boot](https://github.com/spring-projects/spring-boot) codebase. It helps AI coding agents understand the project structure, common patterns, and workflows.

## Project Overview

Spring Boot is a framework for building production-ready Spring applications quickly. It provides auto-configuration, starters, production-ready features (actuator), and embedded servers.

## Repository Structure

- `spring-boot-project/` – Main source code, including:
  - `spring-boot` – Core framework (SpringApplication, etc.)
  - `spring-boot-autoconfigure` – Auto-configuration classes
  - `spring-boot-starters/*` – Dependency descriptors (starter poms/Gradle metadata)
  - `spring-boot-actuator` – Production-ready endpoints
  - `spring-boot-actuator-autoconfigure` – Auto-config for Actuator
  - `spring-boot-test` – Testing utilities
  - `spring-boot-devtools` – Developer tools
  - `spring-boot-dependencies` – BOM for dependency management
- `spring-boot-tests/` – Integration and smoke tests
- `build.gradle` / `settings.gradle` – Gradle multi-module build files

## Build System

- Use Gradle wrapper: `./gradlew` (Linux/macOS) or `gradlew.bat` (Windows)
- Common commands:
  - `./gradlew build` – Full build, including tests
  - `./gradlew test` – Run tests
  - `./gradlew publishToMavenLocal` – Publish to local Maven repo (SNAPSHOT)
  - `./gradlew spring-boot-project:spring-boot-autoconfigure:test` – Test a specific module
  - `./gradlew dependencies` – View dependency tree
- Java version: typically 17 or 21; check `javaVersion` in `gradle.properties`
- Code style: enforced by `spring-javaformat` plugin; run `./gradlew format` to apply
  - Import order: static imports first, then blank line, then all other imports in alphabetical order, then blank line, then `java.*`, `javax.*`, `jakarta.*`

## Key Workflows

### Adding a New Auto-Configuration
1. Identify the auto-configuration package: `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/<category>/`.
2. Create a class annotated with `@Configuration` and conditional annotations (e.g., `@ConditionalOnClass`, `@ConditionalOnMissingBean`)
3. Register the class in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (or `spring.factories` for older versions)
4. Write tests in the corresponding test source set using `ApplicationContextRunner` or `@SpringBootTest`
5. Update the auto-configuration module’s `build.gradle` if new optional dependencies are needed

### Modifying a Starter
- Starters are located in `spring-boot-project/spring-boot-starters/<starter-name>/`
- Each starter is a minimal POM/Gradle build that brings together dependencies (auto-configuration module + third-party libraries)
- If you add a new auto-configuration that should be part of a starter, add the dependency to the starter’s `build.gradle`

### Dependency Version Management
- Versions of third-party libraries are declared in `spring-boot-dependencies/build.gradle` (or the parent `build.gradle` for non-BOM in older versions)
- To upgrade a dependency, update the version property usually found in `gradle.properties` (e.g., `jackson.version`, `tomcat.version`)

### Running Specific Tests
- Use Gradle test filtering: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests "*DataSourceAutoConfigurationTests"`
- For integration tests requiring a Docker environment, ensure Docker is running (TestContainers is used extensively)

## Common Patterns

- **Auto-configuration conditions:** `@ConditionalOnClass`, `@ConditionalOnWebApplication`, `@ConditionalOnProperty`, etc.
- **Configuration properties:** Use `@ConfigurationProperties("prefix")` and enable via `@EnableConfigurationProperties`
- **Testing:** Use `ApplicationContextRunner` for unit-testing auto-configuration; `@SpringBootTest` for integration; TestContainers for database/service dependencies
- **Gradle plugins:** The build uses custom plugins (`org.springframework.boot.spring-dependency-management`, `org.springframework.boot.spring-module`) for consistent dependency management and publishing

## Contributing

- The project uses GitHub for issues and pull requests
- Adhere to the [Spring Code of Conduct](https://spring.io/code-of-conduct)
- Sign commits? Not mandatory but encouraged
- Large changes may require discussion via GitHub issue first

## Useful Resources

- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot GitHub repository](https://github.com/spring-projects/spring-boot)
- [Spring Boot issue tracker](https://github.com/spring-projects/spring-boot/issues)
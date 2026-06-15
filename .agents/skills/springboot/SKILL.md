# Spring Boot Repository Skill

This skill guides AI coding agents working within the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. It covers key workflows, build commands, and contribution patterns.

## Repository Structure

- `spring-boot-project/` – main source code, organized as a Gradle multi-project:
  - `spring-boot/` – core Spring Boot module (SpringApplication, embedded servers, etc.)
  - `spring-boot-autoconfigure/` – auto-configuration classes registered via `spring.factories`
  - `spring-boot-actuator/` / `spring-boot-actuator-autoconfigure/` – production-ready features
  - `spring-boot-starters/` – starter POMs (e.g., `spring-boot-starter-web`, `spring-boot-starter-data-jpa`)
  - `spring-boot-test/` – test support, `@SpringBootTest`, etc.
  - `spring-boot-tools/` – Maven/Gradle plugins, `spring-boot-loader`, `spring-boot-properties-migrator`
  - `spring-boot-docs/` – reference documentation in Asciidoctor
  - `spring-boot-dependencies/` – curated dependency BOM
- `spring-boot-tests/` – large-scale integration tests (deployments, WAR, Gradle/Maven builds)
- `spring-boot-samples/` – archaic samples (deprecated, many removed; refer to guides instead)
- Top-level `build.gradle` (Kotlin DSL) defines all modules and build conventions.

## Build Essentials

- **Gradle Wrapper**: Use `./gradlew` (Unix) or `gradlew.bat` (Windows). Java 17+ required.
- **Full build without tests**: `./gradlew build -x check`
- **Full build with tests**: `./gradlew build`
- **Run tests for a specific module**: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- **Run a single test class**: `./gradlew :spring-boot-project:spring-boot:test --tests 'org.springframework.boot.SpringApplicationTests'`
- **Run code formatting (Eclipse Code Formatter)**: `./gradlew format` (auto-applied via pre-commit hook)
- **Generate spring-configuration-metadata.json**: auto during build; run `:spring-boot-project:spring-boot-autoconfigure:compileJava` to update.

## Development Workflow

1. **Decide where a change belongs**:
   - New auto-configuration → `spring-boot-autoconfigure`
   - New actuator endpoint → `spring-boot-actuator` + `spring-boot-actuator-autoconfigure`
   - Starter adjustments → `spring-boot-starters`
   - Build plugin changes → `spring-boot-tools`
   - Documentation → `spring-boot-docs`

2. **Coding and testing**:
   - All modules follow standard Spring Boot coding style (see `CONTRIBUTING.adoc`).
   - Tests are JUnit Jupiter. Use `@SpringBootTest` sparingly in autoconfigure tests; prefer `ApplicationContextRunner` provided by `spring-boot-test-autoconfigure`.
   - When adding new configuration properties, annotate immutable `@ConfigurationProperties` classes with `@ConstructorBinding` and register via `@EnableConfigurationProperties`. Generate metadata with `spring-boot-configuration-processor` (already configured).

3. **Verify the build**: Run `./gradlew build` in the root. For a focused check, build the affected module plus its tests.

4. **Update documentation**:
   - Reference docs live in `spring-boot-docs/src/docs/asciidoc/`. Edit `.adoc` files and check rendering locally with `./gradlew :spring-boot-project:spring-boot-docs:asciidoctor`.

5. **Contribution guidelines**: Consult `CONTRIBUTING.adoc` for PR expectations, commit message format (e.g., "GH-1234 ..."), and sign-off requirements.

## Common Patterns and Pitfalls

- **Auto-configuration registration**: Add the class to `META-INF/spring.factories` under `org.springframework.boot.autoconfigure.EnableAutoConfiguration`. Be careful with ordering – use `@AutoConfigureBefore`/`@AutoConfigureAfter`.
- **Conditional annotations**: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` are widely used. Prefer class conditions for optional dependencies.
- **Version management**: All dependency versions are managed by `spring-boot-dependencies` BOM. When adding a supported library, update `spring-boot-dependencies.gradle` with version constraints and consider alignment with the Spring Boot version policy.
- **Embedded servers**: Changes to embedded Tomcat/Jetty/Undertow are in `spring-boot` module under `org.springframework.boot.web.embedded.*`.
- **Deprecation**: When renaming properties, use `spring-boot-properties-migrator` to guide migration. Mark old properties deprecated in IDE metadata.
- **Backward compatibility**: Avoid breaking public APIs, especially in autoconfigure and core. If necessary, discuss on the issue tracker.
- **Testing conventions**: Tests classes like `AutoConfigurationTest` verify that conditions are met and beans are created. Use `ApplicationContextRunner` from `test-autoconfigure` for concise tests.

## Quick Reference

- **Where autoconfiguration lives**: `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`
- **Where starters are defined**: `spring-boot-project/spring-boot-starters/`
- **Where actuator endpoints live**: `spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/`
- **Where documentation is**: `spring-boot-project/spring-boot-docs/src/docs/asciidoc/`

Use this skill as a starting point for contributions to Spring Boot – it helps locate the right code and follow project conventions.
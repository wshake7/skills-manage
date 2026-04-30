# Spring Boot Framework Skill

## Overview
Guide for working with the Spring Boot framework repository (`spring-projects/spring-boot`). Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications.

## Repository Structure
The repository is a multi-module Gradle project.

- **Root**: `settings.gradle` defines all subprojects.
- **core library**: `spring-boot-project/` contains the main framework modules:
  - `spring-boot` – core API, SpringApplication, etc.
  - `spring-boot-autoconfigure` – auto-configuration support
  - `spring-boot-starters` – all starter POMs
  - `spring-boot-actuator` – production-ready features
  - `spring-boot-devtools` – developer tools
  - `spring-boot-test` / `spring-boot-test-autoconfigure` – testing support
  - and more (loader, tools, etc.)
- **Integration & smoke tests**: `spring-boot-tests/` and `spring-boot-smoke-tests/`
- **Documentation**: `spring-boot-docs/` (Asciidoctor)
- **BuildSrc**: custom Gradle plugins and conventions

## Building the Project

- **Use the Gradle wrapper** (`gradlew` or `gradlew.bat`).
- **Full build** (incl. tests): `./gradlew build`
- **Skip tests**: `./gradlew build -x test`
- **Quick compile/check**: `./gradlew assemble`
- **Run specific module tests**: 
  `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- **Install to local Maven repo**: `./gradlew publishToMavenLocal`
- **Formatting**: Code is formatted with Spring JavaFormat, applied automatically on build.

## Key Workflows

### Locating Auto-Configuration
All auto-configuration classes live under:
`spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`

- Organized by technology: `web/servlet`, `data/jdbc`, `data/jpa`, `security`, etc.
- Each auto-configuration class uses `@AutoConfiguration` (or `@Configuration`), conditional annotations (`@ConditionalOnClass`, `@ConditionalOnBean`, etc.) to activate only when needed.
- Registration: Since Spring Boot 2.7/3.0, auto-configuration is registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` file (per module). Legacy: `spring.factories` with `EnableAutoConfiguration` key (still supported for compatibility).

### Adding a New Starter or Auto-Configuration
1. Determine if the starter needs a new module or can be added to an existing one.
2. If new module:
   - Create directory under `spring-boot-project/` (e.g., `spring-boot-starter-mylib`).
   - Create `build.gradle` applying `org.springframework.boot.starter` convention plugin and adding dependencies.
   - If auto-configuration is needed, also create an `autoconfigure` module (e.g., `spring-boot-autoconfigure-mylib`).
3. In the autoconfigure module:
   - Implement the auto-configuration class with conditions.
   - Register it in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
   - Add any `@ConfigurationProperties` with `@EnableConfigurationProperties`.
4. Add the starter module to `settings.gradle` and the `spring-boot-starters` dependency management.
5. Write integration tests in `spring-boot-tests/spring-boot-smoke-tests/` or the autoconfigure module's test.

### Testing Strategies
- Use `@SpringBootTest` for integration tests, often against a `@SpringBootApplication` test config.
- Use test slices (`@WebMvcTest`, `@DataJpaTest`, etc.) for focused testing without loading full context.
- Auto-configuration tests are typically in `spring-boot-autoconfigure` under `src/test/java/.../autoconfigure/`, using `ApplicationContextRunner` to assert that beans are created/excluded based on conditions.
- Smoke tests demonstrate real-world usage and run during CI.

### Contributing
- Read `CONTRIBUTING.adoc` (root).
- Sign the Contributor License Agreement (CLA) if needed.
- Open an issue to discuss changes before submitting significant PRs.
- Adhere to code style (Spring JavaFormat/Idea formatter files provided).
- Commit message format: concise, referencing issue number (e.g., `Closes gh-12345`).

### Debugging / Troubleshooting
- Enable `--debug` flag when starting a Boot application for auto-configuration report.
- Use `spring-boot-devtools` module for automatic restarts and enhanced logging.
- Build failures often due to toolchain misconfiguration (JDK version) – check `.ci.yml` for required JDK.

## Common Commands

- `./gradlew clean build` – full build with tests (can be time-consuming).
- `./gradlew spring-boot-project:spring-boot-autoconfigure:test --tests "*WebMvcAutoConfigurationTests"` – run specific test.
- `./gradlew javadoc` – generate Javadoc.
- `./gradlew distribution` – build distribution zip (like those published on GitHub releases).

## Notes for AI Agents
- Always use the Gradle wrapper; never use a system Gradle.
- The project uses a custom `spring-dependency-management` plugin; BOMs are generated.
- Documentation is built with Asciidoctor; see `spring-boot-docs/` and `gradle/docs.gradle`.
- Dependency versions are managed via a BOM (`spring-boot-dependencies` module).
- When modifying auto-configuration, ensure backward compatibility and update corresponding properties in `spring-configuration-metadata.json` (generated).
- The CI pipeline uses GitHub Actions; workflows are in `.github/workflows`.

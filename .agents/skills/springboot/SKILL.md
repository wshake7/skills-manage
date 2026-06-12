# Spring Boot Skill

## Overview
This skill helps an AI coding agent work effectively with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. Spring Boot is the leading framework for building production-ready Spring applications. The repository contains the core framework, auto-configuration, starters, tools, and documentation.

## Repository Structure
- `spring-boot-project/` – Core modules:
  - `spring-boot` – Base project, runner, banner, logging
  - `spring-boot-autoconfigure` – Auto-configuration classes
  - `spring-boot-starters/` – Convenience starter POMs
  - `spring-boot-actuator` – Production monitoring & management
  - `spring-boot-actuator-autoconfigure` – Auto-config for Actuator
  - `spring-boot-devtools` – Developer tools
  - `spring-boot-docker-compose` – Docker Compose support
  - `spring-boot-test` – Testing utilities
  - `spring-boot-test-autoconfigure` – Auto-config for tests
  - `spring-boot-tools/` – Maven/Gradle plugins, build helpers
- `spring-boot-tests/` – Integration and compatibility tests
- `build.gradle` / `settings.gradle` – Gradle build definition
- `gradlew` / `gradlew.bat` – Gradle wrapper
- `CONTRIBUTING.adoc` – Contribution guidelines
- `SUPPORT.adoc` – Support policy

## Building and Testing
- Use the Gradle wrapper: `./gradlew build` compiles and tests all modules.
- Run a specific test: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests "*SomeTest"`.
- Run all tests: `./gradlew test`.
- Build without tests: `./gradlew build -x test`.
- Build the project website: `./gradlew asciidoctor` (output in `spring-boot-project/spring-boot-docs/build/docs/`).
- Generate a project report: `./gradlew projectReport` (see `build/reports/project-report.html`).

## Development Workflows
1. **Auto-configuration changes**: Add/modify classes in `spring-boot-project/spring-boot-autoconfigure/`. Update `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` if adding new configs. Add tests under the test source set with `@SpringBootTest` or mock environments.
2. **Adding a new starter**: Create a new module under `spring-boot-project/spring-boot-starters/`. Include a `pom.xml` with the necessary dependencies. Follow the naming convention `spring-boot-starter-{technology}`.
3. **Actuator endpoint**: Implement an `@Endpoint` class in `spring-boot-project/spring-boot-actuator`. Register it in `META-INF/spring.factories` under `org.springframework.boot.actuate.autoconfigure.web.ManagementContextConfiguration`.
4. **Upgrading dependency versions**: Edit `spring-boot-project/spring-boot-dependencies/build.gradle` in the `dependencyManagement` section.
5. **Testing framework integrations**: Extend `spring-boot-project/spring-boot-test-autoconfigure` to provide new `ApplicationContextRunner` configurations.

## Contribution Guidelines
- Create issues/PRs on GitHub. Refer to `CONTRIBUTING.adoc` for details.
- Code style: Follow Spring Java Format. Use `./gradlew format` to apply formatting.
- Sign the contributor agreement if not a Spring committer.
- Provide tests for all changes. Ensure existing tests pass.

## Key Concepts
- **Auto-configuration**: Conditional configuration classes (`@AutoConfiguration`) are applied based on classpath presence, beans, and properties.
- **Starters**: Opinionated sets of dependencies for common tech stacks (e.g., `spring-boot-starter-web`).
- **Embedded servers**: Tomcat, Jetty, Undertow—configure via `application.properties`.
- **Actuator**: Exposes operational endpoints (health, metrics, info) over HTTP or JMX.
- **DevTools**: Automatic restart, live reload, and properties defaults for development.

## Useful Commands
```bash
# Build entire project
./gradlew build

# Run tests for a specific module
./gradlew :spring-boot-project:spring-boot-actuator:test

# Check dependency versions
./gradlew dependencies --configuration compileClasspath

# Generate and view project report
./gradlew projectReport && open build/reports/project-report.html
```

This skill enables an AI agent to navigate the Spring Boot repository, perform common development tasks, and understand its module organization and build system.
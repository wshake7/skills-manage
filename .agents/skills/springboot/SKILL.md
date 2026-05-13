# Spring Boot Development Skill

This skill provides essential guidance for AI coding agents working on the Spring Boot project.
Use it to understand the codebase, run builds, execute tests, and contribute effectively.

## Overview
Spring Boot simplifies the creation of production-grade Spring applications by providing auto-configuration, embedded servers, and opinionated defaults.
This repository is the home of the Spring Boot framework itself.

## Repository Structure
- Root project contains Gradle wrapper (`gradlew`), build scripts, and documentation.
- Main source code is under `spring-boot-project/` with sub-modules like:
  - `spring-boot` – core APIs and runtime.
  - `spring-boot-autoconfigure` – auto-configuration classes.
  - `spring-boot-starters` – opinionated dependency sets.
  - `spring-boot-actuator`, `spring-boot-devtools`, `spring-boot-test`, etc.
- Integration samples: `spring-boot-tests`.
- Documentation: `src/docs/asciidoc`.

## Build and Test
Use the Gradle wrapper (no local Gradle installation needed).

| Task | Command |
|------|---------|
| Full build and test | `./gradlew build` |
| Run all checks (tests, style, etc.) | `./gradlew check` |
| Quick compilation without tests | `./gradlew classes` |
| Run a specific module’s tests | `./gradlew :spring-boot-project:spring-boot:test --tests <FQN>` |
| Build docs and test them | `./gradlew docsTest` |
| Run sample applications | `./gradlew bootRun` in sample directories |

### Debugging
- Attach a remote debugger: `./gradlew bootRun --debug-jvm` (defaults to port 5005).
- Tests can be debugged with similar JVM arguments.

## Contribution Guidelines
- Read `CONTRIBUTING.adoc` in the root.
- Sign the CLA as explained in the contributing guide.
- Code style follows Spring Framework conventions (checkstyle is enforced by the build).
- Unit tests use JUnit 5 and AssertJ; mock with Mockito.
- Integration tests often use `@SpringBootTest` and may require Docker (e.g., Testcontainers).
- Squash commits and provide clean commit messages when submitting PRs.

## Key Concepts
### Autoconfiguration
Auto-configuration classes are under `spring-boot-autoconfigure`.
They use `@Conditional` annotations and are registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.

### Dependency Management
Spring Boot manages dependency versions via the `spring-boot-dependencies` BOM.
When adding dependencies in the project modules, prefer referencing properties like `${spring-framework.version}`.

### Starter Modules
Starters are simple modules that pull in transitive dependencies for common use cases.
They should not contain code; they just declare dependencies.

## Common Workflows
### Adding a New Auto-Configuration
1. Create an auto-configuration class with appropriate `@Conditional` logic.
2. Add the class to the `AutoConfiguration.imports` file.
3. Write tests that verify the behaviour under different conditions.
4. Run `./gradlew :spring-boot-project:spring-boot-autoconfigure:check` to validate.

### Modifying Core APIs
- Changes to `spring-boot` module may affect many downstream modules.
- Always run the full `build` to detect compilation breaks.
- Pay attention to binary compatibility if this is a released version.

### Documentation
Docs are written in Asciidoctor. Preview with `./gradlew asciidoctor` in `docs/`.
API changes may require updates to reference docs.

## Troubleshooting
- **Out-of-memory during build**: Increase Gradle heap: `export GRADLE_OPTS="-Xmx2g"`.
- **Local caching issues**: Run `./gradlew clean build`.
- **Testcontainers not working**: Ensure Docker daemon is running and accessible.
- **IDE import**: Use `./gradlew idea` or `./gradlew eclipse` to generate project files.
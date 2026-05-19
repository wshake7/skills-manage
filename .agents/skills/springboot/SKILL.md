# Spring Boot Repository Skill

## Overview
This skill provides guidance for working in the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. It covers building, testing, IDE setup, contribution workflow, and coding conventions to help AI coding agents contribute effectively.

## Project Structure
- `spring-boot-project/` – core framework modules (spring-boot, autoconfigure, actutor, etc.)
- `spring-boot-tests/` – integration and deployment tests
- `spring-boot-docs/` – reference documentation (Asciidoctor)
- `spring-boot-system-tests/` – system tests
- `build.gradle` – root build script (Gradle)
- `gradle/`, `gradlew` – Gradle wrapper

Modules under `spring-boot-project/`:
- `spring-boot` – main library
- `spring-boot-autoconfigure` – auto-configuration
- `spring-boot-actuator` – production-ready features
- `spring-boot-actuator-autoconfigure`
- `spring-boot-test` / `spring-boot-test-autoconfigure`
- `spring-boot-loader` / `spring-boot-loader-tools`
- `spring-boot-devtools`
- `spring-boot-starters` – starter POMs (e.g., `spring-boot-starter-web`)
- `spring-boot-cli`
- `spring-boot-properties-migrator`
- `spring-boot-dependencies` – BOM

## Building and Testing
- Java version: **Java 17** (or later) is required.
- Use the Gradle wrapper: `./gradlew build` to compile and run all tests.
- To skip tests: `./gradlew build -x test`
- Run a specific module’s tests: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Run a single test: `./gradlew :spring-boot-project:spring-boot:test --tests "org.springframework.boot.SampleTest"`
- Continuous build: `./gradlew build --continuous`
- Build without documentation: `./gradlew build -x asciidoctor`

## Contribution Workflow
1. Fork the repository and clone your fork.
2. Create a feature branch: `git checkout -b gh-12345` (reference issue number if applicable).
3. Make changes following coding conventions.
4. Run tests: `./gradlew build` (and fix any failures).
5. Add tests for new functionality and update existing tests if necessary.
6. Commit with a descriptive message following the [Spring Framework commit conventions](https://github.com/spring-projects/spring-framework/wiki/Commit-Conventions) (50/72 rule, imperative mood, optionally reference issue).
7. Push and open a pull request against `main`.

## Coding Conventions
- Follow the [Spring Framework Code Style](https://github.com/spring-projects/spring-framework/wiki/Code-Style).
- Use 1 tab for indentation (tab size = 4).
- Line width up to 120 characters.
- No trailing whitespace.
- Use `final` for method parameters and local variables where applicable.
- Add `@author` tags only when making significant contributions.
- Avoid star imports.
- Use meaningful variable names.
- Javadoc is required for all public API classes and methods; follow Spring’s Javadoc conventions.

## Commit Message Format
- The first line should be a short summary (max 50 characters) in imperative mood (e.g., “Fix NPE in …”).
- Leave a blank line before the body.
- Body can explain what and why, not how.
- Reference the GitHub issue at the end, e.g., “Closes gh-12345”.
- Use `See gh-12345` for partial fixes.

## Running Checks
- Code formatting: project uses [Spring Java Format](https://github.com/spring-io/spring-javaformat) Gradle plugin; formatting errors are checked during build.
- To apply formatting: `./gradlew format` (if configured; otherwise rely on IDE). Check with `./gradlew checkFormat` (if available).
- Checkstyle: `./gradlew checkstyleMain checkstyleTest` (if configured).

## IDE Setup
- IntelliJ IDEA is the recommended IDE.
- Import the project as a Gradle project.
- Enable annotation processing.
- Use the code style settings from `https://github.com/spring-projects/spring-framework/blob/main/ide/spring-framework-code-style.xml` (for Eclipse or IntelliJ via Eclipse Code Formatter plugin).
- Ensure IDE compiler compliance level is set to Java 17.

## Documentation
- Reference docs are written in Asciidoctor; source: `spring-boot-docs/src/docs/asciidoc/`.
- Build docs: `./gradlew asciidoctor`.
- Preview docs locally: `./gradlew asciidoctor` then open `build/docs/html5/index.html`.

## Useful Gradle Tasks
- `./gradlew clean` – clean build artifacts.
- `./gradlew build` – full build with tests and docs.
- `./gradlew test` – run all tests (cached).
- `./gradlew check` – run all checks (tests + style).
- `./gradlew publishToMavenLocal` – publish artifacts to local Maven repository for testing.
- `./gradlew dependencyInsight --dependency <name>` – investigate dependency versions.

## Troubleshooting
- If you get compilation errors about missing classes, try `./gradlew clean` then build.
- Tests may fail due to port conflicts; ensure no other services are running on ports 8080, 8081, etc.
- Use `./gradlew build -x test` to bypass tests if only verifying compilation.
- For IDE issues, invalidate caches and restart.

## Additional Resources
- [Contributing to Spring Boot](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc)
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/)
- [Spring Framework Wiki](https://github.com/spring-projects/spring-framework/wiki)

# Spring Boot Codebase Skill

## Project Overview
Spring Boot is a convention-over-configuration framework for building Spring applications. The codebase is a large multi-module Gradle project.
- Language: Java 17+
- Build Tool: Gradle (use `./gradlew`)
- Main modules under `/spring-boot-project/`: `spring-boot`, `spring-boot-autoconfigure`, `spring-boot-actuator`, `spring-boot-starters`, `spring-boot-test`, etc.

## Key Modules
- `spring-boot` – Core API (`SpringApplication`, environment, etc.)
- `spring-boot-autoconfigure` – `@Conditional` auto-configuration classes
- `spring-boot-starters` – Aggregator POMs for dependency management
- `spring-boot-actuator` – Production-ready features
- `spring-boot-test` – Test utilities and annotations
- `spring-boot-docs` – Reference documentation (Asciidoc)

## Building and Testing
- Build entire project: `./gradlew build`
- Run all tests: `./gradlew test`
- Run tests for a module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Build without tests: `./gradlew build -x test`
- Run a specific test: `./gradlew :module:test --tests "com.example.MyTest"`
- Clean build: `./gradlew clean build`
- Check code style: `./gradlew check` (includes Checkstyle and spring-javaformat)

## Code Conventions
- Follow Spring Framework coding style; enforced via Checkstyle and spring-javaformat plugin.
- Commit messages use conventional format (e.g., "feat: Add ...").
- All commits must have DCO sign-off (`-s` flag).
- Branch strategy: `main` for active development, `2.7.x` / `3.0.x` for maintenance.

## Development Workflow
1. Fork the repository.
2. Create a feature branch from `main`.
3. Make changes, write/update tests.
4. Run `./gradlew check` to ensure style compliance.
5. Commit with sign-off: `git commit -s -m "type: description"`.
6. Push and open a pull request to `spring-projects/spring-boot:main`.

## Important Files
- `build.gradle` – Root build configuration and conventions.
- `gradle.properties` – Gradle and project settings.
- `gradle/` – Wrapper and custom plugins.
- `ci/` – GitHub Actions CI scripts.
- `src/checkstyle/` – Checkstyle configuration.

## Common Tasks for Contributors
**Add a new auto-configuration:**
- Create a class in `spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/` with `@Configuration` and relevant `@Conditional*` annotations.
- Register the class in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
- Add tests under the corresponding test source root.

**Modify a starter:**
- Edit dependencies in `spring-boot-starters/<starter-name>/build.gradle`.
- Verify transitive dependencies: `./gradlew :spring-boot-project:spring-boot-starters:<starter-name>:dependencies`.

**Update documentation:**
- Edit Asciidoc files in `spring-boot-docs/src/docs/asciidoc/`.
- Preview changes locally with `./gradlew asciidoctor`.

## Debugging and Diagnostics
- Enable Gradle debug logging: `./gradlew build --debug`
- Run tests with a specific Spring profile: `./gradlew test -Dspring.profiles.active=dev`
- Integration tests often require Docker (Testcontainers).
- List all modules: `./gradlew projects`

## Additional Resources
- Read `CONTRIBUTING.md` in the repository root for full guidelines.
- Use `./gradlew help` to see available tasks.
- The [Spring Boot reference documentation](https://docs.spring.io/spring-boot/docs/current/reference/) is invaluable.
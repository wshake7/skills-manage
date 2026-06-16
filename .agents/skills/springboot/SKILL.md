# Spring Boot Skill

## Overview
Spring Boot is the convention-over-configuration framework for building production-ready Spring applications. This skill helps navigate and contribute to the Spring Boot codebase.

## Prerequisites
- JDK 17+ (Spring Boot 3.x). Check the `sourceCompatibility` in `build.gradle` for the exact version.
- Gradle wrapper is used (no global Gradle installation needed).

## Project Structure
- **`spring-boot-project/`** – main source code, organized into modules:
  - `spring-boot` – core library (SpringApplication, Banner, etc.)
  - `spring-boot-autoconfigure` – auto-configuration classes
  - `spring-boot-actuator` / `spring-boot-actuator-autoconfigure` – production-ready features
  - `spring-boot-starters` – starter POMs
  - `spring-boot-test` / `spring-boot-test-autoconfigure` – test support
  - `spring-boot-devtools` – developer tools
  - `spring-boot-docker-compose` – Docker Compose integration
  - `spring-boot-tools` – CLI, Maven/Gradle plugins, etc.
- **`spring-boot-docs/`** – reference documentation (Asciidoc)
- **`spring-boot-tests/`** – integration/smoke tests
- **`build.gradle`** – root build script; `settings.gradle` lists all modules

## Build Commands
- Full build including tests: `./gradlew build`
- Compile and run checks: `./gradlew assemble`
- Skip tests: `./gradlew build -x test` or use `-x integrationTest` for faster iteration
- Run all tests: `./gradlew test`
- Run tests for a specific module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Generate docs: `./gradlew asciidoctor`
- Install to local Maven repo: `./gradlew publishToMavenLocal`
- Check formatting: `./gradlew format` (uses `spring-javaformat`)

## Running Tests
- Unit tests are in `src/test/java` (JUnit 5).
- Integration tests may use `@SpringBootTest`, embedded servers, or test slices.
- To debug a failing test, run it directly from your IDE or with `./gradlew :module:test --tests "com.example.MyTest"`
- Some tests require Docker; disable with `-PskipDocker` or `-x integrationTest`.

## Code Conventions
- **Formatting:** Project uses Spring Java Format. Run `./gradlew format` before committing. IDE plugins are available.
- **Imports:** No wildcard imports except for static imports. Order: all static imports, then `java.*`, `javax.*`, all other, `org.springframework.*`.
- **Null-safety:** Use `@Nullable` and `@NonNullApi` (package level) as appropriate.
- **Javadoc:** Required for public API.

## Key Contribution Workflow
1. Fork and clone the repository.
2. Read `CONTRIBUTING.adoc` for guidelines, including signing the contributor agreement.
3. Create a feature branch.
4. Make changes, add tests, update docs if necessary.
5. Run `./gradlew build` to ensure everything compiles and tests pass.
6. Run `./gradlew format` to fix formatting.
7. Commit with a descriptive message following [Spring conventions](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Commit-Style).
8. Push and open a pull request against the `main` branch.

## Adding a New Auto-Configuration
1. Define a configuration class in `spring-boot-autoconfigure` under the appropriate package (e.g., `org.springframework.boot.autoconfigure.myfeature`).
2. Annotate with `@AutoConfiguration` (or `@Configuration` with `@Conditional*` annotations).
3. Add an `@EnableConfigurationProperties` to bind external properties.
4. Create a `spring.factories` entry in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` listing the configuration class.
5. Add a test class (usually in the same module’s test tree) using `ApplicationContextRunner` to verify behavior.
6. If the feature requires a new starter, create a minimal module in `spring-boot-starters`.

## Finding Relevant Files
- **Auto-configuration classes:** `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`
- **Property metadata:** `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/` (each package often has a `*Properties.java`)
- **Integration tests:** `spring-boot-tests/spring-boot-smoke-tests/` (many independent sample apps)
- **Build logic:** `build.gradle`, `gradle/` directory, `spring-boot-project/spring-boot-tools/spring-boot-gradle-plugin`
- **Documentation sources:** `spring-boot-docs/` (`.adoc` files)

## Common Pitfalls
- **Missing `@AutoConfiguration` import:** Ensure the class is listed in `spring.factories` (or the newer `AutoConfiguration.imports` file).
- **Dependency versions:** Managed via `spring-boot-dependencies` BOM. Do not hardcode versions unless necessary.
- **Gradle configuration:** Some modules use custom plugins; check `build.gradle` of the module you are changing.
- **Integration tests in separate sourceSet:** Many smoke tests have their own build script and may require special commands to run (e.g., `./gradlew :spring-boot-tests:spring-boot-smoke-test-xxx:build`).

## Additional Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/)
- [CONTRIBUTING.adoc](https://github.com/spring-projects/spring-boot/blob/main/CONTRIBUTING.adoc)
- [Issue Tracker](https://github.com/spring-projects/spring-boot/issues)

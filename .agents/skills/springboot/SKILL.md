# Spring Boot Repository Skill

## Overview
This skill provides guidance for working with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository, the source code of Spring Boot. It helps you understand the project layout, build and test the framework, and contribute effectively.

## Project Structure
The repository is a multi-module Gradle project. Key directories:

```
spring-boot-project/          # Core Spring Boot modules
  spring-boot/                # Core library (SpringApplication, etc.)
  spring-boot-autoconfigure/  # Auto-configuration classes
  spring-boot-actuator/       # Actuator endpoints
  spring-boot-actuator-autoconfigure/
  spring-boot-devtools/       # Developer tools
  spring-boot-starters/       # All starter POMs (e.g., web, data-jpa)
  spring-boot-test/           # Test utilities
  spring-boot-tools/          # Maven/Gradle plugins
spring-boot-tests/            # Integration tests
  spring-boot-smoke-tests/    # Smoke tests (sample applications)
spring-boot-cli/              # Command-line interface
spring-boot-docs/             # Reference documentation sources
```

Auto-configuration classes are registered in:
- **Before 2.7:** `META-INF/spring.factories` under `org.springframework.boot.autoconfigure.EnableAutoConfiguration`
- **2.7+**: `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (one class per line)

## Building and Testing
Use the Gradle wrapper (`gradlew` on Linux/macOS, `gradlew.bat` on Windows) from the repo root.

- **Full build (including tests):** `./gradlew build`
- **Build without tests:** `./gradlew build -x test`
- **Build a specific module:** `./gradlew :spring-boot-project:spring-boot:build`
- **Run all tests:** `./gradlew test`
- **Run tests for a module:** `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- **Publish to local Maven repository:** `./gradlew publishToMavenLocal`
- **Check dependency updates:** `./gradlew dependencyUpdates`

Tests often require Docker for testcontainers integration; ensure Docker is running if testing database starter auto-configuration.

## Key Workflows

### Adding a New Auto-Configuration Class
1. Create a configuration class in `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`. Use appropriate conditionals (`@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc.).
2. Define the corresponding properties class with `@ConfigurationProperties` (prefix, documentation).
3. Register the auto-configuration:
   - For **Boot 3.x** (current main): add an entry to `spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
4. Write unit/integration tests in the `src/test/java/` mirror structure. Use `@SpringBootTest(classes = ...)` or `ApplicationContextRunner` from `spring-boot-test-autoconfigure`.
5. If there’s a starter needed, add a new module under `spring-boot-starters/` with appropriate dependencies (the library and the autoconfigure module).
6. Update documentation in `spring-boot-docs/src/main/asciidoc/`.

### Adding a New Actuator Endpoint
- Write the endpoint class annotated with `@Endpoint` in `spring-boot-project/spring-boot-actuator`.
- If auto-configuration is required, add similar steps in `spring-boot-actuator-autoconfigure`.
- Expose metrics, health, info via `Micrometer` and `HealthIndicator` patterns.

### Running Smoke Tests
Smoke tests are full Spring Boot applications in `spring-boot-tests/spring-boot-smoke-tests/`. To run a specific one:
```bash
cd spring-boot-tests/spring-boot-smoke-tests/spring-boot-smoke-test-jetty
 ../../gradlew test
```
or from root:
```bash
./gradlew :spring-boot-tests:spring-boot-smoke-tests:spring-boot-smoke-test-jetty:test
```

### Understanding the Core `SpringApplication` Class
The entry point for bootstrapping any Spring Boot application. Key phases:
- Configure sources and environment.
- Create `ApplicationContext` type (reactive or servlet).
- Apply listeners and initializers.
- Run the application.
Look at `org.springframework.boot.SpringApplication` in `spring-boot` module.

## Contribution Guidelines
- Refer to `CONTRIBUTING.adoc` in the root for full guidelines.
- Code style follows the [Spring Framework](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Code-Style). Use `./gradlew format` to apply formatting.
- All changes should include appropriate tests. Build must pass `./gradlew check`.
- Sign-off is required (see the repository’s DCO).

## Important Change Notes (since Boot 3.x)
- Java baseline: Java 17.
- GAV moved from `org.springframework.boot` to `org.springframework.boot` with Jakarta EE 9+.
- `spring.factories` auto-configuration key replaced by `AutoConfiguration.imports`.
- Native images support via Spring AOT and GraalVM.
- The `@AutoConfigureBefore`/`@AutoConfigureAfter` annotations can be used to order configurations.

## Useful Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot API](https://docs.spring.io/spring-boot/docs/current/api/)
- [GitHub Repository Structure](https://github.com/spring-projects/spring-boot)

## Quick Commands Reference
| Task | Command |
|------|---------|
| Full build | `./gradlew build` |
| Skip tests | `./gradlew build -x test` |
| Local install | `./gradlew publishToMavenLocal` |
| Run a specific test class | `./gradlew :spring-boot-project:spring-boot:test --tests "*SpringApplicationTests"` |
| Format code | `./gradlew format` |
| Check style | `./gradlew checkFormat` |
| Generate docs | `./gradlew :spring-boot-docs:asciidoc` (output in `build/docs/`) |
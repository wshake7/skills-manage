# Spring Boot Codex Skill

## Purpose
Provide guidance for AI coding agents working with the Spring Boot repository, enabling efficient navigation, development, and contribution.

## Repository Structure Overview
- **spring-boot-project/**: Main source code, divided into:
  - `spring-boot`: Core module (SpringApplication, environment, web server, etc.)
  - `spring-boot-autoconfigure`: Auto-configuration classes (conditional beans, starters)
  - `spring-boot-actuator`: Production-ready features (health, metrics, endpoints)
  - `spring-boot-starters/`: Starter POMs that bundle dependencies
  - Other modules: `spring-boot-devtools`, `spring-boot-test`, `spring-boot-test-autoconfigure`, etc.
- **spring-boot-tools/**: Maven and Gradle plugins, build tooling (e.g., `spring-boot-maven-plugin`, `spring-boot-gradle-plugin`)
- **spring-boot-tests/**: Integration tests, smoke tests, deployment tests
- **spring-boot-docs/**: Reference documentation sources (Asciidoctor)
- **spring-boot-samples/**: Example applications demonstrating features

## Build & Test Commands
- **Full build**: `./gradlew build` (Gradle wrapper; requires Java 17+)
- **Core module build**: `./gradlew spring-boot-project:spring-boot:build`
- **Run all tests**: `./gradlew test`
- **Run a specific test class**: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests "org.springframework.boot.autoconfigure.condition.ConditionalOnClassTests"`
- **Build without tests**: `./gradlew assemble -x test`
- **Generate docs**: `./gradlew :spring-boot-docs:asciidoctor`
- **Check dependency updates**: `./gradlew dependencyUpdates`

## Common Development Tasks
### Adding a New Auto-Configuration
1. Locate relevant package under `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`.
2. Create a configuration class annotated with `@Configuration` and typically `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc.
3. Register the configuration in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3.x) or `spring.factories` (older versions).
4. Add corresponding `@ConfigurationProperties` if needed.
5. Add tests in the same autoconfigure module under `src/test/java/.../autoconfigure/` using `ApplicationContextRunner`.

### Adding a New Starter
- Add a new module under `spring-boot-project/spring-boot-starters/`.
- It should be a POM with the starter name, e.g., `spring-boot-starter-foo`.
- Include the necessary dependencies, typically the auto-configuration module and third-party library.

### Fixing a Bug
- Locate the relevant module (core, autoconfigure, web, etc.).
- Understand the behavior by looking at tests (often named `*Tests`).
- Write a failing test reproducing the bug, then fix.
- Ensure backward compatibility; Spring Boot is strict about not breaking existing users.

### Working with Tests
- **Unit Tests**: Use JUnit 5, often with `Mockito` for mocking.
- **Application Context Tests**: Use `org.springframework.boot.test.context.runner.ApplicationContextRunner` to load minimal contexts.
- **Web Tests**: `@SpringBootTest` with `webEnvironment` for full server testing, `MockMvc` for controller tests, `TestRestTemplate` for REST.
- **Test Utilities**: `OutputCaptureExtension` for capturing log output, `TestPropertyValues` for dynamic property overrides.

## Code Style & Conventions
- Follow Spring Framework code style (tab size 4, indent 4 spaces).
- Class names, method names, and variable names follow standard Java conventions.
- Use `@since` tags for new public elements.
- Javadoc on public API is mandatory.
- License header must be present (Apache 2.0).

## Useful Patterns
- **Auto-configuration ordering**: Use `@AutoConfigureBefore`/`@AutoConfigureAfter` to control order.
- **Conditional annotations**: `ConditionalOnClass`, `ConditionalOnMissingBean`, `ConditionalOnProperty`, `ConditionalOnWebApplication`, etc.
- **Property binding**: Use `@ConfigurationProperties` with `@ConstructorBinding` (recommended for immutable config) or JavaBean binding.

## Dependency Insights
- Spring Boot manages a curated set of dependencies via the `spring-boot-dependencies` BOM.
- When adding a new third-party library, consider adding it to the BOM (`spring-boot-project/spring-boot-dependencies/build.gradle`).

## Documentation
- New features must be documented in `spring-boot-docs/src/docs/asciidoc/` using Asciidoctor.
- Update relevant `.adoc` files (e.g., `howto.adoc`, `features/*.adoc`).

## Links
- Main repository: https://github.com/spring-projects/spring-boot
- Reference documentation: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
- Issue tracker: https://github.com/spring-projects/spring-boot/issues
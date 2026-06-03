# Spring Boot Codex Skill

Guidance for working with the Spring Boot framework repository: [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot).

## Repository Structure

- `spring-boot-project/` – Core framework: auto-configuration, starters, tools (Maven/Gradle plugins), actuator, devtools, test, loader, etc.
- `spring-boot-tests/` – Integration and smoke tests.
- `spring-boot-samples/` – Example applications.
- `buildSrc/` – Custom Gradle conventions.
- `ci/` – Continuous integration scripts.
- `gradle/` – Gradle wrapper.

## Build and Test

- Build everything: `./gradlew build`
- Build specific module: `./gradlew :spring-boot-project:spring-boot:compileJava`
- Run tests for a module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Check code style: `./gradlew checkstyleMain checkstyleTest`
- Publish to local Maven (snapshot): `./gradlew publishToMavenLocal`

## Development Workflow

1. Fork and clone the repository.
2. Create a branch from `main`.
3. Make changes following code style and conventions.
4. Add/update tests in the corresponding module’s `src/test`.
5. Run `./gradlew check` to run tests, Checkstyle, etc.
6. Ensure backward compatibility. Use `@Deprecated` if needed.
7. Commit with a meaningful message.
8. Submit a pull request against the `main` branch.

## Key Patterns

### Auto-configuration
- Located in `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`.
- Conditional on class presence, beans, properties (`@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`).
- Configuration properties class (e.g., `SomeProperties`) in the same package or in `*.context.properties`.
- Register via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` file.

### Starters
- Located in `spring-boot-project/spring-boot-starters/`.
- Minimal POM; just bring in required dependencies and auto-configuration.

### Actuator Endpoints
- In `spring-boot-project/spring-boot-actuator*`.
- Use `@Endpoint`, `@ReadOperation`, `@WriteOperation`.
- Auto-configuration in `spring-boot-actuator-autoconfigure`.

### Property Mapping
- Use `@ConfigurationProperties(prefix = "server")` on a class.
- Enable via `@EnableConfigurationProperties` or component scanning.
- Metadata generated via `spring-boot-configuration-processor` (optional).

## Useful Commands

- Generate project with Spring Initializr: not part of the repo, but `spring-boot-project/spring-boot-cli` has a `spring` CLI.
- Run a sample: `cd spring-boot-samples/spring-boot-sample-tomcat && ../../gradlew bootRun`
- Run single test: `./gradlew :spring-boot-project:spring-boot:test --tests "org.springframework.boot.SomeTest"`
- Debug Gradle build: `./gradlew build --debug` or `--info`.

## Important Files

- `CONTRIBUTING.adoc` – Contribution guidelines.
- `CODE_OF_CONDUCT.adoc`
- `gradle.properties` – Version numbers.
- `.github/ISSUE_TEMPLATE/` – Issue templates.
- `spring-boot-project/spring-boot-dependencies/build.gradle` – Dependency management.

## Tips for AI Assistants

- When generating code for an auto-configuration, always include `@AutoConfiguration(after = ...)` or `before` ordering hints.
- Use `@ConditionalOnWebApplication(type = ...)` for servlet/reactive distinction.
- Check existing auto-configurations for export patterns in `META-INF/spring/`.
- Prefer constructor injection and `@ConfigurationProperties` over field injection.
- When adding a new starter, ensure it’s listed in `spring-boot-starters/build.gradle`.
- Run `./gradlew spring-boot-project:spring-boot-tools:spring-boot-autoconfigure-condition-evaluator:test` ...
- Use `org.springframework.boot.test.autoconfigure.OverrideAutoConfiguration` for test slices.

## References

- [Spring Boot Reference Doc](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [Spring Boot API](https://docs.spring.io/spring-boot/docs/current/api/)
- [GitHub Issues](https://github.com/spring-projects/spring-boot/issues)
- [Stack Overflow Tag: spring-boot](https://stackoverflow.com/questions/tagged/spring-boot)
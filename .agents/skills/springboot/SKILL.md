# Spring Boot Codex Skill

Purpose: Guide an AI coding agent to effectively navigate, understand, and contribute to the Spring Boot framework (spring-projects/spring-boot).

## Repository Structure
- Root: Gradle multi-module build (`settings.gradle`, `build.gradle`).
- Main code: `spring-boot-project/`
  - `spring-boot/`: Core Spring Boot classes (`SpringApplication`, `SpringApplicationBuilder`, etc.)
  - `spring-boot-autoconfigure/`: Auto-configuration support (`spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`)
  - `spring-boot-starters/`: Starter POMs under sub-directories like `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, etc.
  - `spring-boot-actuator/` & `spring-boot-actuator-autoconfigure/`: Production-ready features.
  - `spring-boot-test/` & `spring-boot-test-autoconfigure/`: Testing support.
  - `spring-boot-devtools/`: Developer tools.
  - `spring-boot-docs/`: Asciidoctor documentation sources.
- Tests: Each module has its own `src/test` with unit and integration tests. Spring Boot tests often use `ApplicationContextRunner`, `WebApplicationContextRunner`, and `@SpringBootTest`.
- Samples: `spring-boot-samples/` (deprecated in some versions, replaced by `spring-boot-tests/` or external examples).
- Build scripts: `gradlew`, `gradlew.bat`, `gradle/` wrapper.

## Build System
- Gradle with Kotlin DSL in some places (`*.gradle.kts`).
- Key commands:
  - `./gradlew build` - compile, test, package.
  - `./gradlew test` - run all tests.
  - `./gradlew check` - full quality checks (Checkstyle, JaCoCo might be configured).
  - `./gradlew :spring-boot-project:spring-boot:test` to run a specific module's tests.
  - `./gradlew publishToMavenLocal` - publish artifacts to local Maven repo for testing.

## Coding Conventions
- Java 17+ source level; newer language features allowed.
- Code style follows Spring Framework conventions: 4-space indentation, braces on same line, `import` ordering (static after general). A `spotless` plugin might enforce formatting.
- Nullability annotations: `@Nullable`, `@NonNullApi` (package-info.java). Use `Assert.notNull` in public APIs.
- All public auto-configuration classes must be registered in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 3) or `spring.factories` (older).

## Testing Guidance
- Prefer `ApplicationContextRunner` for unit-testing auto-configuration without a full application.
- Integration tests may use `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, etc.
- Test assertions often use AssertJ (`assertThat(...).is...`).
- Mocking: Spring Boot tests often use `@MockBean` or `Mockito` with test slices.
- Test slices are defined in `spring-boot-test-autoconfigure`.

## Contributing
- Issues: GitHub Issues; label `type: enhancement`, `type: bug`, etc.
- Pull Requests: target `main` branch; sign CLA; include tests; ensure `./gradlew check` passes.
- Documentation changes: corresponding updates to `spring-boot-docs/` and Javadoc.
- New starter: add a new module in `spring-boot-starters/` with a `build.gradle` (dependencies) and possibly test.
- Auto-configuration: add `@AutoConfiguration` classes; register them via imports file; write thorough tests using `ApplicationContextRunner`.

## Key Patterns to Recognize
- `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty` are extensively used.
- `EnvironmentPostProcessor` for early environment customization.
- `FailureAnalyzer` for startup diagnostics.
- `BootstrapRegistry` and `ApplicationContextInitializer` for context preparation.
- Property binding: `@ConfigurationProperties` and `@EnableConfigurationProperties`.
- Spring Boot's `@Configuration` classes often use nested `@Import` for grouped configurations.

## Where to Start for Common Tasks
- **Add a new auto-configuration:** See existing classes in `spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`. Look for `@AutoConfiguration` annotations and reference `spring-boot-autoconfigure/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
- **Modify a starter:** Edit the starter's `build.gradle` in `spring-boot-starters/` to add/remove dependencies.
- **Implement a new actuator endpoint:** Check `spring-boot-actuator/src/main/java/org/springframework/boot/actuate/endpoint/` and auto-configuration for it in `spring-boot-actuator-autoconfigure/`.
- **Fix a bug in core SpringApplication:** Look in `spring-boot-project/spring-boot/src/main/java/org/springframework/boot/SpringApplication.java`.

## Note on Versioning
- Current main branch is for Spring Boot 3.x (requires Java 17).
- Branch `2.7.x` is for 2.7 maintenance.
- Check `gradle.properties` for version definition.

## Repository Metadata
- GitHub: https://github.com/spring-projects/spring-boot
- Build commands: `./gradlew build`, `./gradlew test`.
- IDE setup: Import as Gradle project. Ensure annotation processing is enabled (Lombok may be used rarely).

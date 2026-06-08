# Spring Boot Skill

This skill helps an AI coding agent work with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. It provides concrete guidance on navigating the codebase, building, testing, and contributing code.

## Repository Overview

Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications. The repository contains:
- **spring-boot-project/** – Core framework modules (starters, autoconfigure, actuators, devtools, CLI).
- **spring-boot-system-tests/** – System integration tests for end-to-end behaviour.
- **spring-boot-samples/** – Example applications demonstrating features.
- **gradle/**, **build.gradle**, **settings.gradle** – Gradle-based build configuration.

Key modules within `spring-boot-project/`:
- **spring-boot** – Core Spring Boot APIs and runtime.
- **spring-boot-autoconfigure** – Auto-configuration classes and metadata.
- **spring-boot-starters** – Curated dependency descriptors (e.g., `spring-boot-starter-web`).
- **spring-boot-actuator** – Production-ready monitoring and management.
- **spring-boot-actuator-autoconfigure** – Auto-configuration for Actuator.
- **spring-boot-devtools** – Development-time tools (restart, livereload).
- **spring-boot-cli** – Command-line interface.
- **spring-boot-test** / **spring-boot-test-autoconfigure** – Testing support.
- **spring-boot-loader** / **spring-boot-loader-tools** – Launcher and packaging utilities.
- **spring-boot-docs** – Reference documentation source.

## Build System

Spring Boot uses **Gradle** (Kotlin DSL). The root contains:
- `gradlew` (Unix) / `gradlew.bat` (Windows) – Wrapper scripts.
- `build.gradle` – Root build configuration.
- `settings.gradle` – Module declarations.

### Common Commands

| Task | Command |
|------|---------|
| Full build (compile, test, assemble) | `./gradlew build` |
| Fast build without tests | `./gradlew build -x test` |
| Run all unit tests | `./gradlew test` |
| Run integration tests (longer) | `./gradlew integrationTest` |
| Build a specific module | `./gradlew :spring-boot-project:<module>:build` |
| Generate project documentation | `./gradlew asciidoctor` |
| Publish to local Maven repository | `./gradlew publishToMavenLocal` |
| Check for dependency updates | `./gradlew dependencyUpdates` |

**Testing conventions:**
- Unit tests: `src/test/java`, annotated with `@Test` (JUnit5). Mockito, AssertJ, and Hamcrest are preferred.
- Integration tests: located in `src/intTest`, require `@IntegrationTest` annotation or `Gradle` integration test task.
- Run tests for a single module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`.
- Skip long-running tests: `./gradlew build -PskipLongTests`.

## Code Navigation

- **Auto-configuration classes** – `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`. Each feature has its own package (e.g., `web`, `jdbc`, `thymeleaf`).
- **Auto-configuration metadata** – JSON files in `src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` and `*-autoconfigure-metadata.properties`.
- **Starters** – `spring-boot-project/spring-boot-starters/` each starter has a `build.gradle` file listing its dependencies.
- **Actuator endpoints** – `spring-boot-project/spring-boot-actuator/src/main/java/org/springframework/boot/actuate/`.
- **Devtools** – `spring-boot-project/spring-boot-devtools/src/main/java/org/springframework/boot/devtools/`.
- **Sample applications** – `spring-boot-samples/` each demonstrates a specific integration.

Use `git grep` or IDE search to find where a configuration property or class is defined. Properties are defined in `@ConfigurationProperties` classes; their keys map to `META-INF/spring-configuration-metadata.json`.

## Common Workflows

### Adding a New Auto-configuration
1. Identify the library you wish to support.
2. Create a new package under `autoconfigure` (e.g., `org.springframework.boot.autoconfigure.mylib`).
3. Implement an auto-configuration class with `@AutoConfiguration` (or `@Configuration` + Spring Boot conditions). Use `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@EnableConfigurationProperties`.
4. Register the class in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (no file extension).
5. Optionally, define `@ConfigurationProperties` for configurable settings.
6. Add tests in the same package under `src/test`. Use `ApplicationContextRunner` for slicing tests.
7. If the configuration needs a specific dependency, add it as optional (or provided) in `spring-boot-autoconfigure/build.gradle`.

### Creating a Starter
1. A starter is a simple module that pulls together dependencies. Create a new directory in `spring-boot-starters/` named `spring-boot-starter-<name>`.
2. In its `build.gradle`, declare `api(project(":spring-boot-project:spring-boot-starters:spring-boot-starter"))` and any other required libraries.
3. Add the module to `settings.gradle` to include it in builds.
4. No Java code is necessary; it’s just a dependency descriptor.

### Fixing a Bug or Adding a Feature
1. **Reproduce the issue** – Look at existing tests or create a minimal sample in `spring-boot-samples/`.
2. **Locate the relevant module** – Use the issue description to find the component (e.g., web, actuator, autoconfigure).
3. **Write a failing test** – Follow the project’s testing patterns.
4. **Implement the fix** – Ensure it passes unit and integration tests.
5. **Update documentation** – If the change alters public API or configuration properties, update the reference docs (Asciidoc files under `spring-boot-project/spring-boot-docs/src/docs/`) and possibly the `spring-configuration-metadata.json` (usually auto-generated from `@ConfigurationProperties`).
6. **Check code style** – The project uses Spring Java Format and Checkstyle. Run `./gradlew format` and `./gradlew checkstyleMain checkstyleTest` before committing.

## Testing Patterns

- **ApplicationContextRunner**: For testing auto-configuration in isolation.
- `@WebMvcTest`, `@SpringBootTest`, `@DataJpaTest` etc. are not used within the framework itself; they are end-user features.
- Mocking via `@MockBean` is discouraged in framework tests. Prefer `@Import` and direct bean definitions.
- Use `assertThat` from AssertJ extensively.

### Example Auto-Config Test
```java
class MyAutoConfigurationTests {
    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
        .withConfiguration(AutoConfigurations.of(MyAutoConfiguration.class));

    @Test
    void beanCreatedWhenDependencyPresent() {
        contextRunner.withClassLoader(new FilteredClassLoader(MyBean.class)).run((context) -> {
            assertThat(context).doesNotHaveBean(MyBean.class);
        });
    }
}
```

## Key Resources
- **Contribution Guidelines**: `CONTRIBUTING.adoc` in the root.
- **CI pipeline**: GitHub Actions workflows in `.github/workflows/`.
- **Issue template**: If working on a reported issue, refer to the issue for background.

## Tips for AI Agent
- Always search for existing tests that cover similar behaviour – they guide the test setup and assertions.
- Use `./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests "*MyNewTest"` for quick iteration.
- When adding a new optional dependency to `autoconfigure`, ensure it is declared as optional in both the module’s `build.gradle` and in the optional dep management in the root `build.gradle`.
- For changes to starters or BOM, look at `spring-boot-project/spring-boot-dependencies` (the bill of materials).
- Run a full build once before creating a PR to catch integration issues.

Use this skill as a reference whenever asked to modify, build, or navigate the Spring Boot codebase.
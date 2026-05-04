# Spring Boot Development Skill

Guidance for working with the Spring Boot codebase.

## Repository Layout

- `spring-boot-project/` – Main framework code:
  - `spring-boot` – Core runtime and APIs.
  - `spring-boot-autoconfigure` – Auto-configuration classes.
  - `spring-boot-actuator` – Production features.
  - `spring-boot-starters` – Starter POMs.
  - `spring-boot-test` – Test utilities.
  - `spring-boot-tools` – Build tool plugins.
- `spring-boot-samples/` – Example applications.
- `spring-boot-docs/` – Reference documentation.
- `build.gradle` – Root Gradle build.

## Build System

- Gradle (wrapper: `./gradlew`).
- Key tasks: `build`, `test`, `publishToMavenLocal`.
- To build the whole project: `./gradlew build`.
- To build a specific module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:build`.
- Run tests: `./gradlew test` or `--tests '*.SomeTest'`.
- Integration tests may require Docker (Testcontainers).

## Development Workflow

1. Clone and import into IDE (IntelliJ, Eclipse). Run `./gradlew build` to generate sources.
2. Before making changes, run tests in the affected module.
3. When adding a new auto-configuration class:
   - Place in `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`.
   - Register in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (Spring Boot 2.7+).
   - Use `@AutoConfiguration` with appropriate `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc.
   - Add configuration properties in a `@ConfigurationProperties` class; include `spring-boot-configuration-processor` for metadata.
   - Add tests in the same package under `src/test/java/` using focused test slices (`@WebMvcTest`, `@DataJpaTest`) or `@SpringBootTest`.
4. For new starters:
   - Add a module under `spring-boot-project/spring-boot-starters/` with minimal dependencies.
   - Create an `auto-configuration` module or extend existing one; register the configuration.
   - Add sample and documentation.
5. Refer to existing auto-configurations (e.g., `DataSourceAutoConfiguration`, `RedisAutoConfiguration`) for patterns.

## Key Annotations and Patterns

- `@AutoConfiguration` – marks an auto-configuration class (preferred over `@Configuration`).
- `@EnableAutoConfiguration` – user-facing enable.
- Conditional annotations: `@ConditionalOnClass`, `@ConditionalOnMissingBean`, `@ConditionalOnProperty`, `@ConditionalOnResource`, etc.
- `@ConfigurationProperties` with `@EnableConfigurationProperties` for externalized settings.
- Use `spring-boot-configuration-processor` as annotation processor to generate metadata.
- `@AutoConfigureAfter`, `@AutoConfigureBefore` to control ordering.
- `Environment` and `Binder` for manual property binding.

## Testing

- Unit tests: JUnit 5 + SpringExtension if needed.
- Integration tests: `@SpringBootTest(webEnvironment = ...)`; test slices (`@WebMvcTest`, `@DataJpaTest`, etc.) for efficiency.
- Testcontainers: `@Testcontainers` + `@Container` for infrastructure.
- Debug: `./gradlew test --debug-jvm` and attach remote debugger.

## Common Tasks

### Build from source
```bash
./gradlew build -x test   # skip tests for speed
./gradlew :spring-boot-project:spring-boot:jar
```

### Run a sample
```bash
cd spring-boot-samples/spring-boot-sample-tomcat
../../gradlew bootRun
```

### Debug auto-configuration
Set `debug: true` in `application.properties` to see conditions report.
Isolate with `@SpringBootTest(classes = ...)`.

### Add a starter
- Create module `spring-boot-starters/spring-boot-starter-foo/build.gradle`.
- Create or extend auto-configuration.
- Register in `AutoConfiguration.imports`.
- Provide properties class, documentation, and sample.

## Contributing Guidelines

- Sign CLA.
- Open an issue before major changes.
- Ensure code follows Spring style (imports, checkstyle).
- Verify tests: `./gradlew check`.
- Provide tests for new functionality.
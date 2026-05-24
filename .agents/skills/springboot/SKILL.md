# Spring Boot Development Skill

## Overview
Spring Boot is the framework for building production-ready Spring applications. This repository (spring-projects/spring-boot) contains the core framework, auto-configuration, starters, tools, and more.

## Repository Layout
- `spring-boot-project/`: Core modules (e.g., `spring-boot`, `spring-boot-autoconfigure`, `spring-boot-starters`)
- `spring-boot-tests/`: Integration tests and smoke tests
- `spring-boot-system-tests/`, `spring-boot-cli/`, etc.

## Build Commands
- `./gradlew build` - compile and test all modules
- `./gradlew build -x test` to skip tests
- `./gradlew publishToMavenLocal` to install locally
- `./gradlew :spring-boot-project:spring-boot:javadoc` for docs

## Development Workflow
1. Clone and import into IDE (IntelliJ IDEA recommended; use "Import Project" and select `build.gradle`).
2. Set up Gradle JDK properly.
3. Make changes, run `./gradlew build`.
4. For new features, ensure tests are added.
5. To test a sample: `cd spring-boot-tests/spring-boot-smoke-tests/... && ../../gradlew bootRun`
6. Before PR, run full build.

## Key Modules
- `spring-boot-autoconfigure`: Auto-configuration classes. Add or modify using `@Conditional` annotations and `spring.factories` entry.
- `spring-boot-starters`: POM-only modules that pull in dependencies.
- `spring-boot-actuator`: Production-ready features.
- `spring-boot-devtools`: Developer tools.

## Auto-Configuration Contribution
1. Identify feature to auto-configure.
2. Create class annotated with `@Configuration` and use `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc.
3. Register in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (new method) or `spring.factories`.
4. Add corresponding starter if needed.
5. Write tests in `spring-boot-autoconfigure/src/test`.

## Testing
- Unit tests: JUnit 5, Mockito.
- Integration tests: with `@SpringBootTest`, test slices (`@WebMvcTest`, etc.).
- Test auto-configurations with `ApplicationContextRunner`.

## Common Tasks
- Adding a new property: define in `@ConfigurationProperties` classes, add metadata via `additional-spring-configuration-metadata.json`.
- Updating dependency versions: check `spring-boot-project/spring-boot-dependencies/build.gradle` (managed versions).
- Generating documentation: `./gradlew asciidoctor` under `spring-boot-project/spring-boot-docs`.

## Contributing Guidelines
- Fork, branch, commit with Spring conventions.
- All code must have ASL 2 license header.
- Run `./gradlew checkstyleMain checkstyleTest` for style checks.
# Spring Boot – Codex Skill

## Overview
This skill helps an AI coding agent work effectively in the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository. Spring Boot simplifies building production-ready Spring applications with auto-configuration, starters, and an embedded server. The repository is a large, multi-module Gradle project containing the framework core, autoconfiguration, starters, testing support, tools, and documentation.

## Repository Structure
The root contains:
- `build.gradle` / `settings.gradle` – Gradle build configuration.
- `spring-boot-project` – Main source modules.
- `spring-boot-tests` – Integration tests for the framework.
- `spring-boot-docs` – Asciidoctor-based documentation.
- `.github` – CI/CD workflows, issue templates.
- `CONTRIBUTING.adoc` – Contribution guide.

Inside `spring-boot-project`:

```
spring-boot-project/
├── spring-boot              # Core runtime (SpringApplication, environment, etc.)
├── spring-boot-autoconfigure # Auto-configuration classes & metadata
├── spring-boot-actuator      # Production-ready features
├── spring-boot-actuator-autoconfigure
├── spring-boot-starters/     # Parent for all starters
│   ├── spring-boot-starter
│   ├── spring-boot-starter-web
│   └── ... (many more)
├── spring-boot-test          # Test utilities & annotations
├── spring-boot-test-autoconfigure
├── spring-boot-devtools      # Developer tools
├── spring-boot-tools         # Build/tooling support (Maven/Gradle plugins)
└── spring-boot-dependencies  # Bill-of-materials (BOM) publishing
```

## Key Modules & Their Roles
- **spring-boot** – Core API, `SpringApplication`, `EnvironmentPostProcessor`, condition logic.
- **spring-boot-autoconfigure** – All `@AutoConfiguration` classes, `EnableAutoConfiguration` import selector, `spring-autoconfigure-metadata.properties`, and service files (`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` or legacy `spring.factories`).
- **spring-boot-starters** – Starters are just POMs (or gradle modules) that bring in relevant transitive dependencies. The actual starter descriptions live in each subdirectory.
- **spring-boot-actuator** – Endpoints, metrics, health, info contributors.
- **spring-boot-test** – `@SpringBootTest`, test slices (`@WebMvcTest`, `@DataJpaTest`), mock helper, embedded server helpers.
- **spring-boot-devtools** – Restart listeners, LiveReload, property defaults.
- **spring-boot-tools** – `spring-boot-maven-plugin`, `spring-boot-gradle-plugin`, loader utilities.

## Development Workflow

### Prerequisites
- JDK 17 (or the version required by the current main branch – check `.sdkmanrc` or `build.gradle`)
- Gradle (wrapper included)

### Common Gradle Commands
Build the entire project:
```bash
./gradlew build
```

Run all tests:
```bash
./gradlew test
```

Run a specific module test (e.g., autoconfigure):
```bash
./gradlew :spring-boot-project:spring-boot-autoconfigure:test
```

Build without tests:
```bash
./gradlew build -x test
```

Checkstyle, javadoc, and other verifications:
```bash
./gradlew check
```

Format code (plugin `spring-format` or checkstyle):
```bash
./gradlew format
```

Update dependency versions (when editing BOM):
```bash
./gradlew dependencyUpdates
```

### Running a Sample
Use `spring-boot-sample-*` directories in the root to test changes quickly:
```bash
cd spring-boot-samples/spring-boot-sample-tomcat
../../gradlew bootRun
```

## Navigating the Codebase Effectively

### Auto-configuration
- Find auto-config classes in `spring-boot-project/spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/`.
- Condition classes (`@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc.) in `spring-boot-autoconfigure/src/main/java/org/springframework/boot/autoconfigure/condition/`.
- Auto-configuration imports file (Spring Boot 3.x): `spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. For older 2.x branches, `spring.factories` entries reside under `org.springframework.boot.autoconfigure.EnableAutoConfiguration`.
- Configuration metadata: `.../META-INF/spring-configuration-metadata.json` and additional metadata in `.../additional-spring-configuration-metadata.json`.

### Starters
- All starters inherit from `spring-boot-starter` (root starter). Each starter module is simply a `build.gradle` with dependencies, no Java code.
- To find what a starter pulls in, open e.g., `spring-boot-project/spring-boot-starters/spring-boot-starter-web/build.gradle`.
- Starter list is visible in `spring-boot-project/spring-boot-starters/settings.gradle`.

### Core Runtime
- `SpringApplication` constructor, `run` method live in `spring-boot-project/spring-boot/src/main/java/org/springframework/boot/SpringApplication.java`.
- `EnvironmentPostProcessor` implementations are discovered via `META-INF/spring.factories`.

### Test Support
- Test annotations like `@SpringBootTest`, `@AutoConfigureTestDatabase`, test slice annotations are in `spring-boot-project/spring-boot-test`.
- Test autoconfiguration (e.g., `DataSourceAutoConfiguration` replacement) in `spring-boot-project/spring-boot-test-autoconfigure`.

## Contribution Guidelines
- Read `CONTRIBUTING.adoc` in root.
- PRs require a GitHub issue first (unless trivial).
- Sign the CLA.
- Java source code formatting: project uses Spring Java Format; run `./gradlew format` before committing.
- Code style: follow existing conventions; prefer Javadoc on all public API.
- Tests: use JUnit Jupiter. New features need integration tests.
- Documentation: update `spring-boot-docs/src/docs/` if needed, using Asciidoctor.

## Common AI Agent Tasks & Tips
1. **Add a new auto-configuration**
   - Create class in appropriate package under `spring-boot-autoconfigure`.
   - Annotate with `@AutoConfiguration` (or `@Configuration` and declare in `AutoConfiguration.imports`).
   - Add `@ConditionalOnClass` with the target library.
   - Provide `@ConfigurationProperties` if needed.
   - Update the `AutoConfiguration.imports` file.
   - Add a test class in the corresponding test source set.
   - If the library requires a starter, create a new starter module under `spring-boot-starters` and add the dependency.

2. **Troubleshoot an auto-configuration**
   - Check the `AutoConfiguration.imports` file to see if the class is listed.
   - Look for conditions (`@ConditionalOnClass`, `@ConditionalOnBean`, etc.).
   - Use `--debug` flag on Spring Boot application to see positive/negative matches.
   - Search in `spring-configuration-metadata.json` for the property key.

3. **Modify core behavior**
   - `SpringApplication` has hooks via `ApplicationContextInitializer`, `ApplicationListener`, `EnvironmentPostProcessor`. Look in corresponding `spring.factories` for registration.
   - For changing embedded server settings, check `spring-boot-autoconfigure` web server packages.

4. **Run a single integration test**
   ```bash
   ./gradlew :spring-boot-project:spring-boot-autoconfigure:test --tests "org.springframework.boot.autoconfigure.web.servlet.WebMvcAutoConfigurationTests"
   ```

5. **Find where a property is used**
   - Search within `spring-boot-autoconfigure` for `@ConfigurationProperties` prefix.
   - Use the `git grep "property.name"` on the configuration metadata JSON.

## Module Dependency Map (Simplified)
- `spring-boot` depends on Spring Framework core, logging, snakeyaml, etc.
- `spring-boot-autoconfigure` depends on `spring-boot` and many optional libraries (marker dependencies).
- `spring-boot-starter-web` pulls in `spring-boot-starter`, `spring-boot-starter-json`, and embedded Tomcat.
- `spring-boot-actuator` depends on `spring-boot` and Micrometer.

This skill assumes familiarity with Gradle and Spring Boot concepts. For the most current details, always consult the actual repository files.
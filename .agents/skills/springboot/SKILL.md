# Spring Boot Repository Skill

## Overview
Spring Boot is an opinionated, convention-over-configuration framework for building production-ready, stand-alone Spring applications. This skill covers the Spring Boot source repository (spring-projects/spring-boot) and assists in understanding, developing, and contributing to the framework itself.

## Repository Structure
- **spring-boot-project/**: Core modules including:
  - **spring-boot**: Foundation classes (SpringApplication, SpringBootExceptionReporter, etc.)
  - **spring-boot-autoconfigure**: Auto-configuration support for various technologies.
  - **spring-boot-starters**: Starter POMs for dependency aggregation.
  - **spring-boot-actuator**: Production-ready features (health, metrics, etc.).
  - **spring-boot-devtools**: Developer tools (automatic restart, LiveReload).
  - **spring-boot-test**: Testing utilities.
  - **spring-boot-test-autoconfigure**: Auto-configuration for tests.
  - **spring-boot-loader**: Embedded launcher classes.
  - **spring-boot-docker-compose**: Docker Compose support.
- **spring-boot-tests/**: Integration tests and smoke tests.
- **spring-boot-docs/**: Reference documentation in AsciiDoc.
- **buildSrc/**: Custom Gradle plugins and conventions.
- **gradle/**: Gradle wrapper and configuration.

## Build & Test Commands
- Build all modules: `./gradlew build`
- Run all tests: `./gradlew test`
- Build without tests: `./gradlew build -x test`
- Run tests for a specific module: `./gradlew :spring-boot-project:spring-boot-autoconfigure:test`
- Generate documentation: `./gradlew asciidoctor`
- Check code style: `./gradlew checkstyleMain checkstyleTest` (if Checkstyle plugin applied)
- Dependency management plugin: `./gradlew dependencyManagement`

## Development Workflow
1. **Fork** the repository on GitHub.
2. Clone your fork: `git clone https://github.com/<your-username>/spring-boot.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make changes following existing patterns and code conventions.
5. Add tests for new functionality or bug fixes.
6. Run `./gradlew build` (or module-specific tests) to verify.
7. Update documentation if necessary.
8. Sign the [Contributor License Agreement](https://cla.pivotal.io/sign/spring) (CLA) if not already done.
9. Submit a Pull Request to the `main` branch. Provide a clear description referencing any issues.

## Key Concepts & Patterns
- **Auto-configuration**: Located in `spring-boot-autoconfigure`. Uses `@AutoConfiguration` (since 3.0) and condition annotations (`@ConditionalOnClass`, `@ConditionalOnMissingBean`). Auto-configuration classes are registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` file (not `spring.factories` as in older versions).
- **SpringApplication**: Customization via `SpringApplication` builder, properties, and failure analyzers (`FailureAnalyzer` implementations).
- **Actuator**: Extend via `HealthIndicator`, `Metrics` (Micrometer), custom endpoints (`@Endpoint`, `@ReadOperation`, `@WriteOperation`).
- **Starters**: Dependency descriptors that pull in compatible versions of libraries.
- **Testing**: Test slices (`@WebMvcTest`, `@DataJpaTest`), `ApplicationContextRunner` for auto-configuration testing.
- **Banner**: Implement `Banner` and register via `spring.banner.location`.
- **Environment**: `ConfigurableEnvironment`, property sources, profiles.

## Troubleshooting Build Issues
- Ensure Java 17 (or later) is installed; Spring Boot 3.x requires Java 17.
- Use the Gradle wrapper (`./gradlew`) to avoid version mismatches.
- If dependency resolution fails, check proxy settings in `gradle.properties`.
- For test failures, look at the specific test report in `*/build/reports/tests/test/index.html`.
- Run `./gradlew --refresh-dependencies` to force dependency updates.

## Contribution Tips
- Review `CONTRIBUTING.adoc` in the repo root.
- Follow the [Spring Framework Code Style](https://github.com/spring-projects/spring-framework/wiki/Spring-Framework-Code-Style) (use Eclipse/IntelliJ formatter settings).
- Ensure new auto-configuration classes have comprehensive tests using `ApplicationContextRunner` or `@SpringBootTest`.
- Update samples or smoke tests if the change affects user-facing behavior.

## Additional Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Boot GitHub Project](https://github.com/spring-projects/spring-boot)
- [Issue Tracker](https://github.com/spring-projects/spring-boot/issues)
- [Gitter Community](https://gitter.im/spring-projects/spring-boot)
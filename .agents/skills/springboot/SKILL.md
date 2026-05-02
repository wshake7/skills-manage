# Spring Boot Skill

## Overview
Spring Boot makes it easy to create stand-alone, production-grade Spring-based applications. The repository (https://github.com/spring-projects/spring-boot) contains the core framework, auto-configuration, starters, and tools. This skill equips an AI coding agent to understand, navigate, and contribute effectively to the Spring Boot codebase.

## Repository Structure
- **spring-boot-project/spring-boot**: Core runtime (SpringApplication, SpringApplicationBuilder, etc.)
- **spring-boot-project/spring-boot-autoconfigure**: Auto-configuration classes for various technologies
- **spring-boot-project/spring-boot-actuator**: Production-ready features (health, metrics, info)
- **spring-boot-project/spring-boot-starters**: Dependency descriptors that pull in common libraries
- **spring-boot-project/spring-boot-test**: Test utilities (e.g., `@SpringBootTest`)
- **spring-boot-project/spring-boot-tools**: Maven/Gradle plugins and developer tools
- **spring-boot-samples**: Example applications
- **spring-boot-system-tests**: Integration tests across the full stack

## Key Concepts
- **Auto-configuration**: Conditional beans registered via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (or `spring.factories` for legacy). Uses annotations like `@ConditionalOnClass`, `@ConditionalOnMissingBean`.
- **Starters**: Opinionated descriptors (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, etc.) that bundle dependencies.
- **Embedded Servers**: Tomcat (default), Jetty, Undertow embedded; customised via `WebServerFactoryCustomizer`.
- **Externalized Configuration**: `application.properties`/`yml`, environment variables, command-line args, relaxed binding via `@ConfigurationProperties`.

## Development Workflow
- **Build system**: Gradle (primary) with `./gradlew`, also support for Maven (`./mvnw`).
- **Common commands**:
  - Build everything: `./gradlew build`
  - Assemble (without tests): `./gradlew assemble`
  - Run tests for a module: `./gradlew spring-boot-project:spring-boot:test`
  - Run a sample: `cd spring-boot-samples/spring-boot-sample-simple && ./gradlew bootRun`
- **Testing**:
  - Unit tests are typically JUnit Jupiter with Mockito.
  - Integration tests use `@SpringBootTest` with optional `webEnvironment` (e.g., `DEFINED_PORT`, `RANDOM_PORT`, `NONE`).
  - Set environment properties via `@TestPropertySource` or inline `properties`.
- **IDE Setup**: Import as Gradle project; requires Java 17 or later (check `.java-version`).

## Common Patterns
- **Writing an auto-configuration**:
  1. Create a class annotated with `@AutoConfiguration` (not `@Configuration`).
  2. Use `@ConditionalOnClass`, `@ConditionalOnProperty` etc. to conditionally define beans.
  3. Register it in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`.
- **Creating a starter**: Provide a `pom.xml` (if using Maven) or a `build.gradle` that bundles the autoconfigure module and required third-party libraries. Naming: `my-library-spring-boot-starter`.
- **Application events**: Listen to `ApplicationReadyEvent`, `ApplicationFailedEvent`, or `ApplicationStartedEvent` via `@EventListener`.
- **Failure analysis**: Implement `FailureAnalyzer` and register via `META-INF/spring.factories` (`org.springframework.boot.diagnostics.FailureAnalyzer`).

## Troubleshooting
- **Java version mismatch**: Check `java.version` property in project's `build.gradle` and ensure you’re using the required JDK.
- **Port already in use**: In tests, use `@SpringBootTest(webEnvironment = NONE)` if no server needed, or random ports: `webEnvironment = RANDOM_PORT`.
- **Dependency issues**: Run `./gradlew dependencyInsight --dependency <artifact>` to track conflicts.
- **Build failures**: Look for `EnforcedPlatformVersion` ; ensure Gradle/ Maven wrappers are up to date.

## Contribution Guidelines (Brief)
- Fork and branch from `main`.
- Squash commits: sign-off required (DCO).
- Update or add tests in the corresponding module.
- Raise an issue in the [Spring Boot issue tracker](https://github.com/spring-projects/spring-boot/issues) for new features or bugs.
- Follow the code style seen in existing sources (Javadoc, layout).

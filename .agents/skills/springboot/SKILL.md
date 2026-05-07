# Spring Boot Skill

## Overview
Spring Boot is a framework for building stand-alone, production-grade Spring-based applications. This skill assists working with the spring-projects/spring-boot repository.

## Repository Structure
- `spring-boot-project/` - core codebase containing modules:
  - `spring-boot` - SpringApplication and other core classes
  - `spring-boot-autoconfigure` - auto-configuration support
  - `spring-boot-starters` - dependency descriptors
  - `spring-boot-actuator` - production-ready features
  - `spring-boot-tools` - build and development tools
  - `spring-boot-test` - testing utilities
  - `spring-boot-samples` - sample applications
- `gradle/` - Gradle wrapper and plugins
- Root `build.gradle` and `settings.gradle`

## Build System
Uses Gradle with wrapper (`gradlew`). JDK 17+ required.

### Common Commands
- Full build: `./gradlew build`
- Run tests: `./gradlew test`
- Build a specific module: `./gradlew :spring-boot-project:spring-boot:build`
- Check code style, tests, and licenses: `./gradlew check`
- Generate IDE project files: `./gradlew eclipse` or `./gradlew idea`
- Publish to local Maven repository: `./gradlew publishToMavenLocal`
- Run sample application: `./gradlew :spring-boot-project:spring-boot-samples:spring-boot-sample-web-jetty:bootRun` (pick any sample)

### Testing
- Tests are written in JUnit 5 with Spring Test.
- Integration tests often use `@SpringBootTest` with random ports or Testcontainers.
- Run single test: `./gradlew :spring-boot:test --tests "org.springframework.boot.SpringApplicationTests"`
- Debug tests: Add `--debug-jvm` to Gradle test task.

### Development Workflow
1. Fork and clone repository.
2. Create a branch for changes.
3. Follow `CONTRIBUTING.adoc` for guidelines.
4. Ensure code compiles and tests pass: `./gradlew build`.
5. Run `./gradlew check` before submitting a PR.

## Key Classes
- `org.springframework.boot.SpringApplication` - main entry point
- `@SpringBootApplication` - convenience annotation
- `org.springframework.boot.autoconfigure.EnableAutoConfiguration`
- `org.springframework.boot.autoconfigure.AutoConfigurationPackage`

## Troubleshooting
- Build failures: Check Java version (requires 17+), ensure you use `./gradlew` not system Gradle.
- Test failures: Look for missing Docker or Testcontainers prerequisites.
- Dependency resolution: Add Maven Central snapshot repo if needed.
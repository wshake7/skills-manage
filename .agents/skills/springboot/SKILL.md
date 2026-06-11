# Spring Boot Skill

This skill provides guidance for working with Spring Boot projects, helping an AI coding agent to effectively create, configure, and maintain applications built with the Spring Boot framework. The source repository is [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot).

## Overview

Spring Boot simplifies building production-ready Spring applications with auto-configuration, embedded servers, and opinionated starters. A typical project structure uses `@SpringBootApplication`, an embedded server (Tomcat/Jetty/Undertow), and externalised configuration.

## Recognizing a Spring Boot Project

A Spring Boot project can be identified by:

- **Maven**: `pom.xml` with `spring-boot-starter-parent` as a parent OR a dependency on `spring-boot-starter-*` and the Spring Boot Maven plugin.
- **Gradle**: `build.gradle` applying the `org.springframework.boot` plugin or using `spring-boot-starter-*` dependencies.

Main classes typically import `org.springframework.boot.autoconfigure.SpringBootApplication` and use `SpringApplication.run()`.

## Common Workflows

### 1. Modifying Dependencies
- Add starters via Maven `<dependency>` or Gradle `implementation` for common features (web, data JPA, security, etc.).
- Prefer Spring Boot’s curated dependency versions (managed by `spring-boot-dependencies` BOM) to avoid conflicts.
- For JDBC or JPA, include the respective starter and a database driver (e.g., H2, PostgreSQL).

### 2. Externalized Configuration
- Use `application.properties` or `application.yml` in `src/main/resources`.
- Profile-specific files (`application-{profile}.properties`) override base configuration when the profile is active.
- Bind properties to POJOs with `@ConfigurationProperties` or read them with `@Value`.
- Environment variables, command-line arguments, and `SPRING_APPLICATION_JSON` are supported.

### 3. Auto-Configuration Tuning
- Auto-configuration classes are activated based on classpath and existing beans.
- To see which auto-configuration classes are applied, enable debug logging: `---logging.level.org.springframework.boot.autoconfigure=DEBUG`.
- Exclude unwanted auto-configuration: `@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})` or `spring.autoconfigure.exclude` property.
- Override auto-configured beans by defining your own `@Bean` of the same type.

### 4. Building and Running
- **Development mode**: use `spring-boot-devtools` for automatic restarts and live reload.
- **Maven**: `mvn spring-boot:run` or package with `mvn package` and run `java -jar target/*.jar`.
- **Gradle**: `gradle bootRun` or build with `gradle build` and run the JAR.
- Configure the embedded server port via `server.port`.

### 5. Writing REST Controllers
- Annotate a class with `@RestController` and methods with `@GetMapping`, `@PostMapping`, etc.
- Use `@RequestBody` and `@PathVariable` for request mapping.
- For validation, add `@Valid` and a `Validator` bean.

### 6. Data Access
- For JPA, use `spring-boot-starter-data-jpa` and an `Entity` class; Spring Boot auto-configures an `EntityManagerFactory` and transaction management.
- For MongoDB or other NoSQL, include the corresponding starter.
- Schema initialization from `schema.sql`/`data.sql` can be controlled via `spring.sql.init.mode`.

### 7. Testing
- Use `@SpringBootTest` for integration tests (loads full ApplicationContext).
- Slice tests for specific layers:
  - `@WebMvcTest` for controllers only.
  - `@DataJpaTest` for JPA repositories.
  - `@RestClientTest` for REST clients.
- Test configuration can be overridden with `@TestPropertySource`.
- Mock beans with `@MockBean` or `@SpyBean`.

### 8. Actuator (Monitoring and Management)
- Add `spring-boot-starter-actuator` to expose endpoints like `health`, `info`, `metrics`, `loggers`.
- Endpoints are exposed over HTTP or JMX; configure security and exposure via `management.endpoints.web.exposure.include`.
- Custom health indicators can be added by implementing `HealthIndicator`.

### 9. Creating Custom Starters
- A starter is a Maven/Gradle module that includes necessary dependencies and auto-configuration.
- Place auto-configuration classes under `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` (since 2.7) or `spring.factories`.
- Use `@Conditional*` annotations to control when configuration applies.

## Best Practices
- Keep the Spring Boot version consistent across starters; use the Maven BOM or Gradle platform.
- Do not duplicate dependency versions already managed by Spring Boot unless necessary.
- Prefer YAML for complex configuration, but properties files work fine.
- Use `@ConfigurationProperties` over `@Value` for type-safe and structured configuration.
- Keep `application.properties` focused on default values; put environment overrides in profile files or environment variables.
- When writing libraries, provide sensible auto-configuration but allow overriding.

## Troubleshooting
- **Port already in use**: change `server.port` or kill the process.
- **Application fails to start**: check the auto-configuration report (debug logs) and missing dependencies.
- **Database connection refuses**: ensure the driver is on the classpath and `spring.datasource.url` is correct.
- **Web endpoints not found**: verify controller annotations, component scanning includes the package (default is the main application’s package).

## Additional Resources
- [Official Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [GitHub Repository](https://github.com/spring-projects/spring-boot)
- [Sample Applications](https://github.com/spring-projects/spring-boot/tree/main/spring-boot-project/spring-boot-samples)

**Note**: This skill assumes standard Spring Boot conventions. Always verify the project’s specific configuration and dependencies.

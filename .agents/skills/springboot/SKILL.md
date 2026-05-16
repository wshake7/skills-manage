# Spring Boot Skill

## Overview
Spring Boot simplifies building production-ready Spring applications through opinionated defaults, embedded servers, and auto-configuration. This skill guides an AI agent in creating, understanding, and modifying Spring Boot projects and working with the [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repository.

## Project Structure
A typical Spring Boot project (Maven/Gradle) looks like:

```
src/
  main/
    java/        # Application code
    resources/   # static, templates, application.properties
  test/
    java/        # Tests
pom.xml / build.gradle
```

Main class example:
```java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## Key Concepts

### Starters
Use `spring-boot-starter-*` to pull in curated sets of dependencies. Common starters:
- `spring-boot-starter-web` (REST + embedded Tomcat)
- `spring-boot-starter-data-jpa` (JPA + Hibernate)
- `spring-boot-starter-test` (JUnit, Spring Test)
- `spring-boot-starter-actuator` (monitoring endpoints)

### Auto-Configuration
`@EnableAutoConfiguration` (part of `@SpringBootApplication`) automatically configures beans based on classpath. Override by excluding auto-config classes or providing your own `@Bean`.

### External Configuration
`application.properties` or `application.yml` in `src/main/resources`. Use `@Value` or `@ConfigurationProperties` for type-safe binding. Profiles (`application-{profile}.properties`) enable environment-specific settings.

### Actuator
Add `spring-boot-starter-actuator` to expose endpoints like `/health`, `/info`, `/metrics`. Secure them and enable specific endpoints in configuration.

## Common Workflows

### Creating a REST Endpoint
```java
@RestController
@RequestMapping("/api")
public class HelloController {
    @GetMapping("/hello")
    public String hello() { return "Hello"; }
}
```

### Using Spring Data JPA
Define an entity with `@Entity`, a repository interface extending `CrudRepository` or `JpaRepository`. Spring Boot auto-configures `DataSource`, `EntityManagerFactory`, and transaction management.

### Testing
- **Unit tests:** Use `@WebMvcTest` (slice for controllers) or `@DataJpaTest` (for repositories).
- **Integration tests:** `@SpringBootTest` with `TestRestTemplate` or `MockMvc`.
- The repository itself includes thousands of tests; study `src/test/java` for patterns.

### Packaging and Running
- Build: `./mvnw package` or `./gradlew build` produces an executable JAR.
- Run: `java -jar target/*.jar` or `./mvnw spring-boot:run`.

## Working with the Spring Boot Repository

The [spring-projects/spring-boot](https://github.com/spring-projects/spring-boot) repo is modular:
- **`spring-boot-project/`**: Core modules:
  - `spring-boot` – base library
  - `spring-boot-autoconfigure` – auto-configuration class and metadata
  - `spring-boot-starters` – all starter POMs
  - `spring-boot-actuator` – production features
  - `spring-boot-tools` – Maven/Gradle plugins
- **`spring-boot-tests/`**: Integration tests
- **`spring-boot-docs/`**: Reference documentation sources (AsciiDoc)

### Navigation Tips
- To find an auto-configuration class, search `spring-boot-autoconfigure/src/main/java` for names matching the technology (e.g., `DataSourceAutoConfiguration`).
- Check `spring-configuration-metadata.json` in the same module for all supported properties.
- Starter dependencies are defined in `spring-boot-starters/*/pom.xml`.
- Build the project with `./gradlew build` (Gradle wrapper) and run specific tests with `./gradlew :spring-boot-project:spring-boot:test --tests="*..."`.

## Reference
- Official documentation: [docs.spring.io/spring-boot](https://docs.spring.io/spring-boot/docs/current/reference/)
- Spring Initializr: [start.spring.io](https://start.spring.io)
- Repository: [github.com/spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)

## Best Practices for AI Agents
- Prefer starters to manual dependency management.
- Use `@ConfigurationProperties` instead of scattered `@Value` for complex config.
- Leverage sliced test annotations (`@WebMvcTest`, `@DataJpaTest`) for fast, focused tests.
- Consult `spring.factories` and auto-configuration classes when troubleshooting unexpected beans.
- When generating code, follow Spring Boot’s package conventions and avoid placing the main class in the default package.
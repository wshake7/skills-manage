# Spring Boot Development Skill

## Overview
Spring Boot simplifies Java application development by providing auto-configuration, embedded servers, and opinionated defaults. It enables rapid creation of production-ready applications with minimal boilerplate.

## When to Use
- Building microservices or REST APIs
- Creating web applications using Spring MVC
- Integrating with Spring ecosystem projects (Data, Security, Cloud)
- Developing CLI tools or batch jobs

## Core Concepts
- **Auto-Configuration**: Automatically configures beans based on classpath dependencies and properties. Use `@SpringBootApplication` (combines `@Configuration`, `@EnableAutoConfiguration`, `@ComponentScan`).
- **Starters**: Maven/Gradle dependencies that bundle coordinated jars (e.g., `spring-boot-starter-web`).
- **Dependency Injection**: Use `@Autowired`, constructor injection (preferred), `@Component`, `@Service`, `@Repository`, `@Controller`/`@RestController`.
- **Externalized Configuration**: Properties via `application.properties`/`application.yml`, command-line args, environment variables, profiles (`spring.profiles.active`).
- **Embedded Server**: Tomcat by default; switchable to Jetty, Undertow, or none.
- **Actuator**: Production-ready features (health, metrics, info) via `spring-boot-starter-actuator`.

## Typical Workflow
1. Generate a project using [Spring Initializr](https://start.spring.io) with required starters.
2. Add business logic in a `@SpringBootApplication` class and run it.
3. Define REST endpoints with `@RestController` and `@RequestMapping`.
4. Implement service layer with `@Service` and `@Transactional`.
5. Access data with Spring Data repositories (`@Repository`, extend `JpaRepository`).
6. Configure via `application.properties` or `application.yml`.
7. Test using `@SpringBootTest`, `@WebMvcTest`, `@DataJpaTest`, etc.
8. Package as executable JAR (`mvn package` / `gradle build`) and run with `java -jar`.

## Key Annotations
- `@SpringBootApplication` – main class entry point.
- `@RestController` + `@RequestMapping`/`@GetMapping` – REST endpoints.
- `@Service`, `@Component`, `@Repository` – bean stereotypes.
- `@Autowired` – inject dependencies.
- `@Value("${property.name}")` – inject properties.
- `@ConfigurationProperties(prefix="…")` – bind property groups.
- `@SpringBootTest` – integration test annotation.

## Configuration
- **`application.properties`**: `server.port=8080`, `spring.datasource.url=…`, `logging.level.root=INFO`.
- **Profiles**: `application-{profile}.properties`, activate via `spring.profiles.active`.
- **Property sources**: Environment, system properties, command line (`--server.port=9090`).

## Auto-Configuration
- Spring Boot uses `@Conditional` annotations to decide which beans to create. Use `spring.autoconfigure.exclude` to exclude specific configurations.
- Implement `CommandLineRunner` or `ApplicationRunner` for startup logic.

## Web Development
- REST with `@RestController`, path variables (`@PathVariable`), request body (`@RequestBody`), response entity (`ResponseEntity`).
- Exception handling: `@ControllerAdvice` + `@ExceptionHandler`.
- Validation: `@Valid` + `javax.validation` constraints.

## Data Access
- Use Spring Data starters: `spring-boot-starter-data-jpa`, `spring-boot-starter-data-mongodb`, etc.
- Repositories: Extend `JpaRepository<Entity, Id>`, add custom methods following naming conventions or `@Query`.
- Embedded databases (H2) for dev/testing; configure `spring.jpa.hibernate.ddl-auto`.

## Testing
- `@SpringBootTest` loads full context; use `webEnvironment` for random port.
- `@WebMvcTest(Controller.class)` tests only the web layer.
- `@DataJpaTest` auto-configures in-memory DB and tests repositories.
- Mock external beans with `@MockBean`, use `@Autowired` to inject test target.
- Use TestRestTemplate or MockMvc for endpoint testing.

## Repository Navigation (for contributions)
- **Main Modules**:
  - `spring-boot-project/spring-boot` – core APIs and utilities.
  - `spring-boot-project/spring-boot-autoconfigure` – auto-configuration classes.
  - `spring-boot-project/spring-boot-starters` – starter POMs.
  - `spring-boot-project/spring-boot-actuator` / `spring-boot-actuator-autoconfigure` – actuator.
  - `spring-boot-project/spring-boot-test` / `spring-boot-test-autoconfigure` – testing support.
  - `spring-boot-project/spring-boot-devtools` – developer tools.
- **Build**: Gradle wrapper (`./gradlew build`).
- **Contributing Guide**: See `CONTRIBUTING.adoc`.

## Best Practices
- Prefer constructor injection over field injection.
- Use Lombok to reduce boilerplate (if desired).
- Keep `@SpringBootApplication` in a root package for component scan.
- Externalize environment-specific config via profiles.
- Enable graceful shutdown (`server.shutdown=graceful`).
- Monitor with Actuator and Micrometer.

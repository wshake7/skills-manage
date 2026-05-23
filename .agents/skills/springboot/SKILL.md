# Spring Boot Skill

Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications. This skill provides concise guidance and workflows for AI coding agents working with Spring Boot projects.

## Overview

Spring Boot simplifies Spring application development by providing:
- **Auto-configuration** – automatically configures Spring components based on classpath settings, properties, and existing beans.
- **Starters** – curated dependency descriptors that bring in all needed transitive dependencies (e.g., `spring-boot-starter-web`, `spring-boot-starter-data-jpa`).
- **Embedded servers** – no need to deploy WAR files; applications run with an embedded Tomcat, Jetty, or Undertow.
- **Actuator** – production-ready features like health checks, metrics, and environment info.
- **Externalized configuration** – properties and YAML files, environment variables, command-line arguments.

## Project Structure (Maven/Gradle)

Typical layout of a Spring Boot project (Maven):
```
src/
  main/
    java/           Application main class, packages (controller, service, repository, model, config, etc.)
    resources/
      application.properties (or .yml)  – main configuration
      static/                            – static resources
      templates/                         – view templates (if using Thymeleaf, etc.)
  test/
    java/           Test classes, usually mirror main structure
```

The main class uses `@SpringBootApplication` (a combination of `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`).

## Core Concepts

### Auto-Configuration
- Enabled by `@EnableAutoConfiguration` (included in `@SpringBootApplication`).
- Beans are conditionally created based on what is on the classpath and existing beans.
- You can **exclude** certain auto-configurations with `@SpringBootApplication(exclude = ...)` or property `spring.autoconfigure.exclude`.
- Custom auto-configuration can be written using `@Configuration` classes with `@ConditionalOnClass`, `@ConditionalOnMissingBean`, etc. Place them in a `spring.factories` file under `META-INF/` if building a starter.

### Starters
Essential starter dependencies (groupId: `org.springframework.boot`):
- `spring-boot-starter-web` – RESTful web (Spring MVC, embedded Tomcat)
- `spring-boot-starter-data-jpa` – JPA + Hibernate
- `spring-boot-starter-data-mongodb`, `spring-boot-starter-data-redis`, etc.
- `spring-boot-starter-security` – Spring Security
- `spring-boot-starter-test` – JUnit 5, Mockito, AssertJ, Spring Test
- `spring-boot-starter-actuator` – production monitoring
- `spring-boot-starter-validation` – Bean Validation (Hibernate Validator)

### Configuration Properties
- Default places: `application.properties` or `application.yml` in `src/main/resources`.
- Profile-specific: `application-{profile}.properties`.
- Order of precedence (highest to lowest): command-line args, JNDI, `application-{profile}.properties` outside jar, `application-{profile}.properties` inside jar, `application.properties`.
- Use `@Value("${property.name}")` for simple injections.
- Prefer `@ConfigurationProperties(prefix = "app")` on a class to bind structured properties; enable with `@EnableConfigurationProperties` or `@ConfigurationPropertiesScan`.

### Profiles
- Activate with `spring.profiles.active` (e.g., `dev`, `test`, `prod`).
- Use `@Profile` annotation on beans/components to condition runtime availability.

## Common Workflows

### Creating a REST API
1. Ensure `spring-boot-starter-web` is in dependencies.
2. Create a controller class:
```java
@RestController
@RequestMapping("/api/resource")
public class ResourceController {
    @GetMapping
    public List<Resource> list() { ... }

    @PostMapping
    public Resource create(@Valid @RequestBody ResourceDto dto) { ... }
}
```
3. Add exception handling with `@ControllerAdvice` or custom `@ExceptionHandler` methods.

### Accessing a Database
1. Add appropriate starter (e.g., `spring-boot-starter-data-jpa`) and database driver (e.g., `h2` for dev, `postgresql` for prod).
2. Configure datasource in `application.properties`:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=user
spring.datasource.password=pass
spring.jpa.hibernate.ddl-auto=update
```
3. Create JPA entities:
```java
@Entity
public class Customer { @Id @GeneratedValue private Long id; ... }
```
4. Create a repository interface extending `JpaRepository<Customer, Long>`.
5. Use the repository in a service class (`@Service`), inject via constructor.

### Testing
Spring Boot provides powerful test support:
- Use `@SpringBootTest` for full application context tests.
- Slice tests: `@WebMvcTest` (only web layer), `@DataJpaTest` (only JPA), `@RestClientTest`, etc.
- Mock dependencies with `@MockBean`.
- For controllers, use `MockMvc` (autowired in `@WebMvcTest`).
- Integration tests can use `TestRestTemplate` or `WebTestClient` (WebFlux).
- Always include `spring-boot-starter-test` (scope: test).

### Adding Actuator & Monitoring
1. Add `spring-boot-starter-actuator`.
2. Configure endpoints (e.g., `management.endpoints.web.exposure.include=health,info,metrics`).
3. Access via `/actuator/health`, `/actuator/info`, etc.

## Best Practices & Tips

- **Dependency Injection**: Prefer constructor injection over field injection (makes testing easier and avoids circular dependencies).
- **Configuration**: Keep sensitive data out of application.properties; use environment variables or external config servers (e.g., Spring Cloud Config). Use `@ConfigurationProperties` for complex configurations.
- **Logging**: Spring Boot uses Logback by default; customize with `logback-spring.xml` or properties (`logging.level.*`).
- **DevTools**: Add `spring-boot-devtools` (development only) for automatic restarts and live reload. Do not include in production.
- **Error Handling**: Implement global error responses with `@ControllerAdvice` and `@ExceptionHandler`.
- **Validation**: Use `@Valid` on request bodies and handle `MethodArgumentNotValidException`.
- **Layering**: Typically separate `controller` (handles HTTP), `service` (business logic), `repository` (data access). Use DTOs for request/response.
- **Profiles**: Use profiles to segregate development, testing, and production configurations.
- **Security**: If using Spring Security, customize `WebSecurityConfigurerAdapter` (deprecated in 2.7, use `SecurityFilterChain` bean).

## Assistance Prompts for AI Agent

When asked to implement a feature in a Spring Boot project:

1. **Check existing project structure** – locate the main application class, understand package layout, and read `pom.xml`/`build.gradle` to know available starters.
2. **Identify the needed starter** if a new dependency is required (add it to the build file).
3. **Follow conventions**:
   - Package by feature or layer. Ensure consistency with existing code.
   - Use Spring stereotypes (`@RestController`, `@Service`, `@Repository`, `@Component`).
   - Map entities properly with JPA annotations.
4. **Implement the feature**:
   - Create necessary entity, repository, service, controller classes.
   - If a new REST endpoint, design request/response DTOs and handle validation.
   - Add configuration properties if needed.
5. **Write tests**:
   - Unit tests for services and utility classes.
   - Web layer tests with `@WebMvcTest` for controllers.
   - Repository tests with `@DataJpaTest`.
6. **Run the application** with `mvn spring-boot:run` or `gradle bootRun`, verify endpoints.
7. **Check auto-configuration report** (if issues) by adding `--debug` flag or enabling `spring.autoconfigure.exclude` property.

## Useful Commands

- Run application: `mvn spring-boot:run` or `./gradlew bootRun`
- Package: `mvn package` (or `gradle build`). Run jar: `java -jar target/*.jar`
- List auto-configuration classes: `java -jar myapp.jar --debug`
- Override properties at runtime: `java -jar myapp.jar --server.port=8081`

## Troubleshooting Common Issues

- **Whitelabel Error Page**: Missing controller mapping or exception handling.
- **No qualifying bean**: Check component scanning scope; add missing `@Component`, `@Repository`, or `@Service`.
- **Database connection**: Verify datasource URL and credentials; perhaps driver not on classpath.
- **Port already in use**: Set `server.port` to a different value.
- **Auto-configuration not applying**: Check classpath dependencies and that `@EnableAutoConfiguration` is active.

---

*This skill is based on the official Spring Boot GitHub repository and documentation. Keep this reference in mind for deep-dives into auto-configuration classes.*
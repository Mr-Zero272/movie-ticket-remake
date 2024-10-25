package com.moonmovie.auth_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@ActiveProfiles("test")
@SpringBootTest
@TestPropertySource(properties = {
		"spring.data.mongodb.auto-index-creation=false",
		"spring.redis.enabled=false"
})
class AuthServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}

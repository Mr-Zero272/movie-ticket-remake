package com.moonmovie.user_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * User Entity
 *
 * @author mr-zero272
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("user")
public class User implements Serializable {
	/**
	 * 
	 */
	@Serial
	private static final long serialVersionUID = 1L;
	@Id
	private String id;
	private String userClerkId;
	private String username;
	private String email;
	private String password;
	private String name;
	private String bio;
	private String avatar;
	private boolean onboarded;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;

	private Role role;
}

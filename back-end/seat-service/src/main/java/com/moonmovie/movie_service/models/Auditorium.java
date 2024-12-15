package com.moonmovie.movie_service.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Document(collection = "auditorium")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auditorium implements Serializable {

	/**
	 * 
	 */
	@Serial
	private static final long serialVersionUID = 1L;
	@Id
	private String id;
	private String name;
	private String address;
	private boolean deleteFlag;
	private LocalDateTime createdAt;
	private LocalDateTime modifiedAt;

	@Override
	public int hashCode() {
		return 2024;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		return id != null && id.equals(((Auditorium) obj).id);
	}

}

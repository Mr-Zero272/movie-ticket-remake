package com.moonmovie.movie_service.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "genre")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Genre implements Serializable {

	/**
	 * 
	 */
	@Serial
	private static final long serialVersionUID = 1L;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	private String name;
	
	@ManyToMany(mappedBy = "genres")
	@JsonIgnore
	private Set<Movie> movies = new HashSet<>();

	@Override
	public int hashCode() {
		return 2023;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		return id != null && id.equals(((Genre) obj).id); 
	}

}

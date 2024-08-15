package com.moonmovie.movie_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.io.Serial;
import java.io.Serializable;

@Document(collection = "seat_detail")
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeatDetail implements Serializable {

	@Serial
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	private String status;
	private int price;
	private String userId;

	private int showingId;

	@DocumentReference
	private Seat seat;

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SeatDetail other = (SeatDetail) obj;
		return id != null && id.equals(((SeatDetail) obj).id);
	}

	@Override
	public int hashCode() {
		return 2024;
	}
}

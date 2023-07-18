package de.lendmove.lendmoveapi.payload;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReservationRequest
{
    public Long id;

    public  Long carId;

    // wenn ein Mitarbeiter die Reservierung einen User machen möchtet.
    public String username;

    // from me
    boolean isPaid;

}

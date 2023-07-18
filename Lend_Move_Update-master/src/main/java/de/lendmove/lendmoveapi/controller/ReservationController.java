package de.lendmove.lendmoveapi.controller;


import com.nimbusds.openid.connect.sdk.assurance.evidences.ElectronicSignatureEvidence;
import de.lendmove.lendmoveapi.entity.*;
import de.lendmove.lendmoveapi.payload.LoginRequest;
import de.lendmove.lendmoveapi.payload.ReservationRequest;
import de.lendmove.lendmoveapi.payload.response.MessageResponse;
import de.lendmove.lendmoveapi.repo.StatusVehiculeRepository;
import de.lendmove.lendmoveapi.repo.UserRepository;
import de.lendmove.lendmoveapi.service.implementation.ReservationService;
import de.lendmove.lendmoveapi.service.implementation.VehiculeService;
import de.lendmove.lendmoveapi.utils.ReservationStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;


@RestController
@RequestMapping("/api/auth/reservation")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReservationController
{
    @Autowired
    ReservationService reservationService;

    @Autowired
    VehiculeService vehiculeService;

    @Autowired
    StatusVehiculeRepository statusVehiculeRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    UserRepository userRepository;

    /**
     * Diese Methode hilft, um eine Reservierung zu machen.
     * status ist in usage un available = true wenn man eine Reservierung macht.
     * @param reservation
     * @return
     */
    @PostMapping("/make")
    public ResponseEntity<?> addReservation(@RequestBody Reservation reservation)
    {
        Map<String, Object> response = new HashMap<>();
        Reservation newReservation = new Reservation();


        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(reservation!=null && reservation.getCarId()!=null)
        {
            if( vehiculeService.findById(reservation.getCarId()).isPresent() ) {
                Vehicule vehicule = vehiculeService.findById(reservation.getCarId()).get();

                if(vehicule.isAvailable()) {
                    vehicule.setAvailable(false);   //Avaible
                    newReservation = reservation;
                    newReservation.setStatus("Activ");
                    newReservation.setPaid(false); // from me
                    newReservation.setAvailable(false);

                    StatusVehicule statusVehicule = statusVehiculeRepository.findByName(EnumStatusVehicule.IN_USAGE).get();
                    vehicule.getStatus().add(statusVehicule);
                    vehiculeService.saveOrUpdate(vehicule);
                    newReservation.setUsername(auth.getName());

                    reservationService.saveOrUpdate(newReservation);


                    // Preis berechnen

                    LocalDate dateStart = LocalDate.parse(reservation.getReservationDateStart());
                    LocalDate dateEnd = LocalDate.parse(reservation.getReservationDateEnd());


                    long daysDifference = ChronoUnit.DAYS.between(dateStart, dateEnd);

                    // Unterschied zwischen Daten berechnen
                    LocalTime timeStart = LocalTime.parse(reservation.getReservationTimeStart());
                    LocalTime timeEnd = LocalTime.parse(reservation.getReservationTimeEnd());

                    // Unterschied zwischen Stunden berechnen
                    Duration duration = Duration.between(timeStart, timeEnd);

                    // Unterschied in Stunden
                    long hoursDifference = duration.toHours();

                    double reservationTime =   ReservationController.calculateHoursDifference(dateStart, dateEnd, timeStart, timeEnd);


                    //Tarif
                  User  theUser = userRepository.findByUsername(reservation.getUsername()).get();
                    System.out.println("the   "+theUser.getCity());

                    String price = ReservationController.calculateRentalPrice(reservationTime,theUser.getTarif());

                    System.out.println("DDDD++++++++++++++++++++++" + price);
                    // Preis berechnen

                    //set price
                    newReservation.setPrice(price);
                    reservationService.saveOrUpdate(newReservation);
                    System.out.println(newReservation + " my newReservation-----------");


                } else {
                    System.out.println("******************ERROR***************\"error\", \"The Car ist not available (ist in Use)");
                    response.put("error", "The Car ist not available (ist in Use)");
                    ResponseEntity<Map<String, Object>> responseEntity = new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                    return responseEntity;

                }
                response.put("message", "New reservation has been added");
                return new ResponseEntity<>(response, HttpStatus.OK);

            }else
            {
                System.out.println("******************ERROR**********************The entered car id does exist");

                response.put("error", "The entered car id does exist");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        }else
        {
            System.out.println("******************ERROR**********************The entered car id does exist or the reservation need more data");

            response.put("error", "The entered car id does exist or the reservation need more data");
            return new ResponseEntity<>(response,HttpStatus.BAD_REQUEST);

        }
    }







    /**
     * Mithilfe dieser Methode kann man mit paypal bezahlen
     * parameter dafür sind email und password
     * @param user
     * @return
     */
    @PostMapping("/paypalPayment")
    public ResponseEntity<?> buyReservationWithPaypal(@RequestBody LoginRequest user) {
        User theUser = new User();
        Map<String, Object> response = new HashMap<>();

        Reservation newReservation = new Reservation();



        if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
            theUser = userRepository.findByEmail(user.getEmail()).get();

            if(encoder.matches(user.getPassword(), theUser.getPassword()))
            {
                System.out.println("user data------ "+ user);

                System.out.println("www   "+encoder.encode(theUser.getPassword()));
                System.out.println("QQ    "+user.getPassword());



                // from Zidane
                newReservation = reservationService.findById(user.getId()).get();

                newReservation.setPaid(true);// from me
                reservationService.saveOrUpdate(newReservation);

                System.out.println("paypal isPaid :  "+ newReservation.isPaid());

                // return new ResponseEntity<>(response, HttpStatus.OK);
                return ResponseEntity.ok(new MessageResponse((" payment was successful")));

            }else {
                System.out.println("user data ++++++++"+ user);

                // return new ResponseEntity<>(response, HttpStatus.OK);
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse(" Daten Stimmen nicht !"));
            }
        }else {
            System.out.println("user data ******** "+ user);

            //   return new ResponseEntity<>(response, HttpStatus.OK);
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(" Verify Email User not found"));
        }
    }


    /**
     * username = accountHolderName
     * password = bankCode
     * @param user
     * @return
     */
    @PostMapping("/bankPayment")
    public ResponseEntity<?> buyReservationWithBankTransfer(@RequestBody LoginRequest user ) {
        User theUser = new User();
        Map<String, Object> response = new HashMap<>();
        Reservation newReservation = new Reservation();

        if (user.getUsername() != null && userRepository.existsByUsername(user.getUsername())) {
            theUser = userRepository.findByUsername(user.getUsername()).get();

            System.out.println(theUser.getPassword());
            System.out.println(user.getPassword());

            if(encoder.matches(user.getPassword(), theUser.getPassword()))
            {            System.out.println("it matches");



                newReservation = reservationService.findById(user.getId()).get();

                newReservation.setPaid(true);// from me
                reservationService.saveOrUpdate(newReservation);

                System.out.println("bankPayment isPaid :  "+ newReservation.isPaid());
                // return new ResponseEntity<>(response, HttpStatus.OK);
                return ResponseEntity.ok(new MessageResponse((" payment was successful")));

            }else {
                // return new ResponseEntity<>(response, HttpStatus.OK);
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse(" Daten stimmen nicht !"));
            }
        }else {
            //   return new ResponseEntity<>(response, HttpStatus.OK);
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(" Verify Username(accountHolderName) User not found"));
        }
    }


    /**
     * Mithilfe dieser Methode kann ein Mitarbeiter eine Reservierung machen.
     * ein zusätzliche parameter hier ist der Username.
     * @param reservation
     * @return
     */

    @PostMapping("/workerMakeReservation")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<?> workerMakeReservation(@RequestBody Reservation reservation)
    {
        Map<String, Object> response = new HashMap<>();
        Reservation newReservation = new Reservation();



        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if(userRepository.existsByUsername(reservation.getUsername())) {

            if (reservation != null && reservation.getCarId() != null) {
                if (vehiculeService.findById(reservation.getCarId()).isPresent()) {
                    Vehicule vehicule = vehiculeService.findById(reservation.getCarId()).get();

                    if (vehicule.isAvailable()) {
                        vehicule.setAvailable(false);   //Avaible

                        newReservation = reservation;

                        newReservation.setStatus("Activ");
                        newReservation.setPaid(false);// from me
                        StatusVehicule statusVehicule = statusVehiculeRepository.findByName(EnumStatusVehicule.IN_USAGE).get();
                        vehicule.getStatus().add(statusVehicule);
                        vehiculeService.saveOrUpdate(vehicule);

                     //   newReservation.setUsername(auth.getName());

                        reservationService.saveOrUpdate(newReservation);


                        // Preis berechnen
                        LocalDate dateStart = LocalDate.parse(reservation.getReservationDateStart());
                        LocalDate dateEnd = LocalDate.parse(reservation.getReservationDateEnd());


                        long daysDifference = ChronoUnit.DAYS.between(dateStart, dateEnd);

                        // Unterschied zwischen Daten berechnen
                        LocalTime timeStart = LocalTime.parse(reservation.getReservationTimeStart());
                        LocalTime timeEnd = LocalTime.parse(reservation.getReservationTimeEnd());

                        // Unterschied zwischen Stunden berechnen
                        Duration duration = Duration.between(timeStart, timeEnd);

                        // Unterschied in Stunden
                        long hoursDifference = duration.toHours();

                        double reservationTime = ReservationController.calculateHoursDifference(dateStart, dateEnd, timeStart, timeEnd);

                        User  theUser = userRepository.findByUsername(reservation.getUsername()).get();

                        String price = ReservationController.calculateRentalPrice(reservationTime, theUser.getTarif());

                        System.out.println("DDDD++++++++++++++++++++++" + price);
                        // Preis berechnen

                        //set price
                        newReservation.setPrice(price);
                        reservationService.saveOrUpdate(newReservation);
                        System.out.println(newReservation + " my newReservation-----------");


                    } else {
                        System.out.println("******************ERROR***************\"error\", \"The Car ist not available (ist in Use)");
                        response.put("error", "The Car ist not available (ist in Use)");
                        ResponseEntity<Map<String, Object>> responseEntity = new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                        return responseEntity;

                    }
                    response.put("message", "New reservation has been added");
                    return new ResponseEntity<>(response, HttpStatus.OK);

                } else {
                    System.out.println("******************ERROR**********************The entered car id does exist");

                    response.put("error", "The entered car id does exist");
                    return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                }
            } else {
                System.out.println("******************ERROR**********************The entered car id does exist or the reservation need more data");

                response.put("error", "The entered car id does exist or the reservation need more data");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

            }
        }else {
            System.out.println("******************ERROR**********************The Username not exit");

            response.put("Error", "The Username not exit");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);

        }

    }

    /**
     * Diese Methode gibt alle Reservation zurück.
     * @param page
     * @param size
     * @param sortBy
     * @param sortDir
     * @return
     */

    @GetMapping("/all")
    public ResponseEntity<?> findAll( @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10000") int size,
                                       @RequestParam(defaultValue = "id") String sortBy, @RequestParam(defaultValue = "asc") String sortDir)
    {
        try {
            List<Reservation> reservations = new ArrayList<>();
            Pageable paging = PageRequest.of(page, size,
                    sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending());
            Page<Reservation> pageReservations = null;

            pageReservations = reservationService.findAll(paging);

            if(pageReservations.getContent()!=null)
            {
                reservations = pageReservations.getContent() ;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("reservations", reservations);
            response.put("currentPage", pageReservations.getNumber());
            response.put("totalItems", pageReservations.getTotalElements());
            response.put("totalPages", pageReservations.getTotalPages());
            response.put("size", pageReservations.getSize());
            response.put("sort", pageReservations.getSort());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Diese Methode gibt alle aktive Reservation züruck.
     * sie benutzt dafür das Attribut status.
     * @param activ
     * @return
     */
    @GetMapping("/user")

    public ResponseEntity<?> findByUserActivReservation(@RequestParam("activ") String activ)
    {

        Map<String, Object> response = new HashMap<>();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        try {

            List<Reservation> userReservation = new ArrayList<>();

                if(activ == "activ")
                {
                    System.out.println("am here active --" +activ);
                    userReservation = reservationService.findAllActivUserReservation(username);
                }else
                {
                    userReservation = reservationService.findAllReservationByUsername(username);
                }

            response.put("reservations", userReservation);
            System.out.println("reservation apid" + userReservation);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "Error by getting all reservations");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * Diese Methode gibt alle aktive Reservation züruck.
     * sie benutzt dafür das Attribut available.
     * @param available
     * @return
     */
    @GetMapping("/user/available")
    public ResponseEntity<?> findByUserActivReservationWithAvailable(boolean available) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        System.out.println("arrived-----------------");
        try {
            List<Reservation> userReservation;

            if (available == false) {
                System.out.println("arrived22-----------------");
                userReservation = reservationService.findAllActivUserReservationWithAvailable(username);
            } else {
                System.out.println("arrived33-----------------");
                userReservation = reservationService.findAllReservationByUsername(username);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("reservations", userReservation != null ? userReservation : new ArrayList<>());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Error by getting all reservations");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Diese Methode findet eine Reservervation mithilfe der Id-Nummer
     * @param value
     * @return
     */

    @GetMapping("/user/one")
    public ResponseEntity<?> findById(@RequestParam(value = "id") Long value) {
        Map<String, Object> response = new HashMap<>();
        Long id = Long.valueOf(value);
        try {
            Reservation reservation = new Reservation();
            if (id != null && reservationService.findById(id).isPresent()) {
                reservation = reservationService.findById(id).get();
                response.put("reservation", reservation);
            } else {
                response.put("error", "Reservation not found with the ID: " + id);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Diese Methode löscht eine Reeservation
     * in Body id von Vehicule eingeben.
     * @param reservationRequest
     * @return
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAReservation(@RequestBody ReservationRequest reservationRequest)
    {
        System.out.println("resquesting data for delete " + reservationRequest);
        Map<String, Object> response = new HashMap<>();
        Vehicule vehicule = vehiculeService.findById(reservationRequest.getCarId()).get();


        try
        {
           if(reservationService.deleteById(reservationRequest.getId()))
           {
               vehicule.setAvailable(true);
             //  reservation.setAvailable(true);

                vehiculeService.saveOrUpdate(vehicule);

               response.put("message", "Reservation deleted");
           }else
           {
               response.put("error", "reservation cannot  been deleted");
           }
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e)
        {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    public static double calculateHoursDifference(LocalDate startDate, LocalDate endDate, LocalTime startTime, LocalTime endTime) {
        long daysDifference = ChronoUnit.DAYS.between(startDate, endDate);

        Duration duration = Duration.between(startTime, endTime);
        long hoursDifference = duration.toHours();

        return daysDifference * 24 + hoursDifference;
    }

    public static  String calculateRentalPrice(double rentalTime, String tariff) {
        double pricePerHour;


       // double reduction = (rentalTime +  Integer.parseInt(tariff) ) / Integer.parseInt(tariff);

        // double invTariff = 1/reduction;

        // Déterminer le prix par heure en fonction du tarif
        if (tariff.equals("basic")) {

            pricePerHour =  20 * (1 /((rentalTime +  10 ) / (10 ))) *8; // tarif basic
            //  pricePerHour =  20.0   * invTariff * 8 ; // Prix par heure pour le tarif basic


        } else if (tariff.equals("normal")) {
            pricePerHour = 15 * (1/((rentalTime +  15 ) / 15 )) * 5.5; //  tarif ermößigt
        } else if (tariff.equals("exclusiv")) {
            pricePerHour = 10 * (1/((rentalTime + 20) / 20)) * 4; //  tarif exklusiv
        } else {
            return "Tarif non valide";
        }

        // Price bezahlen
        double totalPrice = rentalTime * pricePerHour;

        // TO FORMAT
        String formattedPrice = String.format("%.2f", totalPrice);

        return formattedPrice;
    }







}

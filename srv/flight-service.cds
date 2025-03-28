using {sap.capire.flightmodel as my} from '../db/schema';

service FlightService {

  entity Airline          as projection on my.Airlines;
  entity Flight           as projection on my.Flight;
  entity FlightConnection as projection on my.FlightConnection;
  entity Airport          as projection on my.Airport;
  entity Facility         as projection on my.Facility;
}

namespace sap.capire.flightmodel;

using {
  Currency,
  Country
} from '@sap/cds/common';

entity Airlines {
  key AirlineID     : String(3);
      Name          : String(40);
      CurrencyCode  : Currency;
      AirlinePicURL : String @UI: {IsImageURL: true};
};

entity Airport {
  key AirportID   : String(3);
      Name        : String(40);
      City        : String(40);
      CountryCode : Country;
};

entity Flight {
  key AirlineID     : String(3);
  key FlightDate    : Date;
  key ConnectionID  : String(4);
      Price         : Decimal(16, 3);
      CurrencyCode  : Currency;
      PlaneType     : String(10);
      MaximumSeats  : Integer;
      OccupiedSeats : Integer;

      to_Airline    : Association to Airlines
                        on to_Airline.AirlineID = AirlineID;
      to_Connection : Association to FlightConnection
                        on  to_Connection.AirlineID    = AirlineID
                        and to_Connection.ConnectionID = ConnectionID;
};

entity FlightConnection {
      // TODO:
      // once the TODO in Flight is done, similar change can be applied here
      // to_Airline can be managed association and AirlineID can be removed
      // and will be replaced with the generated FK
  key ConnectionID       : String(4);
  key AirlineID          : String(3);
      DepartureAirport   : Association to Airport;
      DestinationAirport : Association to Airport;
      DepartureTime      : Time;
      ArrivalTime        : Time;
      Distance           : Integer;
      DistanceUnit       : String(3);

      to_Airline         : Association to Airlines
                             on to_Airline.AirlineID = AirlineID;
};

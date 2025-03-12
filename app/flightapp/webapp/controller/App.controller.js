sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("sap.capire.app.flightapp.controller.App", {
      onInit() {
        let oNewFlight = {
          AirlineID: "",
          ConnectionID: "",
          FlightDate: null,
        };

        let oFormModel = new JSONModel(oNewFlight);
        this.getView().setModel(oFormModel, "form");
      },

      handleSavePress(evt) {
        let oFlight = this.getView().getModel("form").getData();
        // oFlight.FlightDate = new Date(oFlight.FlightDate);
        this._createFlightV4(oFlight);
      },

      _createFlightV4: function (oFlight) {
        var oContext = this.getView().byId("tblFlights").getBinding("items");

        oContext.create(oFlight);

        oContext.created().then(
          function () {
            //Flight Successfully created
          },
          function (oError) {
            //Flight failed
            // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
            if (!oError.canceled) {
              throw oError; // unexpected error
            }
          }
        );
      },
    });
  }
);

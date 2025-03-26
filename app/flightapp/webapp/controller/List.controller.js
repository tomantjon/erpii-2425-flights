sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (Controller, JSONModel, MessageToast, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("sap.capire.app.flightapp.controller.List", {
      onInit() {
        let oNewFlight = {
          AirlineID: "",
          ConnectionID: "",
          FlightDate: null,
        };

        let oFormModel = new JSONModel(oNewFlight);
        this.getView().setModel(oFormModel, "form");
      },

      onSearch: function (oEvent) {
        // add filter for search
        var aFilters = [];
        var sQuery = oEvent.getSource().getValue();
        if (sQuery && sQuery.length > 0) {
          //simple filter
          // var filter = new Filter(
          //   "to_Airline/Name",
          //   FilterOperator.Contains,
          //   sQuery
          // );
          //Advanced Filter
          var filter = new Filter({
            path: "to_Airline/Name",
            operator: FilterOperator.Contains,
            value1: sQuery,
            caseSensitive: false,
          });
          aFilters.push(filter);
        }

        // update list binding
        var oList = this.byId("tblFlights");
        var oBinding = oList.getBinding("items");
        oBinding.filter(aFilters, "Application");
      },

      handleSavePress(evt) {
        let oFlight = this.getView().getModel("form").getData();
        // oFlight.FlightDate = new Date(oFlight.FlightDate);
        this._createFlightV4(oFlight);
      },

      handleListItemPressed: function (oEvent) {
        let oContext = oEvent.getSource().getBindingContext();
        let sItemPath = oContext.getPath().substr(1);

        let oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("DetailRoute", { path: sItemPath });
      },

      _createFlightV4: function (oFlight) {
        var oDataListBinding = this.getView()
          .byId("tblFlights")
          .getBinding("items");

        //Return a promise for the create
        var oContext = oDataListBinding.create(oFlight);

        // Note: This promise fails only if the transient entity is canceled,
        //   i.e. deleted by either deleting the transient context or by resetting pending changes
        oContext.created().then(
          function () {
            //Flight Successfully created
            MessageToast.show("Flight added");
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

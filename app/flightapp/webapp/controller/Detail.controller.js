sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/Token",
    "sap/ui/table/Column",
    "sap/m/Column",
  ],
  (Controller, Token, UIColumn, MColumn) => {
    "use strict";

    return Controller.extend("sap.capire.app.flightapp.controller.Detail", {
      onInit() {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter
          .getRoute("DetailRoute")
          .attachPatternMatched(this._onRouteMatched, this);
      },

      _onRouteMatched: function (oEvent) {
        console.log("Route matched");
        let oArgs = oEvent.getParameter("arguments");
        var urlPath = "/" + oArgs.path;

        //bind the context of the base model to a specific flight, and not to the full entity /Flight
        this.getView().bindElement(urlPath);

        //set the default tokens when loading the page

        this._oMultiInput = this.byId("multiInput");
        // Run the underlying line of code to put fill the multiInput with already configured facilities
        this._setDefaultTokens();
      },

      _setDefaultTokens: function () {
        this._oMultiInput.setTokens(this._getDefaultTokens());
      },

      // #region Value Help Dialog standard use case with filter bar without filter suggestions
      onValueHelpRequested: function () {
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "sap.capire.app.flightapp.fragment.ValueHelpDialogFacility",
          });
        }
        this.pDialog.then(
          function (oDialog) {
            this._oVHD = oDialog;
            // Initialise the dialog with model only the first time. Then only open it
            if (this._bDialogInitialized) {
              // Re-set the tokens from the input and update the table
              oDialog.setTokens([]);
              oDialog.setTokens(this._oMultiInput.getTokens());
              oDialog.update();

              oDialog.open();
              return;
            }
            this.getView().addDependent(oDialog);

            oDialog.getTableAsync().then(
              function (oTable) {
                //get the v2 ODataModel
                var oDataModel = this.getView().getModel("v2Model");
                oTable.setModel(oDataModel);

                // For Desktop and tabled the default table is sap.ui.table.Table
                if (oTable.bindRows) {
                  // Bind rows to the ODataModel and add columns
                  oTable.bindAggregation("rows", {
                    path: "/Facility",
                    events: {
                      dataReceived: function () {
                        oDialog.update();
                      },
                    },
                  });
                  oTable.addColumn(
                    new UIColumn({
                      label: "Facility",
                      template: "Name",
                    })
                  );
                  oTable.addColumn(
                    new UIColumn({
                      label: "Description",
                      template: "Description",
                    })
                  );
                }

                // For Mobile the default table is sap.m.Table
                if (oTable.bindItems) {
                  // Bind items to the ODataModel and add columns
                  oTable.bindAggregation("items", {
                    path: "/Facility",
                    template: new ColumnListItem({
                      cells: [
                        new Label({ text: "{Name}" }),
                        new Label({ text: "{Description}" }),
                      ],
                    }),
                    events: {
                      dataReceived: function () {
                        oDialog.update();
                      },
                    },
                  });
                  oTable.addColumn(
                    new MColumn({ header: new Label({ text: "Name" }) })
                  );
                  oTable.addColumn(
                    new MColumn({ header: new Label({ text: "Description" }) })
                  );
                }
                oDialog.update();
              }.bind(this)
            );

            oDialog.setTokens(this._oMultiInput.getTokens());

            // set flag that the dialog is initialized
            this._bDialogInitialized = true;
            oDialog.open();
          }.bind(this)
        );
      },

      onValueHelpOkPress: function (oEvent) {
        var aTokens = oEvent.getParameter("tokens");
        //TODO: Update Flight entity to store the facilities for this flight

        this._oMultiInput.setTokens(aTokens);
        this._oVHD.close();
      },

      onValueHelpCancelPress: function () {
        this._oVHD.close();
      },

      // Internal helper methods
      _getDefaultTokens: function () {
        //TODO: Replace hard-coded tokens with the actual facilities of the flight entity
        var oToken1 = new Token({
          key: "2c76c234-10e7-417f-9352-95bfefff72d7",
          text: "In-flight Magazines",
        });

        var oToken2 = new Token({
          key: "aa60670a-d224-4a1d-b3de-725d1bce6310",
          text: "Wi-Fi",
        });

        return [oToken1, oToken2];
      },
    });
  }
);

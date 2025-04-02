sap.ui.define(
  [
    "sap/capire/app/flightapp/controller/BaseController",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
  ],
  (BaseController, MessageToast, MessageBox) => {
    "use strict";

    return BaseController.extend("sap.capire.app.flightapp.controller.Detail", {
      onInit() {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter
          .getRoute("DetailRoute")
          .attachPatternMatched(this._onRouteMatched, this);

        this.byId("edit").setEnabled(true);
        this._formFragments = {};
        // Set the initial form to be the display one
        this._showFormFragment("FlightDetailDisplay");
      },

      _onRouteMatched: function (oEvent) {
        console.log("Route matched");
        let oArgs = oEvent.getParameter("arguments");
        var urlPath = "/" + oArgs.path;

        //bind the context of the base model to a specific flight, and not to the full entity /Flight
        this.getView().bindElement({
          path: urlPath,
          parameters: {
            $count: true,
            $$updateGroupId: "flightGroup",
          },
        });
      },

      handleEditPress: function () {
        this._toggleButtonsAndView(true);
      },

      handleSavePress: function () {
        var fnSuccess = function () {
          MessageToast.show(this._getText("changesSentMessage"));
        }.bind(this);

        var fnError = function (oError) {
          MessageBox.error(oError.message);
        }.bind(this);

        this.getView()
          .getModel()
          .submitBatch("flightGroup")
          .then(fnSuccess, fnError);

        this._toggleButtonsAndView(false);
      },

      handleCancelPress: function () {
        //Restore the data
        this.getView().getBindingContext().resetChanges();
        this._toggleButtonsAndView(false);
      },

      _toggleButtonsAndView: function (bEdit) {
        var oView = this.getView();

        // Show the appropriate action buttons
        oView.byId("edit").setVisible(!bEdit);
        oView.byId("btnSaveFlightDetails").setVisible(bEdit);
        oView.byId("cancel").setVisible(bEdit);

        // Set the right form type
        this._showFormFragment(
          bEdit ? "FlightDetailChange" : "FlightDetailDisplay"
        );
      },

      _showFormFragment: function (sFragmentName) {
        var oPage = this.byId("pgDetail");

        oPage.removeAllContent();
        this._getFormFragment(sFragmentName).then(function (oVBox) {
          oPage.insertContent(oVBox);
        });
      },

      _getFormFragment: function (sFragmentName) {
        var pFormFragment = this._formFragments[sFragmentName];

        if (!pFormFragment) {
          pFormFragment = this.loadFragment({
            name: "sap.capire.app.flightapp.fragment." + sFragmentName,
          });
          this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
      },
    });
  }
);

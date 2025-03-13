sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
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
      console.log(oArgs.name);
    },
  });
});

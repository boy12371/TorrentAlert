FlowRouter.wait();

document.addEventListener("WebComponentsReady", function() {
  FlowRouter.initialize({
    // hashbang: true
  });

  Meteor.setTimeout(function() {
    document.querySelector("#load_awesome").active = false;
  }, 1000 * 4);
});

var main = FlowRouter.group({
  name: "main",
  prefix: "/main",
  triggersEnter: [function(context, redirect) {
    if (Meteor.status().connected) {
      if (!Meteor.user()) {
        FlowRouter.go("/");
      }
    } else { // offline
      if (!(localStorage.favorite || []).length) { // localstorage
        FlowRouter.go("/");
      }
    }
  }]
});

main.route("/", {
  action: function(p, q) {
    mwcLayout.render("main-layout", {
      "body": "main-layout"
    });

    switch (FlowRouter.getQueryParam("route")) {
      case "add-project":
      case "search-list":
        document.querySelector("#old_layout").selected = FlowRouter.getQueryParam("route");
        break;

      case "favorite-list":
        document.querySelector("#old_layout").selected = "favorite-layout";
        document.querySelector("#favorite_layout").selected = FlowRouter.getQueryParam("route");

        if (Meteor.isCordova) {
          StatusBar.backgroundColorByHexString("#1976D2"); // blue-700
        }
        break;

      case "favorite-torrent-view":
        if (document.querySelector("#favorite_torrent_view").item._id) {
          document.querySelector("#old_layout").selected = "favorite-layout";
          document.querySelector("#favorite_layout").selected = FlowRouter.getQueryParam("route");
        } else {
          FlowRouter.setQueryParams({
            route: (FlowRouter.getQueryParam("back-route") ? FlowRouter.getQueryParam("back-route") : null)
          });
        }
        break;

      case "project-view":
        if (FlowRouter.getQueryParam("project")) {
          document.querySelector("#old_layout").selected = "project-layout";
          document.querySelector("#project_layout").selected = FlowRouter.getQueryParam("route");

          if (Meteor.isCordova) {
            var A = polymer_color(FlowRouter.getQueryParam("project"));

            var Z = _.find(polymer_color_class, function(item) {
              return (A == item.class);
            });

            if (Z) { // hex
              StatusBar.backgroundColorByHexString(Z.hex);
            }
          }
        } else {
          FlowRouter.setQueryParams({
            route: null
          });
        }
        break;

      case "project-torrent-view":
        if (document.querySelector("#project_torrent_view").item._id) {
          document.querySelector("#old_layout").selected = "project-layout";
          document.querySelector("#project_layout").selected = FlowRouter.getQueryParam("route");
        } else {
          FlowRouter.setQueryParams({
            route: (FlowRouter.getQueryParam("back-route") ? FlowRouter.getQueryParam("back-route") : null)
          });
        }
        break;

      default:
        document.querySelector("#old_layout").selected = "trending-list";

        if (Meteor.isCordova) {
          StatusBar.backgroundColorByHexString("#0097A7"); // cyan-700
        }
        break;
    }
  },
  name: "main-layout"
});

main.route("/sign-out", {
  action: function(p, q) {
    if (Meteor.status().connected) {
      localStorage.clear();

      if (Meteor.isCordova) {
        window.plugins.googleplus.disconnect(
          function(response) {
            console.log(response);
          }
        );
      }

      Meteor.logout(function(error) {
        if (error) {
          console.log(error);
        }
      });

      FlowRouter.go("/");
    } else {
      document.querySelector("#polymer_toast").toast("server connection required");
    }
  },
  name: "sign-out"
});

FlowRouter.route("/set-password", {
  action: function(p, q) {
    mwcLayout.render("set-password", {
      body: "set-password"
    });
  },
  name: "set-password"
});

FlowRouter.route("/", {
  action: function(p, q) {
    mwcLayout.render("user-check", {
      body: "user-check"
    });

    switch (FlowRouter.getQueryParam("route")) {
      case "sign-in":
        document.querySelector("user-check-layout").sharedElements = {
          "reverse-ripple": document.querySelector("#sign-in"),
          ripple: document.querySelector("#sign-in")
        };

        document.querySelector("user-check").selected = "sign-in";
        break;

      case "sign-up":
        document.querySelector("user-check-layout").sharedElements = {
          "reverse-ripple": document.querySelector("#sign-up"),
          ripple: document.querySelector("#sign-up")
        };

        document.querySelector("user-check").selected = "sign-up";
        break;

      default:
        document.querySelector("user-check").selected = "layout";
        break;
    }
  },
  name: "user-check"
});
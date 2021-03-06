Meteor.methods({

  search: function(input) {
    this.unblock();

    var user = Meteor.user();
    if (!user) throw new Meteor.Error(422, "userNotFound");

    check(input, String);

    var response = HTTP.call("GET", "http://do.vcompile.com/proxy/get.php", {
      params: {
        url: "http://185.87.146.3/suggestions.php?q=" + input
      },
      timeout: 1000 * 60
    });

    if (response.statusCode === 200) {
      return _.uniq(_.flatten(JSON.parse(response.content)));
    } else {
      console.log("200", response);
    }
  }

});

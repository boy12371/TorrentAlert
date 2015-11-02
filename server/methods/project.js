Meteor.methods({

    insert_project: function(input) {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(422, "userNotFound");

        check(input, {
            keyword: String,
            leech: Match.Integer,
            seed: Match.Integer,
            url: String,
            within: Match.Integer,
            worker: String
        });

        var A = true;

        if (input.worker == "schedule") {
            A = ((_project.find({
                user: user._id,
                worker: input.worker
            }).count() < 4) ? true : false);
        }

        if (A) {
            var row = _project.findOne(input);

            if (row) {
                var update_count = _project.update(input, {
                    $addToSet: {
                        user: user._id
                    },
                    $set: {
                        time: moment().format()
                    }
                }, {
                    multi: true
                });

                if (input.worker == "search" && update_count && !_worker.findOne({
                        project: row._id,
                        status: "",
                        type: input.worker
                    })) {
                    _worker.insert({
                        project: row._id,
                        status: "",
                        time_insert: moment().format(),
                        type: input.worker
                    });
                }

                return row._id;
            } else {
                input.time = moment().format();
                input.torrent = [];
                input.user = [user._id];

                input._id = _project.insert(input);

                if (!_worker.findOne({
                        project: input._id,
                        status: "",
                        type: input.worker
                    })) {
                    _worker.insert({
                        project: input._id,
                        status: "",
                        time_insert: moment().format(),
                        type: input.worker
                    });
                }

                return input._id;
            }
        } else return "";
    }

});
var Q = require("q");
var os = require("os");
var _ = require("lodash");
var Minimatch = require("minimatch").Minimatch;

var projects = require("./projects");
var utils = require("./utils");

module.exports = function(codebox) {
    var workspaceRoot = codebox.workspace.root();

    codebox.logger.log("start run services");

    codebox.rpc.service("project", {
        // Return info about the detected project
        detect: function() {
            return projects.detect(workspaceRoot);
        },

        // Return list of files
        files: function() {
            return projects.detect(workspaceRoot)
            .then(function(projects) {
                var ignoreRules = _.chain(projects)
                    .pluck("ignoreRules")
                    .flatten()
                    .compact()
                    .concat()
                    .map(function(rule) {
                        return new Minimatch(rule, {
                            matchBase: true,
                            dot: true,
                            flipNegate: true
                        });
                    })
                    .value();

                return utils.exec(
                    '((git ls-files ; git ls-files --others --exclude-standard) || find . -type f)',
                    {
                        cwd: workspaceRoot
                    }
                )
                .get('stdout')
                .then(function(stdout) {
                    var files = _.compact(stdout.split(os.EOL));

                    return _.filter(files, function(file) {
                        if (file[0] != "/") file = "/"+file;
                        return !_.any(_.map(ignoreRules, function(rule) {
                            return rule.match(file);
                        }));
                    });
                });
            });
        }
    });
};

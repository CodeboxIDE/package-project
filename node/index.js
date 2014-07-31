var projects = require("./projects");

module.exports = function(codebox) {
    var workspaceRoot = codebox.workspace.root();

    codebox.logger.log("start run services");

    codebox.rpc.service("project", {
        detect: function() {
            return projects.detect(workspaceRoot);
        }
    });
};

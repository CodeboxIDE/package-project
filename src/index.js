var settings = require("./settings");

var _ = codebox.require("hr.utils");
var commands = codebox.require("core/commands");
var rpc = codebox.require("core/rpc");
var dialogs = codebox.require("utils/dialogs");

codebox.menubar.createMenu({
    id: "project",
    caption: "Project",
    items: [
        {
            caption: "New Sample Project",
            command: "project.init"
        },
        {
            id: "deploy",
            caption: "Deploy to",
            items: []
        }
    ]
});

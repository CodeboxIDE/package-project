var Q = require("q");
var _ = require("lodash");
var utils = require("../utils");

var SUPPORTED = [
    // PaaS
    require("./appengine"),
    require("./procfile"),
    require("./parse"),
    require("./maven"),

    // Frameworks
    require("./django"),
    require("./gradle"),
    require("./grails"),
    require("./meteor"),

    // Languages
    require("./c"),
    require("./d"),
    require("./dart"),
    require("./go"),
    require("./clojure"),
    require("./java"),
    require("./logo"),
    require("./php"),
    require("./node"),
    require("./play"),
    require("./python"),
    require("./ruby"),
    require("./scala"),
    require("./lua"),

    // Fallbacks
    require("./static"),
    require("./makefile")
];

// Returns true if lang is supported otherwise false
var supports = function(projectDir, projectType) {
    // No detector
    if (!projectType.detector) {
        return Q(false);
    }

    // Detection script
    return utils.execFile('/bin/bash', [projectType.detector, projectDir])
    .fail(function(err) {
        throw err;
    })
    .then(
        _.constant(true),
        _.constant(false)
    );
}

// Detect the project type for a workspace
var detectProjectTypes = function(projectDir) {
    var _supports = _.partial(supports, projectDir);

    // Try all our project types, return first supported
    return Q.all(_.map(SUPPORTED, _supports))
    .then(function(supported_list) {
        var idx = supported_list.indexOf(true);
        if(idx === -1) {
            throw new Error("No supported project");
        }

        // List of supported project types
        return _.chain(SUPPORTED)
        .filter(function(lang, idx) {
            return supported_list[idx];
        })
        .value();
    })
    .fail(_.constant([]));
};


module.exports = {
    detect: detectProjectTypes
};

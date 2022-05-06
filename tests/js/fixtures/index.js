/* eslint-env node */
"use strict";
var fluid = require("infusion");
require("fluid-webdriver");
fluid.webdriver.loadTestingSupport();

// An extension of the standard webdriver test environment that explicitly fails if there are browser errors.
fluid.defaults("fluid.test.codeMirror.environment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        webdriver: {
            options: {
                listeners: {
                    "onError.fail": {
                        funcName: "fluid.fail",
                        args: ["BROWSER ERROR:", "{arguments}.0"]
                    }
                }
            }
        }
    }
});

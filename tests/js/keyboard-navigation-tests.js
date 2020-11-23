/* eslint-env node */
"use strict";
var fluid = require("infusion");
var fluid  = fluid.registerNamespace("fluid");

require("./fixtures");

fluid.defaults("fluid.tests.codeMirror.keyboardNavigation.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    nextFocusableFile:    "%codemirror-infusion/tests/content/keyboard-navigation/next-focusable.html",
    prevFocusableFile:    "%codemirror-infusion/tests/content/keyboard-navigation/prev-focusable.html",
    noOtherFocusableFile: "%codemirror-infusion/tests/content/keyboard-navigation/no-other-focusable.html",
    rawModules: [{
        name: "Testing keyboard navigation...",
        tests: [
            {
                name: "Focus on the editor...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.noOtherFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[fluid.webdriver.Key.TAB]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "#editor textarea"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementSelected",
                        args:     ["The editor should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            },
            {
                name: "Leave the editor when there is a next element to focus on...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.nextFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[fluid.webdriver.Key.TAB, fluid.webdriver.Key.ESCAPE]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementSelected",
                        args:     ["The next focusable element should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            },
            {
                name: "Leave the editor when there is an earlier element in the body to focus on...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.prevFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[fluid.webdriver.Key.TAB, fluid.webdriver.Key.TAB, fluid.webdriver.Key.ESCAPE]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "a"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementSelected",
                        args:     ["The next focusable element should be selected...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            },
            {
                name: "Attempt to leave the editor when there is no other focusable element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.nextFocusableFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [[fluid.webdriver.Key.TAB, fluid.webdriver.Key.ESCAPE]]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "#editor textarea"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "fluid.test.webdriver.testElementSelected",
                        args:     ["Focus should still be on the editor...", "{arguments}.0", true] // message, element, selected
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.codeMirror.keyboardNavigation.testEnvironment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        webdriver: {
            options: {
                browserOptions: {
                    chrome: {
                        nativeEvents: true
                    }
                }
            }
        },
        caseHolder: {
            type: "fluid.tests.codeMirror.keyboardNavigation.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.codeMirror.keyboardNavigation.testEnvironment"});

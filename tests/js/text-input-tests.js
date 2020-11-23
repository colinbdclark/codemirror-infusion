/* eslint-env node */
"use strict";
var fluid = require("infusion");
var fluid  = fluid.registerNamespace("fluid");

require("./fixtures");

fluid.defaults("fluid.tests.codeMirror.textInput.caseHolder", {
    gradeNames: ["fluid.test.webdriver.caseHolder"],
    testHtmlFile: "%codemirror-infusion/tests/content/keyboard-navigation/no-other-focusable.html",
    rawModules: [{
        name: "Testing text input...",
        tests: [
            {
                name: "Navigate to and enter text in the editor...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["@expand:fluid.test.webdriver.resolveFileUrl({that}.options.testHtmlFile)"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.actionsHelper",
                        args:     [{ fn: "sendKeys", args: [fluid.webdriver.Key.TAB, "xxx"]}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onActionsHelperComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [fluid.test.webdriver.invokeGlobal, "editor.getContent"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The content should have been entered...", "xxx", "{arguments}.0"] // message, element, selected
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("fluid.tests.codeMirror.textInput.testEnvironment", {
    gradeNames: ["fluid.test.webdriver.testEnvironment"],
    components: {
        caseHolder: {
            type: "fluid.tests.codeMirror.textInput.caseHolder"
        }
    }
});

fluid.test.webdriver.allBrowsers({ baseTestEnvironment: "fluid.tests.codeMirror.textInput.testEnvironment"});

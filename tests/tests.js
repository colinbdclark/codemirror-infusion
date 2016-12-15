/*global jqUnit, CodeMirror, fluid, $*/

(function () {
    "use strict";

    fluid.registerNamespace("fluid.codeMirror.tests");

    jqUnit.module("Construction tests");

    fluid.codeMirror.tests.testComponentInit = function (cm) {
        jqUnit.expect(3);

        jqUnit.assertTrue("The component reports that CodeMirror was initialized",
            cm.codeMirrorInitialised);
        jqUnit.assertTrue("The CodeMirror instance was initialized",
            cm.editor instanceof CodeMirror);
        jqUnit.assertTrue("The editor is empty by default", cm.isEmpty());
    };

    fluid.codeMirror.tests.testInstantation = function (grade) {
        var cm = fluid.invokeGlobalFunction(grade, ["#code"]);
        fluid.codeMirror.tests.testComponentInit(cm);
    };

    fluid.codeMirror.tests.testInstantationForAllGrades = function (grades) {
        fluid.each(grades, function (grade) {
            jqUnit.test(grade + " instantiation.", function () {
                fluid.codeMirror.tests.testInstantation(grade);
            });
        });
    };

    fluid.codeMirror.tests.componentGrades = [
        "fluid.codeMirror",
        "fluid.lintingCodeMirror"
    ];

    fluid.codeMirror.tests.testInstantationForAllGrades(fluid.codeMirror.tests.componentGrades);

    fluid.defaults("fluid.codeMirror.tests.validationErrorCM", {
        gradeNames: "fluid.lintingCodeMirror",

        value: "{}",
        mode: "application/json",
        listeners: {
            "onValidatedContentChange.assertIsValid": {
                funcName: "jqUnit.assertFalse",
                args: [
                    "A validation error should occur when invalid content is set.",
                    "{arguments}.1"
                ]
            },
            "onValidatedContentChange.start": {
                priority: "after:assertIsValid",
                funcName: "jqUnit.start"
            },
            "onValidatedContentChange.destroyComponent": {
                priority: "after:start",
                func: "{that}.destroy"
            }
        }
    });

    jqUnit.asyncTest("JSON linting validation error", function () {
        jqUnit.expect(2);

        var cm = fluid.codeMirror.tests.validationErrorCM("#code");

        jqUnit.assertTrue("There are no validation errors at the start.",
            $(cm.wrapper).find(".CodeMirror-lint-marker-error"));

        cm.setContent("{cat: \"meow\"}");
    });
})();

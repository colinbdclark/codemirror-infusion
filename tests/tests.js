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

    fluid.defaults("fluid.codeMirror.tests.jsonValidation", {
        gradeNames: "fluid.test.testCaseHolder",

        mergePolicy: {
            "invalidJSON": "noexpand"
        },

        invalidJSON: "{cat: \"meow\"}",

        modules: [
            {
                name: "JSON validation",
                tests: [
                    {
                        name: "set the content to an invalid JSON string",
                        expect: 3,
                        sequence: [
                            {
                                funcName: "fluid.codeMirror.tests.assertNumErrorMarkers",
                                args: [0, "{codeMirror}.dom.errorMark"]
                            },
                            {
                                func: "{codeMirror}.setContent",
                                args: ["{that}.options.invalidJSON"]
                            },
                            {
                                event: "{codeMirror}.events.onValidatedContentChange",
                                listener: "fluid.codeMirror.tests.assertInvalid"
                            },
                            {
                                funcName: "fluid.codeMirror.tests.assertNumErrorMarkers",
                                args: [1, "{codeMirror}.dom.errorMark"]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    fluid.codeMirror.tests.assertInvalid = function (that, isValid) {
        jqUnit.assertFalse("A validation error should occur when invalid content is set.",
            isValid);
    };

    fluid.codeMirror.tests.assertNumErrorMarkers = function (expected, markers) {
        jqUnit.assertEquals(
            "There should be " + expected + " error marker" +
            (expected > 1 || expected === 0 ? "s": ""), expected, markers.length);
    };

    fluid.defaults("fluid.codeMirror.tests.validationTestingEnvironment", {
        gradeNames: "fluid.test.testEnvironment",

        markupFixture: "#main",

        components: {
            codeMirror: {
                type: "fluid.lintingCodeMirror",
                container: "#code",
                options: {
                    value: "{}",
                    mode: "application/json"
                }
            },

            tester: {
                type: "fluid.codeMirror.tests.jsonValidation"
            }
        }
    });
})();

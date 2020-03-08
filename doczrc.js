/**
 * @author WMXPY
 * @namespace Download
 * @description DOCZ_RC
 */

export default {
    title: 'BWNL Print Friendly',
    filterComponents: (files) =>
        files.filter(filePath => /[w-]*.(js|jsx|ts|tsx)$/.test(filePath)),
    codeSandbox: false,
    typescript: true,
}

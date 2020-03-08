/**
 * @author WMXPY
 * @namespace Download
 * @description Declare
 */

export const MAX_DOWNLOAD_THREAD = 10;

export type FileRenameFunction = (originalName: string, index: number) => string;

export type FileConfig = {

    readonly name: string;
    readonly url: string;
};

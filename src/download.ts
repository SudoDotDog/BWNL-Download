/**
 * @author WMXPY
 * @namespace Download
 * @description Download
 */

import { ParallelPool, PromiseFunction } from "@sudoo/asynchronous";
import { HTTP_RESPONSE_CODE } from "@sudoo/magic";
import * as FileSaver from "file-saver";
import * as JSZip from "jszip";
import { FileConfig, FileRenameFunction, MAX_DOWNLOAD_THREAD } from "./declare";

export class ZipFileDownloader {

    public static create(threads: number = MAX_DOWNLOAD_THREAD) {

        return new ZipFileDownloader(threads);
    }

    private readonly _threads: number;

    private _files: FileConfig[];

    private _fileRenameFunction?: FileRenameFunction;

    private constructor(thread: number) {

        this._threads = thread;
        this._files = [];
    }

    public declareFileRenameFunction(fileRenameFunction: FileRenameFunction): this {

        this._fileRenameFunction = fileRenameFunction;
        return this;
    }

    public add(file: FileConfig): this {

        this._files.push(file);
        return this;
    }

    public reset(): this {

        this._files = [];
        return this;
    }

    public async download(zipName: string): Promise<void> {

        const zip: JSZip = new JSZip();

        const list: Array<PromiseFunction<void>> = this._getMappedDownloadFunctions(zip);
        await ParallelPool.create(this._threads).execute(list);

        const binary: Blob = await zip.generateAsync({ type: "blob" });
        FileSaver.saveAs(binary, zipName);

        return;
    }

    private _getMappedDownloadFunctions(zip: JSZip): Array<PromiseFunction<void>> {

        const list: Array<PromiseFunction<void>> = this._files.map((image, index: number) => {

            return async () => {
                const fileName: string = this._parseFileName(image.name, index);
                const response: Response = await fetch(image.url);
                if (response.status === HTTP_RESPONSE_CODE.OK) {
                    const buffer: ArrayBuffer = await response.arrayBuffer();
                    zip.file(fileName, buffer);
                }
            };
        });
        return list;
    }

    private _parseFileName(originalName: string, index: number): string {

        if (this._fileRenameFunction) {
            return this._fileRenameFunction(originalName, index);
        }

        return originalName;
    }
}

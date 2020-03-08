/**
 * @author WMXPY
 * @namespace Download
 * @description Download
 */

import { Parallel, PromiseFunction } from "@sudoo/asynchronous";
import * as FileSaver from "file-saver";
import JSZip from "jszip";

const HTTP_SUCCEED_CORE = 200;
const MAX_DOWNLOAD_THREAD = 10;

export const downloadImages = async (
    images: Array<{
        name: string,
        url: string,
    }>,
    fileNameFunc: (originalName: string, index: number) => string,
    zipName: string,
): Promise<void> => {

    const zip: JSZip = new JSZip();

    const list: Array<PromiseFunction<void>> = images.map((image, index: number) => {

        return async () => {
            const fileName: string = fileNameFunc(image.name, index);
            const response: Response = await fetch(image.url);
            if (response.status === HTTP_SUCCEED_CORE) {
                const buffer: ArrayBuffer = await response.arrayBuffer();
                zip.file(fileName, buffer);
            }
        };
    });

    await Parallel.create(MAX_DOWNLOAD_THREAD).execute(list);

    const binary: Blob = await zip.generateAsync({ type: "blob" });
    FileSaver.saveAs(binary, zipName);

    return;
};

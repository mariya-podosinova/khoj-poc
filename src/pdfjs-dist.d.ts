declare module 'pdfjs-dist/build/pdf' {
    export const GlobalWorkerOptions: any;
    export function getDocument(src: any): any;
}

declare module 'pdfjs-dist/build/pdf.worker.entry' {
    const worker: any;
    export default worker;
}

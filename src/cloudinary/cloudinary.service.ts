import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, UploadApiOptions, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()

export class CloudinaryService {
    async upload(
        file: Buffer,
        type: UploadApiOptions["resource_type"] = "video"
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {

        return new Promise((resolve, reject) => {
            console.log("cloudinary upload")
            const upload = v2.uploader.upload_stream({
                resource_type: type,
                transformation: { format: "mp4" }
            }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });

            toStream(file).pipe(upload);
        });
    }
}
const fs = require('fs');
const request = require('request');

const download = async (url: string, name: string, dest: string, cb: any) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const sendReq = request.get(url);

        // verify response code
        sendReq.on('response', (response: any) => {
            if (response.statusCode !== 200) {
                return cb('Response status was ' + response.statusCode);
            }

            sendReq.pipe(file);
        });

        // close() is async, call cb after close completes
        file.on('finish', () => {
            console.log(`Close file writer for file: ${name}`);
            file.close();

            return resolve();
        });

        // check for request errors
        sendReq.on('error', (err: Error) => {
            fs.unlink(dest, () => {
                return cb(err.message || 'Unlink');
            });

            return reject(err.message);
        });

        file.on('error', (err: Error) => { // Handle errors
            fs.unlink(dest, () => {
                return cb(err.message || 'Unlink');
            }); // Delete the file async. (But we don't check the result)

            return reject(err.message);
        });
    });
};


async function downloadAllPhotos() {
    console.log(`Start downloading images (total images: ${photos.length})`)

    for (let index = 0; photos.length > index; index++) {

        const photoName = photos[index].toString(10);
        const newUrl = `${baseUrl}/${photoName}.jpg`;
        const destinationFile = `${destinationFilePath}/${photoName}.jpg`;

        await download(newUrl, photoName, destinationFile, (e: any) => {
            console.log(e);
        });
    }

    console.log('End downloading images');
}

// Config
const baseUrl = 'https://akamaipictime.azureedge.net/pictures/15/258/16278236/lowres/';

const startIndex = 1060798257;
const stopIndex = 1060798646
const photos = Array.from({length: (stopIndex - startIndex )}, (_, i) => i + startIndex);
// const photos = [
//     1060798257, 1060798258, 1060798259, 1060798260, 1060798261, 1060798262, 1060798263, 1060798264, 1060798265, 1060798266, 1060798267, 1060798268, 1060798269, 1060798270, 1060798271, 1060798272, 1060798273, 1060798274, 1060798275, 1060798276, 1060798277, 1060798278, 1060798279, 1060798280, 1060798281, 1060798282, 1060798283, 1060798284, 1060798285, 1060798286, 1060798287, 1060798288, 1060798289, 1060798290, 1060798291, 1060798292, 1060798293, 1060798294, 1060798295, 1060798296, 1060798297, 1060798298, 1060798299, 1060798300, 1060798301, 1060798302, 1060798303, 1060798304, 1060798305, 1060798306, 1060798307, 1060798308, 1060798309, 1060798310, 1060798311, 1060798312, 1060798313, 1060798314, 1060798315
// ];

const destinationFilePath = 'D:/download';

downloadAllPhotos();



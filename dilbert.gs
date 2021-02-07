/**
 * Main function for GAS to run.
 */
function main() {
    const date = getDate();

    // Ge today's Dilbert comic as a blob
    const {blob, ext} = getImg(getImgSrc(`https://dilbert.com/strip/${date}`));

    blob.setName(`dilbert${date}.${ext}`);

    // Get the current user's email address
    const myEmail = Session.getActiveUser().getEmail();

    // Send the Dilbert comic as an inline image
    MailApp.sendEmail({
        to:       myEmail,
        subject:  `Daily Dilbert Comic ${date}`,
        htmlBody: "<img style='width: 100%' src='cid:dilbertComic'>",
        inlineImages:
        {
            dilbertComic: blob,
        }
    });
}

/**
 * Get the date in the form YYYY-MM-DD
 *
 * @return string
 */
function getDate() {
    const now = new Date();

    const year  = now.getFullYear();

    const month = (now.getMonth() + 1)
        .toString()
        .padStart(2, "0")
    ;

    const day = now.getDate()
        .toString()
        .padStart(2, "0")
    ;

    return `${year}-${month}-${day}`;
}

/**
 * Get the URL to the Dilbert Comic image that is on today's page.
 *
 * @param string url  The URL of the HTML page with today's comic
 *
 * @return string  The Comic Image URL
 */
function getImgSrc(url) {
    const imgs = UrlFetchApp
        // Fetch the HTML page as a string
        .fetch(url)
        .getContentText()
        // Convert the HTML string into an array of lines
        .split("\n")
        // Keep only lines that contain 'img-comic' and '<img'
        .filter(line => line.indexOf("img-comic") !== -1 && line.indexOf('<img ') !== -1)
    ;

    // If we have no images found, then throw an error
    if (imgs.length === 0) {
        throw `No image found for Dilbert Comic at '${url}'`;
    }

    // If there is more than 1 image found then also throw an error
    if (imgs.length > 1) {
        throw `More than one image found for Dilbert Comic at '${url}'`;
    }

    // Remove all the unnecessary stuff from this line, leaving just the img
    // src URL.
    const src = imgs[0]
        .replace(/^.* src=["']/, "")
        .replace(/["'].*$/, "")
    ;

    // TODO: Check that src is a valid URL

    return src;
}

/**
 * Given the URL to an image file, retrieve that image as a blob and the file
 * extension
 *
 * @param string url  The URL of the image file.
 *
 * @return object  The object contains a blob which is the image itself, plus
 *                 the file extension of that image.
 */
function getImg(url) {
    let imgFile;
    try {
        imgFile = UrlFetchApp.fetch(url).getBlob();
    } catch (e) {
        throw `Failed to retrieve data from '${url}'`
    }

    // make sure the content type is an image file
    if (imgFile.getContentType().indexOf("image/") !== 0) {
        throw `The file at ${url} is not an image file.`;
    }

    const ext = imgFile.getName().replace(/^.*\./, "");

    return {
        blob: imgFile,
        ext:  ext,
    };
}

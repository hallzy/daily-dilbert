const myEmail = Session.getActiveUser().getEmail();
let to = [
    myEmail,
    // Add more emails here if you want
];

// Entry point for GAS
function main() {
    const date = getDate();

    const {blob, ext} = getImg(getImgSrc(`https://dilbert.com/strip/${date}`));

    blob.setName(`dilbert${date}.${ext}`);

    MailApp.sendEmail({
        to:       to.join(", "),
        subject:  `Daily Dilbert Comic ${date}`,
        htmlBody: "<img style='width: 100%' src='cid:dilbertComic'>",
        inlineImages:
        {
            dilbertComic: blob,
        }
    });
}

// Entry point for GAS
function mainDebug() {
    to = [ myEmail ];
    main();
}

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

function getImgSrc(url) {
    const lineIsComicImage = (line) => line.indexOf("img-comic") !== -1 && line.indexOf('<img ') !== -1;

    const imgs = UrlFetchApp
        .fetch(url)
        .getContentText()
        .split("\n")
        .filter(lineIsComicImage)
    ;

    if (imgs.length === 0) {
        throw `No image found for Dilbert Comic at '${url}'`;
    }

    if (imgs.length > 1) {
        throw `More than one image found for Dilbert Comic at '${url}'`;
    }

    const src = imgs[0]
        .replace(/^.* src=["']/, "")
        .replace(/["'].*$/, "")
    ;

    // TODO: Check that src is a valid URL

    return src;
}

function getImg(url) {
    let blob;
    try {
        blob = UrlFetchApp.fetch(url).getBlob();
    } catch (e) {
        throw `Failed to retrieve data from '${url}'`
    }

    const contentTypeIsImage = blob.getContentType().indexOf("image/") === 0
    if (!contentTypeIsImage) {
        throw `The file at ${url} is not an image file.`;
    }

    const ext = blob.getName().replace(/^.*\./, "");

    return { blob, ext };
}

const QRCode = require("qrcode");

const generateQRCode = async (data: any) => {
    return QRCode.toDataURL(JSON.stringify(data));
};

module.exports = { generateQRCode };
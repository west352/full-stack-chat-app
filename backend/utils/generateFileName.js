import crypto from 'crypto'

export const generateFileName = (fileType, bytes = 32) => {
    let name = crypto.randomBytes(bytes).toString('hex');
    const type = fileType.split("/")[1];
    return name + "." + type;
}
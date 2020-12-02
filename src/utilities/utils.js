
let  digits = {'0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'A':10,'B':11, 'C':12, 'D':13, 'E':14, 'F':15};


const hexToByteArray = command => {
    console.log(command);
    var bytes = [];
    for (var i = 0; i < command.length; i += 2) {
        let first = digits[command[i]];
        let second = digits[command[i+1]];
        bytes.push( (first << 4) + second);
    }
    console.log(bytes);
    return Buffer.from(bytes);
}

 const bufferToAscii = data => {
    let third_size = data[2];
    let fourth_size = data[3];

    let array_size = third_size + fourth_size;
    if (data.length >= array_size) {
        let first_header = data[0];
        let second_header = data[1];
        let first_footer = data[data.length - 2];
        let second_footer = data[data.length - 1];
        let valid = (first_header == 72) && (second_header == 65) && (first_footer == 13) && (second_footer == 10);
        if (valid) {
            let dataValueBytes = data.slice(12, data.length - 4);
            console.log(dataValueBytes);
            if (dataValueBytes.length > 0) {
                let hexArray = ['0', '1', '2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
                let hexChars = [];
                for (var j = 0; j < dataValueBytes.length; j++) {
                    let v =  dataValueBytes[j] & 0xFF;
                    hexChars.push(hexArray[v >> 4]);
                    hexChars.push(hexArray[v & 0x0F]);
                }
                hexString = hexChars.join("");
                let asciiString = ""; 

                for (var i = 0; i < hexString.length; i += 2) {
                    let str = hexString.substring(i, i + 2);
                    asciiString += String.fromCharCode(parseInt(str,16));
                }
                return asciiString;
            }
        }
    }
    return "";

 }

export default {
    hexToByteArray,
    bufferToAscii
}
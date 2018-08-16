module.exports.decode = buffer => {
    let json = { unks: [] }

    json.unks.push(buffer.readInt32())
    if(buffer.readByte()) { // we have a team mate
        json.player2 = {}
        json.player2.name = buffer.readIString()
    }

    json.senderTrophies = buffer.readRrsInt32()

    if(buffer.readByte()) { // we have a partner
        json.player2.unk1 = buffer.readByte() // 00
        json.player2.unk2 = buffer.readByte() // 02
        json.player2.id = buffer.readInt64()
    } else {
        json.unks.push(buffer.readByte())
        json.unks.push(buffer.readByte())
    }

    json.gameMode = buffer.readRrsInt32() * 1000000 + buffer.readRrsInt32()
    json.type = buffer.readByte()

    switch(json.type) {
        case 0: // normal game
            break

        case 2: // special event live
            // these are the TvT Friendly game modes
            if([72000014, 72000022, 72000023, 72000029, 72000030, 72000034, 72000036, 72000038, 72000040, 72000049, 72000051, 72000053, 72000055, 72000057].includes(json.gameMode) ) {
                json.otherPlayers = [buffer.readIString(), buffer.readIString()]
                json.unk5 = buffer.readByte()
            }
            /* falls through */

        case 8: // special event not filled
        case 9: // special event filled
            json.unks.push(buffer.readByte())
            json.unks.push(buffer.readByte())
            json.eventInfo = {
                buttonText: buffer.readIString(),
                unk1: buffer.readByte(),
                announceOn: buffer.readRrsInt32(),
                endsOn: buffer.readRrsInt32(),
                startsOn: buffer.readRrsInt32(),
                unk2: buffer.readInt64(),
                buttonText2: buffer.readIString(),
                details: buffer.readIString(),
                unk3: buffer.readByte()
            }
            break

        default:
            console.log('unknown state: ' + json.state)
    }

    buffer.readByte() // 7F

    return json
}

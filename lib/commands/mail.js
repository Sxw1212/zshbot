var entry = require("./entry");
var chat = require("../chat");
var id = require("../id");
var pData = require("../data");

module.exports.execute = function(data) {
    if (data.messageType != "pm") {
        entry.reply(data, "You should run mail in a private message.");
        return;
    }
    var pub = id.getUser(data.from);
    if (pub) {
        var user = pData.getNick(data.from);
        if (user && user.id == pub) {
            if (data.args[0] == "check") {
                if (user.mail) {
                    user.mail.forEach(function(v) {
                        entry.reply(data, v);
                    });
                    user.mail = null;
                    pData.setNick(data.from, user);
                } else {
                    entry.reply(data, "No mail");
                }
            } else if (data.args[0] == "send") {
                if (data.args[2]) {
                    data.args.shift();
                    var to = data.args.shift();
                    var message = data.args.join(" ");
                    var toUser = pData.getNick(to);
                    if (toUser) {
                        if (toUser.mail) {
                            toUser.mail.push(data.from + ": " + message);
                        } else {
                            toUser.mail = [data.from + ": " + message];
                        }
                        toUser.mailAlert = true;
                        pData.setNick(to, toUser);
                        entry.reply(data, "Mail sent!");
                    } else {
                        entry.reply(data, "The user does not have a profile with me.");
                    }
                } else {
                    entry.reply(data, "Usage: mail send [nick] message...");
                }
            } else {
                entry.reply(data, "Usage: mail [check|send]");
            }
        } else if (user) {
            entry.reply(data, "Error: Authentication mismatch");
        } else {
            entry.reply(data, "Ask Sam to manually verify your identity and create an account.");
        }
    } else if (pub === "") {
        entry.reply(data, "To access authenticated features, generate an SSH key.");
    } else {
        entry.reply(data, "Validating your identity. Try again in a few seconds.");
        chat.send("/whois " + data.from);
    }
};

module.exports.help = "Send somebody mail if they are AFK or offline";

const request = require("request");
const r = require("readline-sync");
const setTitle = require("console-title");
const chalk = require("chalk");
const fs = require("fs");
const path = require('path');

const tokens = [...new Set(fs.readFileSync('tokens.txt', 'utf-8').replace(/\r/g, '').split('\n'))];

setTitle(`\u276F Udxrs Token Checker | ${tokens.length} Tokens Loaded! \u276E`)
let timeout = r.question(chalk.redBright("[>] ") + "Timeout: ")
console.clear();

let valid_i = 0;
let unverified_i = 0;
let invalid_i = 0;

let token_i= 0;

clear()

let checkInterval = setInterval(function(){
    let token = tokens[token_i++]
    if(token_i >= tokens.length){
        clearInterval(checkInterval)
        console.log(chalk.redBright("\n[-]") + " Finished checking tokens " + chalk.redBright("[-]"))
        r.question()
    }
    check(token)
}, timeout)

async function check(token){
    request.get({
        url: 'https://discord.com/api/v6/users/@me/guilds',
        json: true,
        headers: {
            "Content-Type": "application/json",
            "Authorization": token,
        }
    }, (err, body, res) => {
        if(err)return console.log(err)

        if(token == undefined){
            invalid_i++
        }
        else if(body.statusCode == 429){
            console.log(chalk.redBright("[-]") + " RATE LIMIT " + chalk.redBright("[-]"))
        }
        else if(body.statusCode == 403){
            unverified_i++
            console.log(chalk.cyanBright("[-]") + ` UNVERIFIED => ${token} ` + chalk.cyanBright("[-]"))
            fs.appendFile("./results/Tokens Unverified.txt", token + "\n", function(err){ if(err)return })
        }
        else if(body.statusCode == 200){
            valid_i++
            console.log(chalk.greenBright("[-]") + ` VALID => ${token} ` + chalk.greenBright("[-]"))
            fs.appendFile("./results/Tokens Valid.txt", token + "\n", function(err){ if(err)return })
        }
        else if(body.statusCode == 401){
            invalid_i++
            console.log(chalk.redBright("[-]") + ` INVALID => ${token} ` + chalk.redBright("[-]"))
            fs.appendFile("./results/Tokens Invalid.txt", token + "\n", function(err){ if(err)return })
        }else{
            console.log(chalk.redBright("[-]") + ` UNKNOWN => ${err} ` + chalk.redBright("[-]"))
        }
        let total = unverified_i + valid_i + invalid_i
        setTitle(`\u276F Udxrs Token Checker | ${unverified_i} Unverified | ${valid_i} Valid | ${invalid_i} Invalid | ${total}/${tokens.length} Checked \u276E`)
    })
}

async function clear(){
    fs.writeFileSync("./results/Tokens Valid.txt", "", function(err){ if(err)return })
    fs.writeFileSync("./results/Tokens Unverified.txt", "", function(err){ if(err)return })
    fs.writeFileSync("./results/Tokens Invalid.txt", "", function(err){ if(err)return })
}